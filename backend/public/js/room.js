import { remoteStreamClose } from './stream.js'
import { getSocket } from './singleton/init_socket.js'
import * as peerManager from './singleton/init_peer.js' 


export function init_listener_room() {
    const socket = getSocket()

    socket.on("join-room", (socketId) => {
        console.log("** got join-room")
        console.log(`Socket ${socketId} join room!`)
    })

    socket.on("room-joined", (roomId) => {
        console.log("** got room-joined")
        console.log(`Room ${roomId} Joined!`)
    }) 

    socket.on("room-message", (message) => {
        console.log("** got room-message")
        console.log(`Get broadcast message: ${message}`)
    })

    socket.on("user-disconnected", peerId => {
        console.log("** got user-disconnected")
        console.log(`User ${peerId} disconnected`)
        // TODO: check if this change make app run unexpectedly.

        //delete peers[peerId]
        peerManager.deletePeer(peerId)
        remoteStreamClose(peerId)
    })

    socket.on("stream-disconnected", (data) => {
        console.log("** get stream-disconnected")
        console.log(`User ${data.peerId} stream disconnected`)
        remoteStreamClose(data.peerId)
    })
    
    socket.on("leave-room-reject", message => {
        console.log("** get leave-room-reject")
        console.log(message)
    })
    
    socket.on("leave-room", message => {
        console.log("** got leave-room")
        console.log(message)
    })

    socket.on("room-info", (room) => {
        console.log("** got room-info")
        console.log('All client id from same room: ')
        console.log(typeof(room))
        console.log(room)
    })
    
    socket.on("not-in-room", () => {
        console.log("** got not-in-room")
        console.log("Client havent joined a room yet.")
    })
    
    socket.on("already-in-room", () => {
        console.log("** got already-in-room")
        console.log("Client already in a room.")
    })
}
