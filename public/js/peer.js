import { getSocket } from './singleton/init_socket.js'
import * as peerManager from './singleton/init_peer.js'
import { getLocalStream } from './singleton/init_localstream.js';
import { 
    setRemoteStream, 
    removeRemoteStream
} from './render/mainStream.js' 
import { addJoinNotification } from './render/chat.js'
import { setHost } from './singleton/ownership.js';

var listener = {} 

export function init_listener_peer() {
    const socket = getSocket();

    socket.on("peer-init", data => {
        console.log('** got peer-init')

        console.log(`Init a peer connection to ${data.peerId}`)
        let peer = new SimplePeer({initiator: data.initiator, stream: getLocalStream()})
        let remotePeerId = data.peerId;

        const signalListener = data => {
            console.log('** got signal')
            if (data.peerId == remotePeerId) {
                peer.signal(data.signal)
            }
        }
        listener[remotePeerId] = signalListener

        socket.on("signal", signalListener)

        socket.on("leave-room-notify", (data) => {
            console.log("** got leave-room-notify")
            console.log(`User ${data.username} has left the room.`)

            addJoinNotification(data.username, 'leave')
    
            socket.off('signal', listener[data.peerId])
            delete listener[data.peerId]
            peerManager.deletePeer(data.peerId)

            console.log("Erase peer ID: ", data.peerId)

            removeRemoteStream(data.peerId)
            setHost(data.roomOwnerId)
        })

        socket.on("user-disconnected", message => {
            socket.off('signal', listener[message.peerId])
            delete listener[message.peerId]
    
            peerManager.deletePeer(message.peerId)
            console.log("Erase peer ID: ", message.peerId)
        })

        peer.on("signal", data => {
            console.log("** PEER - got 'signal'")
            socket.emit('signal', {
                signal: data,
                peerId: remotePeerId
            })
        })

        peer.on("stream", stream => {
            console.log("** PEER - got 'stream'")
            console.log("Get stream: ", stream)
            setRemoteStream(remotePeerId, stream)
        })

        peer.on("connect", () => {
            console.log("** PEER - got 'connect'")
            peer.send("Hey Peer")
        })

        peer.on("data", (data) => {
            console.log("** PEER - got 'data'")
            console.log("Peer get data: " + data)
        })

        peer.on("close", () => {
            console.log("** PEER - got 'close'")

            socket.off('signal', listener[remotePeerId])
            delete listener[remotePeerId]
            peerManager.deletePeer(remotePeerId)
            
            console.log("Erase peer ID: ", remotePeerId)

            removeRemoteStream(remotePeerId)
        })

        peer.on("error", (err) => {
            console.log("** PEER - got 'error'")
            
            socket.off('signal', listener[remotePeerId])
            delete listener[remotePeerId]
            peerManager.deletePeer(remotePeerId)

            console.log("Erase peer ID: ", remotePeerId)
            
            console.log("Get error: ", err)
            
            removeRemoteStream(remotePeerId)
        })

        // TODO: peer disconnect
        // If remove by server user-disconnected event work, then this can be ignored.

        peerManager.setPeer(remotePeerId, peer)
    })
}