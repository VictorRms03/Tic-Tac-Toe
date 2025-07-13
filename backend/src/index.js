const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3001;

app.use(cors());
app.use(express.json());

let player1 = null;
let actualPlayer = null;
const board = new Map([
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

function switchPlayer() {
    actualPlayer = (actualPlayer === 'X' ? 'O' : 'X');
}

function verifyWin( idLastTarget ) {

    const cell = board.get(idLastTarget);
    let isWin = false

    // Verifica Coluna
    if ( !isWin && (idLastTarget == 0 || idLastTarget == 1 || idLastTarget == 2) ) {

        if ( cell.content == board.get(idLastTarget+3).content && cell.content == board.get(idLastTarget+6).content ) {
            isWin = true;
        }

    } else if ( !isWin && (idLastTarget == 3 || idLastTarget == 4 || idLastTarget == 5) ) {

        if ( cell.content == board.get(idLastTarget+3).content && cell.content == board.get(idLastTarget-3).content ) {
            isWin = true;
        }

    } else if ( !isWin && (idLastTarget == 6 || idLastTarget == 7 || idLastTarget == 8) ) {

        if ( cell.content == board.get(idLastTarget-3).content && cell.content == board.get(idLastTarget-6).content ) {
            isWin = true;
        }

    }

    // Verifica Linha
    if ( !isWin && (idLastTarget == 0 || idLastTarget == 3 || idLastTarget == 6) ) {

        if ( cell.content == board.get(idLastTarget+1).content && cell.content == board.get(idLastTarget+2).content ) {
            isWin = true;
        }

    } else if ( !isWin && (idLastTarget == 1 || idLastTarget == 4 || idLastTarget == 7) ) {

        if ( cell.content == board.get(idLastTarget+1).content && cell.content == board.get(idLastTarget-1).content ) {
            isWin = true;
        }

    } else if ( !isWin && (idLastTarget == 2 || idLastTarget == 5 || idLastTarget == 8) ) {

        if ( cell.content == board.get(idLastTarget-1).content && cell.content == board.get(idLastTarget-2).content ) {
            isWin = true;
        }

    }

    // Verifica Diagonais

    if ( !isWin && (idLastTarget == 2 || idLastTarget == 4 || idLastTarget == 6) ) {

        if ( board.get(2).content == board.get(4).content && board.get(2).content == board.get(6).content ) {
            isWin = true;
        }

    } else if ( !isWin && (idLastTarget == 0 || idLastTarget == 4 || idLastTarget == 8) ) {

        if ( board.get(0).content == board.get(4).content && board.get(0).content == board.get(8).content ) {
            isWin = true;
        }

    }

    return isWin;

}

wss.on("connection", (ws) => {

    ws.on("message", (msg) => {

        const data = JSON.parse(msg);

        if ( data.type === "createGame" ) {

            player1 = ( ( Math.floor( Math.random()*2 ) + 1 ) == 1  ) ? "X" : "O";

            actualPlayer = ( ( Math.floor( Math.random()*2 ) + 1 ) == 1  ) ? "X" : "O";

            for(i=0; i<9; i++) { board.get(i).content = null; }

            ws.send(JSON.stringify({ type:"createGameResponse", actualPlayer: actualPlayer, board:Object.fromEntries(board), myPlayer: player1 }));

            console.log("ws:createGame - SUCCESS");

        } else if (data.type === "joinGame") {

            const player2 = (player1 == "X" ? "O" : "X");

            ws.send(JSON.stringify({ type:"joinGameResponse", actualPlayer: actualPlayer, board:Object.fromEntries(board), myPlayer: player2 }));

            console.log("ws:joinGame - SUCCESS");

        } else if (data.type === "doRound") {

            const target = data.target;
            let isWin = false;

            board.get(target).content = actualPlayer;

            console.log(actualPlayer + " marcou " + target);

            verifyWin(target) ? isWin = true : switchPlayer();

            wss.clients.forEach( (client) => {
                if ( client.readyState === WebSocket.OPEN ) {
                    client.send(JSON.stringify({ type: "doRoundResponse", actualPlayer: actualPlayer, board: Object.fromEntries(board), isWin: isWin }));
                }
            });

            console.log("ws:doRound - SUCCESS");

        }
    });

});

server.listen(PORT, () => console.log("Servidor rodando em http://localhost:"+PORT) );
