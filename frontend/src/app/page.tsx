'use client';

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Game from "@/components/Game";
import Footer from "@/components/Footer";

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
      <button 
        id={id.toString()} 
        onClick={() => doRound(id)} 
        disabled={ ( board.get(id)?.content || currentPlayer !== myPlayerSymbol ) }
        className="w-34 h-34 xl:w-44 xl:h-44 bg-white rounded shadow border-3 border-black group"
        >
        {board.get(id)?.content || ' '}
      </button>
    );

  }

  function finishGame() {
    window.alert( "Parabêns, " + currentPlayer + " Ganhou!");
  }

  return (
    
    <>

      <Navbar />
      <Game />
      <Footer />

    </>

  );
}
