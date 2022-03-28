const connectButton = document.getElementById("connect");
const startButton = document.getElementById("start");
const messageButton = document.getElementById("message");

const socket = io("ws://127.0.0.1:3000");

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");

connectButton.onclick = connect;

let pc = null;

async function init() {
    pc = new RTCPeerConnection()

    pc.onicecandidate = e => {
        console.log("Ice candidate")
        socket.emit("icecandidate", e.candidate)
    }
    
    pc.ontrack = e => {
        remoteVideo.srcObject = e.streams[0];
        console.log("Receive track");
    };

    socket.on("r_offer", async (r_offer) => {
        await pc.setRemoteDescription(r_offer)
        const answer = await pc.createAnswer()
        socket.emit("answer", answer)
        await pc.setLocalDescription(answer)
        console.log("Receive offer and send answer")
    });
    
    socket.on("r_answer", async (r_answer) => {
        await pc.setRemoteDescription(r_answer);
        console.log("Receive answer")
    });

    socket.on("r_icecandidate", async (candidate) => {
        await pc.addIceCandidate(candidate);
    });
}

async function connect() {
    await init()
    // Stream
    const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
    localVideo.srcObject = stream;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    console.log("Stream started")

    const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    });
    socket.emit("offer", offer)
    await pc.setLocalDescription(offer);
}

async function call() {
    console.log("Send socket message");
    socket.emit("client", "Hello from client");
    socket.on("server", (message) => {
        console.log(`Message received: ${message}`);
    })
}
