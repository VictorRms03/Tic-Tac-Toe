const express = require('express');
const cors = require('cors');
const app = express();
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

app.get('/api/createGame', (req, res) => {

    player1 = ( ( Math.floor( Math.random()*2 ) + 1 ) == 1  ) ? "X" : "O";

    actualPlayer = ( ( Math.floor( Math.random()*2 ) + 1 ) == 1  ) ? "X" : "O";

    for(i=0; i<9; i++){
        board.get(i).content = null;
    }

    res.json({ actualPlayer: actualPlayer, board:Object.fromEntries(board), myPlayer: player1 });

    console.log("/api/createGame - SUCCESS");

});

app.get('/api/joinGame', (req, res) => {

    const player2 = (player1 == "X" ? "O" : "X");

    res.json({ actualPlayer: actualPlayer, board:Object.fromEntries(board), myPlayer: player2 });

    console.log("/api/joinGame - SUCCESS");

});

app.post('/api/doRound', (req, res) => {

    const { target } = req.body;

    board.get(target).content = actualPlayer;

    console.log(actualPlayer + " marcou " + target);

    if ( isWin(target) ) {

        res.json({ actualPlayer: actualPlayer, board:Object.fromEntries(board), isWin:true });

    } else {

        switchPlayer();
    
        res.json({ actualPlayer: actualPlayer, board:Object.fromEntries(board), isWin:false });

    }

    console.log("/api/doRound - SUCCESS");

});

app.listen(PORT, () => {
  console.log(`🔙 Servidor Express rodando em http://localhost:${PORT}`);
});

function isWin( idLastTarget ) {

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

// 0 1 2
// 3 4 5
// 6 7 8