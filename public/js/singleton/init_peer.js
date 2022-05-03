// --- Singleton for peers management
import * as Ownership from "./ownership.js"

var peers = {}
console.log("Create a peers object.")

export function setPeer(peerId, peer) {
    console.log(`Set peer with key ${peerId}`)
    peers[peerId] = peer

    console.log("Number of peers after set new peer: ", Object.keys(peers).length)
}

export function getPeer(peerId) { 
    return peers[peerId]
}

export function deletePeer(peerId) {
    if (peers[peerId] == undefined && peers[peerId] == null) 
        return
    peers[peerId].destroy()
    delete peers[peerId]

    console.log(`Delete peer with id ${peerId}`)
    
    console.log("Number of peers after delete peer: ", Object.keys(peers).length)
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
    if (!Ownership.isHost()) {
        alert("Người dùng không phải chủ phòng. Không thể gửi stream.")
        return;
    }
    if (Object.keys(peers).length == 0) 
    {
        console.log("Không có người dùng trên stream.")
        return;
    }

    Object.entries(peers).forEach(([peerId, _]) => {
        peers[peerId].addStream(stream)
        console.log("Thêm stream vào peer: ", peerId)
        callback(peerId)
    })
    
    console.log(stream)

    console.log("Gửi stream đến toàn bộ người dùng.")
}

export function removeStreamAll(stream, callback = (peerId) => {}) {
    if (Object.keys(peers).length == 0) return;

    Object.entries(peers).forEach(([peerId, peer]) => {
        peers[peerId].removeStream(stream)
        callback(peerId)
    })
}