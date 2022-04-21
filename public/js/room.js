import { getSocket } from './singleton/init_socket.js'
import * as peerManager from './singleton/init_peer.js' 
import { addMessage, addJoinNotification } from './render/chat.js'
import { renderRoomMember } from './render/member.js'
import { renderOwnerView, renderClientView } from './render/perspective.js'
import { removeRemoteStream } from './render/mainStream.js'
import { setHost, isHost } from './singleton/ownership.js' 

export function init_listener_room() {
    const socket = getSocket()

    socket.on("join-room", (information) => {
        console.log("** got join-room")
        console.log(`Get join-room information ${information}`)
        addJoinNotification(information['username'], 'join')
    })

    socket.on("room-joined", (message) => {
        console.log("** got room-joined")
        console.log(`Room ${message.roomId} Joined!`)

        addJoinNotification('You have', 'join')
        
        setHost(message.roomOwnerId)

        if (isHost()) {

            renderOwnerView()
        }
        else {
            renderClientView()
        }

        renderRoomMember(message.member)
    }) 

    socket.on("room-message", (message) => {
        console.log("** got room-message")
        console.log(`Get broadcast message: ${message.content}`)

        addMessage(message)
    })

    socket.on("user-disconnected", message => {
        console.log("** got user-disconnected")
        console.log(`User ${message} disconnected`)

        addJoinNotification(message['username'], 'disconnect')

        // TODO: check if this change make app run unexpectedly.

        //delete peers[peerId]
        peerManager.deletePeer(message.socketid)
        removeRemoteStream()
    })

    socket.on("stream-disconnected", (message) => {
        console.log("** get stream-disconnected")
        console.log(`User ${message.peerId} stream disconnected`)
        removeRemoteStream()
    })
    
    socket.on("leave-room-reject", message => {
        console.log("** get leave-room-reject")
        alert(message)
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
        alert("Client havent joined a room yet.")
    })
    
    socket.on("already-in-room", () => {
        console.log("** got already-in-room")
        alert("Client already in a room.")
    })
}
