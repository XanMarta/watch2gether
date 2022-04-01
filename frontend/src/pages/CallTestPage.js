import io from 'socket.io-client';
import { useEffect, useRef } from 'react'
import {sendOffer, setConnectionHandler, testCallServer} from "../adapters/VideoStream/connection";
import {setStreamHandler, getStream} from "../adapters/VideoStream/streamRender";


function CallTestPage() {
  const socket = io("ws://127.0.0.1:3000");
  let pc = null;
  const localVideo = useRef(); // ref => { current: null }
  const remoteVideo = useRef();

  pc = new RTCPeerConnection();

  useEffect(() => {
    setConnectionHandler(pc, socket)
    setStreamHandler(pc, remoteVideo)
    /**
     * Test connection to server
     */
    testCallServer(socket)
  }, []);

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
      <button onClick={(e) => startCall(e)}>Connect</button>
      <button>Start</button>
      <button>Message</button>
    </div >
  )
}

export default CallTestPage;