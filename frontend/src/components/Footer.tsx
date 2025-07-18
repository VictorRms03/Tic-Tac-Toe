import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="w-full px-6 py-4 shadow-lg sticky top-0 z-50">
            <div className="max-w-11/12 xl:max-w-7/12 mx-auto flex items-center justify-center lg:justify-between">

                <Link href="https://victor-ramos.vercel.app/" target="_blank" className="group bg-black border-2 border-white px-4 py-2 rounded
                    transition flex items-center gap-2 hover:bg-white hover:border-black ">
                    <span className="font-bold text-white group-hover:text-black"> Criado por Victor Ramos </span>
                </Link>
                
                <Link href="https://github.com/VictorRms03/Tic-Tac-Toe" target="_blank" className="group bg-black border-2 border-white px-4 py-2 rounded
                    transition flex items-center gap-2 hover:bg-white hover:border-black ">
                    <span className="font-bold text-white group-hover:text-black"> Acessar Projeto </span>
                </Link>

            </div>
        </footer>
    );
}