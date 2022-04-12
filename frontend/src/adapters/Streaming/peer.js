import { getSocket } from './StreamSingleton/init_socket.js'
import * as peerManager from './StreamSingleton/init_peer.js'
import { getLocalStream } from './StreamSingleton/init_localstream.js';
import { remoteStreamRender, remoteStreamClose } from './stream.js';
import SimplePeer from 'simple-peer';

var listener = {}

export function init_listener_peer() {
    const socket = getSocket();

    socket.on("peer-init", data => {
        console.log(`Init a peer connection to ${data.peerId}`)
        let peer = new SimplePeer({ initiator: data.initiator, stream: getLocalStream() })
        let remotePeerId = data.peerId;

        const signalListener = data => {
            if (data.peerId == remotePeerId) {
                peer.signal(data.signal)
            }
        }
        listener[remotePeerId] = signalListener

        socket.on("signal", signalListener)
        console.log(`peer is getting signal`)
        peer.on("signal", data => {
            socket.emit('signal', {
                signal: data,
                peerId: remotePeerId
            })
        })
        //console.log(`peer is getting stream data`)
        peer.on("stream", data => {
            console.log("Get stream: ", data)
            remoteStreamRender(remotePeerId, data)
        })
        console.log(`peer is getting connection when joining a room`)
        peer.on("connect", () => {
            console.log("I've got the data");
            peer.send("Hey Peer")
        })
        console.log(`peer is getting data when first joining the room`)
        peer.on("data", (data) => {
            console.log("Can you get the data?");
            console.log("Peer get data: " + data)
        })
        console.log(`Peer leaves?`);
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