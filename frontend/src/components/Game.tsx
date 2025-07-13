import { useState } from 'react';
import { getWebSocket, createGame, joinGame, doRound } from "@/utils/gameLogic";

export default function Game() {

    const [board, setBoard] = useState<any>(new Map());
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [myPlayerSymbol, setMyPlayerSymbol] = useState(null);
    const [gameId, setGameId] = useState<string>('');

    const socket = getWebSocket();

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

    function renderBoard() {

        return (

            <div>
                <div className='flex'>{ renderButton(0) }{ renderButton(1) }{ renderButton(2) }</div>
                <div className='flex'>{ renderButton(3) }{ renderButton(4) }{ renderButton(5) }</div>
                <div className='flex'>{ renderButton(6) }{ renderButton(7) }{ renderButton(8) }</div>
            </div>
        );

    }

    function renderButton(id: number) {

        return (
            <button id={id.toString()} 
                onClick={() => doRound(id, gameId)} 
                disabled={ ( board.get(id)?.content || currentPlayer !== myPlayerSymbol ) }
                className="w-34 h-34 xl:w-44 xl:h-44 bg-white shadow border-3 border-black group">

                <span className='text-9xl'> { board.get(id)?.content || ' ' } </span>
                
            </button>
        );

    }

    function finishGame() {
        window.alert( "Parabêns, " + currentPlayer + " Ganhou!");
    }

    return(

        <main className='flex flex-col items-center gap-8 my-8'>

            <div className='flex flex-col items-center gap-3'>

                <div className='flex flex-row gap-20'>

                    <div className="bg-white border border-black border-3 py-2 rounded flex justify-center items-center gap-2 w-40 h-13">
                        <span className="font-bold text-xl"> Você: {myPlayerSymbol} </span>
                    </div>

                    <div className="bg-white border border-black border-3 py-2 rounded flex justify-center items-center gap-2 w-40 h-13">
                        <span className="font-bold text-xl"> Oponente: {myPlayerSymbol && (myPlayerSymbol === 'X' ? 'O' : 'X')} </span>
                    </div>

                </div>

                <div className="bg-black py-2 rounded flex justify-center items-center gap-2 w-40 h-13">
                    <h2 className='font-bold text-white text-xl'>Vez de: {currentPlayer}</h2>
                </div>

            </div>

            { renderBoard() }

            <h2 className='text-xl'> ID do jogo: {gameId} </h2>
        
        </main>
    );
}