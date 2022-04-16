import { getSocket } from './StreamSingleton/init_socket.js'
import * as peerManager from './StreamSingleton/init_peer.js'
import { getLocalStream } from './StreamSingleton/init_localstream.js';
import { remoteStreamRender, remoteStreamClose } from './stream.js';
//import SimplePeer from 'simple-peer';

var listener = {}

var SimplePeer = require('simple-peer')

export function init_listener_peer() {
    const socket = getSocket();
    if (SimplePeer.WEBRTC_SUPPORT) {
        // webrtc support!
        console.log("WEB RTC SUPPORTED");
    } else {
        // fallback
        console.log("NO :(((((");
    }
    socket.on("peer-init", data => {
        console.log('** got peer-init')

        console.log(`Init a peer connection to ${data.peerId}`)
        let peer = new SimplePeer({ initiator: data.initiator, stream: getLocalStream(), trickle: false })
        let remotePeerId = data.peerId;

        const signalListener = data => {
            console.log('** got signal')
            console.log("Data signal: " + data.signal)
            try {
                if (data.peerId == remotePeerId) {
                    peer.signal(data.signal)
                }
            } catch (err) {
                console.log(err.message);
            }
        }
        listener[remotePeerId] = signalListener

        socket.on("signal", signalListener)
        socket.on("leave-room-notify", (data) => {
            console.log("** got leave-room-notify")
            console.log(`User ${data.username} has left the room.`)

            socket.off('signal', listener[data.peerId])
            delete listener[data.peerId]
            peerManager.deletePeer(data.peerId)

            console.log("Erase peer ID: ", data.peerId)
            remoteStreamClose(data.peerId)
        })

        peer.on("signal", data => {
            console.log("** PEER - got 'signal'")
            socket.emit('signal', {
                signal: data,
                peerId: remotePeerId
            })
        })

        peer.on("stream", data => {
            console.log("** PEER - got 'stream'")
            console.log("Get stream: ", data)
            remoteStreamRender(remotePeerId, data)

        })

        peer.on("connect", () => {
            console.log("** PEER - got 'connect'")
            //peer.send("Hey Peer");
        })

        // peer.on("data", (data) => {
        //     console.log("** PEER - got 'data'")
        //     console.log("Peer get data: " + data)
        // })

        peer.on("close", () => {
            console.log("** PEER - got 'close'")

            socket.off('signal', listener[remotePeerId])
            delete listener[remotePeerId]
            peerManager.deletePeer(remotePeerId)

            console.log("Erase peer ID: ", remotePeerId)

            remoteStreamClose(remotePeerId)
        })

        peer.on("error", (err) => {
            console.log("** PEER - got 'error'")

            socket.off('signal', listener[remotePeerId])
            delete listener[remotePeerId]
            peerManager.deletePeer(remotePeerId)

            console.log("Erase peer ID: ", remotePeerId)

            console.log("Get error: ", err)
            remoteStreamClose(remotePeerId)
        })

        // TODO: peer disconnect
        // If remove by server user-disconnected event work, then this can be ignored.

        peerManager.setPeer(remotePeerId, peer)
    })
}