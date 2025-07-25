import Link from 'next/link';

/**
 * Gera a seção de rodapé do jogo Tic Tac Toe: Online
 * @returns Seção de Rodapé do jogo
 */
export default function Footer() {
    return (
        <footer className="w-full px-6 py-4 shadow-lg sticky top-0 z-50">
            <div className="max-11/12 sm:max-w-9/12 lg:max-w-7/12 mx-auto flex items-center justify-between">

                <Link href="https://victor-ramos.vercel.app/" target="_blank" className="group bg-black border-2 border-white px-4 py-2 rounded
                    transition flex items-center gap-2 hover:bg-white hover:border-black ">
                    <span className="font-bold text-white group-hover:text-black text-xs md:text-lg"> Criado por Victor Ramos </span>
                </Link>
                
                <Link href="https://github.com/VictorRms03/Tic-Tac-Toe" target="_blank" className="group bg-black border-2 border-white px-4 py-2 rounded
                    transition flex items-center gap-2 hover:bg-white hover:border-black ">
                    <span className="font-bold text-white group-hover:text-black text-xs md:text-lg"> Acessar Projeto </span>
                </Link>

            </div>
        </footer>
    );
}