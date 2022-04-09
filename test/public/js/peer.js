import { getSocket } from './singleton/init_socket.js'
import * as peerManager from './singleton/init_peer.js'
import { getLocalStream } from './singleton/init_localstream.js';
import { remoteStreamRender, remoteStreamClose } from './stream.js'

var listener = {}

export function init_listener_peer() {
    const socket = getSocket();

    socket.on("peer-init", data => {
        console.log(`Init a peer connection to ${data.peerId}`)
        let peer = new SimplePeer({initiator: data.initiator, stream: getLocalStream()})
        let remotePeerId = data.peerId;

        const signalListener = data => {
            if (data.peerId == remotePeerId) {
                peer.signal(data.signal)
            }
        }
        listener[remotePeerId] = signalListener

        socket.on("signal", signalListener)

        peer.on("signal", data => {
            socket.emit('signal', {
                signal: data,
                peerId: remotePeerId
            })
        })

        peer.on("stream", data => {
            console.log("Get stream: ", data)
            remoteStreamRender(remotePeerId, data)
        })

        peer.on("connect", () => {
            peer.send("Hey Peer")
        })

        peer.on("data", (data) => {
            console.log("Peer get data: " + data)
        })

        peer.on("close", () => {
            socket.off('signal', listener[remotePeerId])
            delete listener[remotePeerId]

            remoteStreamClose(remotePeerId)
        })

        peer.on("error", (err) => {
            socket.off('signal', listener[remotePeerId])
            delete listener[remotePeerId]
            
            console.log("Get error: ", err)
            remoteStreamClose(remotePeerId)
        })

        // TODO: peer disconnect
        // If remove by server user-disconnected event work, then this can be ignored.

        peerManager.setPeer(remotePeerId, peer)
    })
}