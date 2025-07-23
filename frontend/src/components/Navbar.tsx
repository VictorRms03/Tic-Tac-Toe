import { createGame, joinGame } from "@/utils/gameLogic";
import { useState } from 'react';

export default function Navbar() {
    
    const [gameId, setGameId] = useState<string>('');

    return (

        <header className="w-full px-2 sm:px-6 py-4 shadow-lg top-0 z-50">
            <div className="sm:max-w-11/12 xl:max-w-9/12 mx-auto flex items-center justify-between">

                <h1 className='hidden sm:inline text-xl sm:text-2xl lg:text-4xl'>Tic-Tac-Toe: Online</h1>
        
                <div className='flex space-x-2 sm:space-x-6 lg:space-x-10'>

                    <button onClick={createGame} className="group bg-black px-4 py-2 rounded hover:bg-white border-2 border-black hover:border-black transition flex items-center">

                        <span className="text-white group-hover:text-black">Criar Jogo</span>

                    </button>

                    <form onSubmit={(e) => joinGame(e, gameId)} className="flex gap-2">

                        
                        <button type="submit" 
                            className="group bg-black px-4 py-2 rounded hover:bg-white border-2 border-black hover:border-black transition flex items-center">
                            
                            <span className="text-white group-hover:text-black">Entrar Partida</span>
                            
                        </button>

                        <input
                            type="text"
                            name="gameId"
                            id="gameId"
                            onChange={(e) => setGameId(e.target.value)}
                            placeholder="Insira o ID da Partida"
                            className='bg-white border-2 rounded border-black px-2 md:px-4 w-35 lg:w-50'
                        />
                        
                    </form>

                    
                    
                </div>

            </div>

        </header>
    )
}