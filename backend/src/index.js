const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3001;

/*const corsOptions = {
  origin: 'https://meujogo.vercel.app',
  methods: ['GET', 'POST'],
  credentials: true
};*/

app.use( cors(/*corsOptions*/) );
app.use(express.json());

const games = {}; // Lista dos jogos em andamento

/**
 * Cria um tabuleiro vazio
 * @returns Tabuleiro Vazio
 */
function createEmptyBoard() {

    return new Map([
        [0, { content: null }],
        [1, { content: null }],
        [2, { content: null }],
        [3, { content: null }],
        [4, { content: null }],
        [5, { content: null }],
        [6, { content: null }],
        [7, { content: null }],
        [8, { content: null }]
    ]);
}

/**
 * Troca o jogador atual do jogo
 * @param currentPlayer Jogador atual
 * @returns Jogador atual invertido
 */
function switchPlayer(currentPlayer) {
    return currentPlayer === 'X' ? 'O' : 'X';
}

/**
 * Verifica se algum dos jogadores ganhou
 * @param board Tabuleiro do jogo
 * @param idLastTarget Ultima casa preenchida
 * @returns True caso a ultima jogada tenha causado a vitória
 */
function verifyWin( board, idLastTarget ) {

    const cell = board.get(idLastTarget);

    // Verifica Coluna
    if ( idLastTarget == 0 || idLastTarget == 1 || idLastTarget == 2 ) {

        if ( cell.content == board.get(idLastTarget+3).content && cell.content == board.get(idLastTarget+6).content ) {
            return true;
        }

    } else if ( idLastTarget == 3 || idLastTarget == 4 || idLastTarget == 5 ) {

        if ( cell.content == board.get(idLastTarget+3).content && cell.content == board.get(idLastTarget-3).content ) {
            return true;
        }

    } else if ( idLastTarget == 6 || idLastTarget == 7 || idLastTarget == 8 ) {

        if ( cell.content == board.get(idLastTarget-3).content && cell.content == board.get(idLastTarget-6).content ) {
            return true;
        }

    }

    // Verifica Linha
    if ( idLastTarget == 0 || idLastTarget == 3 || idLastTarget == 6 ) {

        if ( cell.content == board.get(idLastTarget+1).content && cell.content == board.get(idLastTarget+2).content ) {
            return true;
        }

    } else if ( idLastTarget == 1 || idLastTarget == 4 || idLastTarget == 7 ) {

        if ( cell.content == board.get(idLastTarget+1).content && cell.content == board.get(idLastTarget-1).content ) {
            return true;
        }

    } else if ( idLastTarget == 2 || idLastTarget == 5 || idLastTarget == 8 ) {

        if ( cell.content == board.get(idLastTarget-1).content && cell.content == board.get(idLastTarget-2).content ) {
            return true;
        }

    }

    // Verifica Diagonal /
    if ( idLastTarget == 2 || idLastTarget == 4 || idLastTarget == 6 ) {

        if ( board.get(2).content == board.get(4).content && board.get(2).content == board.get(6).content ) {
            return true;
        }

    }
    
    // Verifica Diagonal \
    if ( idLastTarget == 0 || idLastTarget == 4 || idLastTarget == 8 ) {

        if ( board.get(0).content == board.get(4).content && board.get(0).content == board.get(8).content ) {
            return true;
        }

    }

    return false;

}

/**
 * Verifica se o jogo empatou
 * @param board Tabuleiro do jogo
 * @returns True caso todas as casas tenham sido preenchidas
 */
function verifyDraw( board ) {

    for( let i=0; i<9; i++){
        if ( board.get(i).content === null ) {
            return false;
        }
    }

    return true;

}

/**
 * Receptor de mensagens do backend para funcionamento do jogo em tempo real
 */
wss.on("connection", (ws) => {

    ws.on("message", (msg) => {

        const data = JSON.parse(msg);

        /**
         * Resposta para requisição de Criação de Jogo
         */
        if ( data.type === "createGame" ) {

            const gameId = uuidv4();
            const playerSymbol = Math.random() < 0.5 ? 'X' : 'O';

            games[gameId] = {
                board: createEmptyBoard(),
                currentPlayer: Math.random() < 0.5 ? 'X' : 'O',
                players: [{ ws, symbol: playerSymbol }]
            }

            ws.send(JSON.stringify({ 
                type:"createGameResponse", 
                gameId, 
                board:Object.fromEntries(games[gameId].board), 
                myPlayerSymbol: playerSymbol, 
                currentPlayer:games[gameId].currentPlayer 
            }));

            console.log("ws:createGame - SUCCESS");

        /**
         * Resposta para requisição de Entrar em Jogo
         */
        } else if (data.type === "joinGame") {

            const { gameId } = data;
            const game = games[gameId];

            if (!game ) {

                ws.send( JSON.stringify({ 
                    type: "joinGameResponse",
                    status: "lobbyNotFound"
                }));

                console.log("ws:joinGame - SUCCESS - Sala Não Encontrada");

            } else if ( game.players.length >= 2 ) { 

                ws.send( JSON.stringify({ 
                    type: "joinGameResponse", 
                    status: "lobbyFull" 
                }));

                console.log("ws:joinGame - SUCCESS - Sala Cheia");

            } else {

                const playerSymbol = game.players[0].symbol === 'X' ? 'O' : 'X';

                game.players.push({ ws, symbol: playerSymbol });

                ws.send( JSON.stringify({
                    type: "joinGameResponse",
                    gameId,
                    myPlayerSymbol: playerSymbol,
                    board: Object.fromEntries(game.board),
                    currentPlayer: game.currentPlayer,
                    status: "lobbyFound"
                }));

            }

            console.log("ws:joinGame - SUCCESS - Sala Encontrada");
        
        /**
         * Resposta para requisição Jogada Feita
         */
        } else if (data.type === "doRound") {

            const { gameId, target } = data;
            const game = games[gameId];
            if (!game) return;

            game.board.get(target).content = game.currentPlayer;

            const isWin = verifyWin(game.board, target);
            const isDraw = verifyDraw(game.board);

            let condition = "running";
            if (isWin) {
                condition = "win";
            } else if (isDraw) {
                condition = "draw";
            }

            if (!isWin) game.currentPlayer = switchPlayer(game.currentPlayer);

            for (const player of game.players) {
                player.ws.send(JSON.stringify({
                    type: "doRoundResponse",
                    board: Object.fromEntries(game.board),
                    currentPlayer: game.currentPlayer,
                    condition: condition
                }));
            }

            if (isWin || isDraw) {
                delete games[gameId];
            }

            console.log("ws:doRound - SUCCESS");

        }
    });

});

server.listen(PORT, () => console.log("Servidor rodando na porta: "+PORT) );
