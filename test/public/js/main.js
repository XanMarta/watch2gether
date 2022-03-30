const connectButton = document.getElementById("connect");
const startButton = document.getElementById("start");
const messageButton = document.getElementById("message");

const socket = io("ws://127.0.0.1:3000");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

import {sendOffer, setConnectionHandler, testCallServer} from "./connection.js";
import {setStreamHandler, getStream} from "./streamRender.js";

let pc = null;

pc = new RTCPeerConnection();

connectButton.onclick = async () => {
    await getStream(pc, localVideo)
    await sendOffer(pc, socket)
};

setConnectionHandler(pc, socket)
setStreamHandler(pc, remoteVideo)

/**
 * Test connection to server
 */
testCallServer(socket)