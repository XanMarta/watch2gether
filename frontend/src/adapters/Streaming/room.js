import { remoteStreamClose } from './stream.js'
import { getSocket } from './StreamSingleton/init_socket.js'
import * as peerManager from './StreamSingleton/init_peer.js'

//other people join a room
export function init_listener_room() {
    const socket = getSocket()

    socket.on("join-room", (socketId) => {
        console.log(`Socket ${socketId} join room!`)
    })

    socket.on("room-joined", (roomId) => {
        console.log(`Room ${roomId} Joined!`)
    })

    socket.on("room-message", (message) => {
        console.log(`Get broadcast message: ${message}`)
    })

    socket.on("user-disconnected", peerId => {
        console.log(`User ${peerId} disconnected`)
        // TODO: check if this change make app run unexpectedly.

        //delete peers[peerId]
        peerManager.deletePeer(peerId)
        remoteStreamClose(peerId)
    })

    socket.on("stream-disconnected", (data) => {
        console.log(`User ${data.peerId} stream disconnected`)
        remoteStreamClose(data.peerId)
    })

    socket.on("leave-room-notify", (data) => {
        console.log(`User ${data.username} has left the room.`)

        peerManager.deletePeer(data.peerId)
        remoteStreamClose(data.peerId)
    })

    socket.on("leave-room-reject", message => {
        console.log(message)
    })

    socket.on("leave-room", message => {
        console.log(message)
    })

    socket.on("room-info", (room) => {
        console.log('All client id from same room: ')
        console.log(typeof (room))
        console.log(room)
    })

    socket.on("not-in-room", () => {
        console.log("Client havent joined a room yet.")
    })

    socket.on("already-in-room", () => {
        console.log("Client already in a room.")
    })
}
