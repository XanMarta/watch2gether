import { getSocket } from './singleton/init_socket.js'
import * as peerManager from './singleton/init_peer.js'
import { getLocalStream } from './singleton/init_localstream.js';
import { 
    renderRemoteStream, 
    removeRemoteStream
} from './render/mainStream.js' 
import { addJoinNotification } from './render/chat.js'
import { setHost, isHost, isRemoteHost } from './singleton/ownership.js';
import { renderOwnerView } from './render/perspective.js'
import { isMemberExist, removeRoomMember } from './render/member.js';
import { getPeerConfig } from './config/peer.config.js';

var listener = {} 

export function init_listener_peer() {
    const socket = getSocket();

    socket.on("peer-init", data => {
        console.log('** got peer-init')
        console.log(data)

        console.log(`Init a peer connection to ${data.peerId}`)
        let peer = new SimplePeer({
            initiator: data.initiator, 
            stream: getLocalStream(),
            trickle: false,
            reconnectTimer: 3000,
            iceTransportPolicy: 'relay',
            config: getPeerConfig()
        })
        let remotePeerId = data.peerId;

        const signalListener = data => {
            console.log('** got signal')
            if (data.peerId == remotePeerId) {
                peer.signal(data.signal)
            }

            if (data.stream) 
            {
                console.log("** Got stream inside signal")
                console.log(data.stream)
            }
        }
        listener[remotePeerId] = signalListener

        socket.on("signal", signalListener)

        socket.on("leave-room-notify", async (data) => {
            console.log("** got leave-room-notify")
            console.log(`User ${data.username} has left the room.`)

            if (isMemberExist(data.peerId)) {
                addJoinNotification(data.username, 'leave')
                removeRoomMember(data.peerId)
            }
    
            socket.off('signal', listener[data.peerId])
            delete listener[data.peerId]
            peerManager.deletePeer(data.peerId)

            console.log("Erase peer ID: ", data.peerId)

            removeRemoteStream(data.peerId)

            let condition = isRemoteHost(data.peerId)
            // Người rời phòng là host .

            setHost(data.roomOwnerId)

            condition = condition && isHost()
            // Người hiện tại trở thành host mới.
            if (condition) {
                await renderOwnerView()
            }
        })

        socket.on("user-disconnected", message => {
            socket.off('signal', listener[message.socketid])
            delete listener[message.socketid]

            removeRoomMember(message.socketid)
            peerManager.deletePeer(message.socketid)
            console.log("Erase peer ID: ", message.socketid)
        })

        peer.on("signal", data => {
            console.log("** PEER - got 'signal'")
            socket.emit('signal', {
                signal: data,
                peerId: remotePeerId
            })
        })

        peer.on("stream", (stream) => {
            console.log("** PEER - got 'stream'")
            console.log("Get stream: ", stream)
            renderRemoteStream(remotePeerId, stream)
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

            removeRoomMember(remotePeerId)
            removeRemoteStream(remotePeerId)
        })

        peer.on("error", (err) => {
            console.log("** PEER - got 'error'")
            
            socket.off('signal', listener[remotePeerId])
            delete listener[remotePeerId]
            peerManager.deletePeer(remotePeerId)

            console.log("Erase peer ID: ", remotePeerId)
            
            console.log("Get error: ", err)
            
            removeRoomMember(remotePeerId)
            removeRemoteStream(remotePeerId)
            
            if (isHost()) {
                // current is host, so remote is guest.
                socket.emit("peer-error", {
                    socketid: remotePeerId
                })
            }
        })

        // TODO: peer disconnect
        // If remove by server user-disconnected event work, then this can be ignored.
        
        console.log("Thêm vào peerManager với id là: ", remotePeerId)
        peerManager.setPeer(remotePeerId, peer)
    })
}