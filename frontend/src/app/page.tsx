'use client';

import { useState } from 'react';

export default function Home() {

  const [board, setBoard] = useState<any>(new Map());
  const [actualPlayer, setActualPlayer] = useState(null);
  const [myPlayer, setMyPlayer] = useState(null);

  const socket = new WebSocket("ws://localhost:3001");

  socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    if (data.type === "createGameResponse") {

      setBoard(new Map(Object.entries(data.board)));
      setActualPlayer(data.actualPlayer);
      setMyPlayer(data.myPlayer);

    } else if (data.type === "joinGameResponse") {

      setBoard(new Map(Object.entries(data.board)));
      setActualPlayer(data.actualPlayer);
      setMyPlayer(data.myPlayer);

    } if (data.type === "doRoundResponse") {

      const updatedBoard = new Map( Object.entries(data.board).map( ([id, content]) => [Number(id), content] ) );

      setBoard(updatedBoard);
      setActualPlayer(data.actualPlayer);

      data.isWin && finishGame();

    }

  };

  function createGame() {
    socket.send( JSON.stringify( {
      type:"createGame",
    }));
  }

  function joinGame() {
    socket.send( JSON.stringify( {
      type:"joinGame",
    }));
  }

  function doRound(idTarget:number) {
    socket.send( JSON.stringify( {
      type:"doRound",
      target:idTarget
    }));
  }

  function renderButton(id: number) {

    return (
      <button id={id.toString()} onClick={() => doRound(id)} disabled={ ( board.get(id)?.content || actualPlayer !== myPlayer ) }>
        {board.get(id)?.content || ' '}
      </button>
    );

  }

  function finishGame() {
    window.alert( "Parabêns, " + actualPlayer + " Ganhou!");
  }

  return (
    
    <>

    <h2>Jogador: {actualPlayer}</h2>

    <h2>Eu sou: {myPlayer}</h2>

    <button onClick={createGame}>Criar Jogo</button>

    <button onClick={joinGame}>Entrar no jogo</button>

    <div>{renderButton(0)} {renderButton(1)} {renderButton(2)}</div>
    <div>{renderButton(3)} {renderButton(4)} {renderButton(5)}</div>
    <div>{renderButton(6)} {renderButton(7)} {renderButton(8)}</div>
      
    </>
  );
}
