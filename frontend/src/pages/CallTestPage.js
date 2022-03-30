import io from 'socket.io-client';
import { useEffect, useRef, useState, Fragment } from 'react'


function CallTestPage() {
  const socket = io("ws://127.0.0.1:3000");
  let pc = null;
  //const localVideo = document.getElementById("localVideo");
  //const remoteVideo = document.getElementById("remoteVideo");
  const localVideo = useRef(); // ref => { current: null }
  const remoteVideo = useRef();
  //const [stream, setStream] = useState();

  pc = new RTCPeerConnection();

  function setConnectionHandler(pc, socket) {
    /**
     * When get an ice candidate from server, emit it own ice cancdidate
     */
    pc.onicecandidate = e => {
      console.log("Ice candidate requested")
      socket.emit("icecandidate", e.candidate)
    }

    /**
     * Get offer from other peer. Set to it remote description
     * Send it answer.
     * Like establish handshake connection
     */
    socket.on("r_offer", async (r_offer) => {
      await pc.setRemoteDescription(r_offer)
      const answer = await pc.createAnswer()
      socket.emit("answer", answer)
      await pc.setLocalDescription(answer)
      console.log("Receive offer and send answer")
    });

    /**
     * Get answer from other peer.
     * Set to it remote description.
     */
    socket.on("r_answer", async (r_answer) => {
      await pc.setRemoteDescription(r_answer);
      console.log("Receive answer")
    });

    /**
     * Get ice candidate from other peer
     * Set to it ice candidate
     */
    socket.on("r_icecandidate", async (candidate) => {
      await pc.addIceCandidate(candidate);
      console.log("Ice candidate acquired")
    });
  }

  //from remote caller
  function setStreamHandler(pc, remoteVideo) {
    /**
     * Get a track object from server. Set remoteVideo to render stream. 
     */
    pc.ontrack = e => {
      remoteVideo.current.srcObject = e.streams[0];
      console.log("Receive track");
    };
  }

  //from local caller
  async function getStream(pc, localVideo) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.current.srcObject = stream;
      //setStream(stream);

      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      console.log("Stream started")
    } catch (err) {
      console.log("Cannot get stream: ", err)
    }
  }

  useEffect(() => {
    setConnectionHandler(pc, socket)
    setStreamHandler(pc, remoteVideo)
    /**
     * Test connection to server
     */
    testCallServer(socket)
  }, []);

  function testCallServer(socket) {
    console.log("Send socket message");
    socket.emit("client", "Hello from client");
    socket.on("server", (message) => {
      console.log(`Message received: ${message}`);
    })
  }

  async function sendOffer(pc, socket) {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    socket.emit("offer", offer)
    await pc.setLocalDescription(offer);
  }

  async function startCall() {
    //e.preventDefault();
    console.log("Connect");
    //localVideo.current.focus();
    await getStream(pc, localVideo)
    await sendOffer(pc, socket)
  }
  return (
    <div>
      <video ref={localVideo} autoPlay playsInline></video> <br></br>
      <video ref={remoteVideo} autoPlay playsInline></video>
      <button id="connect" onClick={(e) => startCall(e)}>Connect</button>
      <button id="start">Start</button>
      <button id="message">Message</button>
    </div >
  )
}

export default CallTestPage;