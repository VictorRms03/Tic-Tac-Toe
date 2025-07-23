const socket = new WebSocket("wss://tic-tac-toe-backend-ikzb.onrender.com");
//const socket = new WebSocket("ws://localhost:3001");

export function getWebSocket() {
    return socket;
}

export function createGame() {
    socket.send( JSON.stringify( {
        type:"createGame",
    }));
}

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

export function doRound(idTarget:number, gameId:string) {
    socket.send( JSON.stringify( {
        type:"doRound",
        target:idTarget,
        gameId:gameId
    }));
}