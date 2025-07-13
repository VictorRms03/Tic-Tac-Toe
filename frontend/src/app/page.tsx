'use client';

import { useState } from 'react';

export default function Home() {

  const [board, setBoard] = useState<any>(new Map());
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [myPlayerSymbol, setMyPlayerSymbol] = useState(null);
  const [gameId, setGameId] = useState<string | null>(null);

  const socket = new WebSocket("ws://localhost:3001");

  socket.onmessage = (event) => {

    const data = JSON.parse(event.data);

    if (data.type === "createGameResponse") {

      setGameId(data.gameId);
      setMyPlayerSymbol(data.myPlayerSymbol);
      setCurrentPlayer(data.currentPlayer);
      setBoard(new Map(Object.entries(data.board)));

    } else if (data.type === "joinGameResponse") {

      const updatedBoard = new Map( Object.entries(data.board).map( ([id, content]) => [Number(id), content] ) );

      setGameId(data.gameId);
      setMyPlayerSymbol(data.myPlayerSymbol);
      setCurrentPlayer(data.currentPlayer);
      setBoard(updatedBoard);
      
    } if (data.type === "doRoundResponse") {

      const updatedBoard = new Map( Object.entries(data.board).map( ([id, content]) => [Number(id), content] ) );

      setCurrentPlayer(data.currentPlayer);
      setBoard(updatedBoard);
      data.isWin && finishGame();

    }

  };

  function createGame() {
    socket.send( JSON.stringify( {
      type:"createGame",
    }));
  }

  function joinGame(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault();

    socket.send( JSON.stringify( {
      type:"joinGame",
      gameId:gameId
    }));
    
  }

  function doRound(idTarget:number) {
    socket.send( JSON.stringify( {
      type:"doRound",
      target:idTarget,
      gameId:gameId
    }));
  }

  function renderButton(id: number) {

    return (
      <button id={id.toString()} onClick={() => doRound(id)} disabled={ ( board.get(id)?.content || currentPlayer !== myPlayerSymbol ) }>
        {board.get(id)?.content || ' '}
      </button>
    );

  }

  function finishGame() {
    window.alert( "Parabêns, " + currentPlayer + " Ganhou!");
  }

  return (
    
    <>

    <h2>Jogador: {currentPlayer}</h2>

    <h2>Eu sou: {myPlayerSymbol}</h2>

    <h2>ID do jogo: {gameId}</h2>

    <button onClick={createGame}>Criar Jogo</button>

    <br />

    <form onSubmit={joinGame}>
      <input
        type="text"
        name="gameId"
        id="gameId"
        onChange={(e) => setGameId(e.target.value)}
      />
      <button type="submit">Entrar no jogo</button>
    </form>

    {/*<input type="text" name="gameId" id="gameId" /> <button onClick={joinGame}>Entrar no jogo</button>*/}

    <div>{ renderButton(0) } { renderButton(1) } { renderButton(2) }</div>
    <div>{ renderButton(3) } { renderButton(4) } { renderButton(5) }</div>
    <div>{ renderButton(6) } { renderButton(7) } { renderButton(8) }</div>
      
    </>
  );
}
