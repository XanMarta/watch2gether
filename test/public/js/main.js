const connectButton = document.getElementById("connect");
const startButton = document.getElementById("start");
const messageButton = document.getElementById("message");

const socket = io("ws://127.0.0.1:3000");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

connectButton.onclick = connect;

import {setConnectionHandler, testCallServer} from "./connection.js";
import {setStreamHandler, getStream} from "./streamRender.js";

let pc = null;

pc = new RTCPeerConnection();

setConnectionHandler(pc, socket)
setStreamHandler(pc, remoteVideo)

getStream(pc, socket, localVideo)
testCallServer(socket)