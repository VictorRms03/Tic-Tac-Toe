const socket = new WebSocket("wss://tic-tac-toe-backend-ikzb.onrender.com");
//const socket = new WebSocket("ws://localhost:3001");

/**
 * @returns SOCKET para comunicação com o backend
 */
export function getWebSocket() {
    return socket;
}

/**
 * Envia requisição para criação de game para o backend
 */
export function createGame() {
    socket.send( JSON.stringify( {
        type:"createGame",
    }));
}

/**
 * Envia requisição para entrar em um jogo para o backend 
 * @param e Evento do formulário
 * @param gameId ID do jogo a ser entrado
 */
export function joinGame( e:React.FormEvent<HTMLFormElement>, gameId:string ) {

    e.preventDefault();

    if (gameId) {

        console.log("Fez a requisição");

        socket.send( JSON.stringify( {
            type:"joinGame",
            gameId:gameId
        }));

    } else {
        console.log("Não fez a requisição");
    }

}

/**
 * Envia a requisição para o backend com a jogada do usuário
 * @param idTarget ID da posição a ser preenchida pelo usuário
 * @param gameId ID do jogo atual
 */
export function doRound(idTarget:number, gameId:string) {
    socket.send( JSON.stringify( {
        type:"doRound",
        target:idTarget,
        gameId:gameId
    }));
}