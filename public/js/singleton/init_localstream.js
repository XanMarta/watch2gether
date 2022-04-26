// --- LocalStream
var localStream = null
console.log("Create new localStream Instance")

export function getLocalStream() {
    return localStream 
}

export function setLocalStream(newLocalStream) {
    localStream = newLocalStream
}