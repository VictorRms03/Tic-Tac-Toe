const socket = new WebSocket("ws://localhost:3001");

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

    socket.send( JSON.stringify( {
        type:"joinGame",
        gameId:gameId
    }));

}

export function doRound(idTarget:number, gameId:string) {
    socket.send( JSON.stringify( {
        type:"doRound",
        target:idTarget,
        gameId:gameId
    }));
}