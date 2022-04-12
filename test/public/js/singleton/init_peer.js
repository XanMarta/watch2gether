// --- Singleton for peers management
var peers = {}
console.log("Create a peers object.")

export function setPeer(peerId, peer) {
    console.log(`Set peer with key ${peerId}`)
    peers[peerId] = peer 
}

export function getPeer(peerId) { 
    return peers[peerId]
}

export function deletePeer(peerId) {
    if (peers[peerId] == undefined && peers[peerId] == null) 
        return
    peers[peerId].destroy()
    delete peers[peerId]
}

export function deletePeerAll(callback = (peerId) => {}) {
    if (Object.keys(peers).length == 0) return;

    Object.entries(peers).forEach(([peerId, peer]) => {

        peers[peerId].destroy()
        delete peers[peerId]
        callback(peerId)
    })

    console.log("Number of peers after delete all peer: ", Object.keys(peers).length)
}

export function addStreamAll(stream, callback = (peerId) => {}) {
    if (Object.keys(peers).length == 0) return;

    Object.entries(peers).forEach(([peerId, peer]) => {

        peers[peerId].addStream(stream)
        callback(peerId)
    })
}

export function removeStreamAll(stream, callback = (peerId) => {}) {
    if (Object.keys(peers).length == 0) return;

    Object.entries(peers).forEach(([peerId, peer]) => {

        peer.removeStream(stream)
        callback(peerId)
    })
}