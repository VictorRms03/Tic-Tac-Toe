'use client';

import { useState } from 'react';

export default function Home() {

  const [board, setBoard] = useState<any>(new Map());
  const [actualPlayer, setActualPlayer] = useState(null);
  const [myPlayer, setMyPlayer] = useState(null);

  async function createGame() {

    const res = await fetch('http://localhost:3001/api/createGame', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setBoard(new Map(Object.entries(data.board)));
    setActualPlayer(data.actualPlayer);
    setMyPlayer(data.myPlayer);

  }

  async function joinGame() {

    const res = await fetch('http://localhost:3001/api/joinGame', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    setBoard(new Map(Object.entries(data.board)));
    setActualPlayer(data.actualPlayer);
    setMyPlayer(data.myPlayer);

  }

  async function doRound(idTarget:number) {

    const res = await fetch('http://localhost:3001/api/doRound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target:idTarget }),
    });
    
    const data = await res.json();
    const updatedBoard = new Map( Object.entries(data.board).map( ([id, content]) => [Number(id), content] ) );

    setBoard(updatedBoard);
    setActualPlayer(data.actualPlayer);

    if (data.isWin) {
      finishGame;
    }

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
