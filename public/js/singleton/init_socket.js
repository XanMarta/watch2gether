// --- Socket

var currentSocket = null;
console.log("Create new socket instance") 

export function getSocket() {
    return currentSocket;
}

export function setSocket(newSocket) {
    currentSocket = newSocket
}