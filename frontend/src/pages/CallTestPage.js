import { useEffect, useRef } from 'react'
//import { sendOffer, setConnectionHandler, testCallServer } from "../adapters/Streaming/connection";
//import { setStreamHandler, getStream } from "../adapters/Streaming/streamRender";
import { createHost, createClient, disconnect } from "../adapters/Streaming/stream.js";
//import io from 'socket.io-client';


function CallTestPage() {
  //const socket = io("ws://127.0.0.1:3000");
  const localVideo = useRef(); // ref => { current: null }
  const remoteVideo = useRef();

  useEffect(() => {
    //setConnectionHandler(pc, socket)
    //setStreamHandler(pc, remoteVideo)
    /**
     * Test connection to server
     */
    //testCallServer(socket)
  }, []);

  async function startHosting() {
    console.log("Create Host")
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.current.srcObject = stream
    await createHost(stream, () => {
      localVideo.current.srcObject = null
    })
  }
  async function clientEnter() {
    console.log("Create Client")
    await createClient((stream) => {
      remoteVideo.current.srcObject = stream;
    })
  }

  async function leaveRoom() {
    console.log("Disconnect")
    localVideo.current.srcObject = null
    remoteVideo.current.srcObject = null
    await disconnect()
  }
  return (
    <div>
      <video ref={localVideo} autoPlay playsInline></video> <br></br>
      <video ref={remoteVideo} autoPlay playsInline></video>
      <button onClick={(e) => startHosting(e)}>Host a room</button>
      <button onClick={(e) => clientEnter(e)}>Client</button>
      <button onClick={(e) => leaveRoom(e)}>Leave room</button>
    </div >
  )
}

export default CallTestPage;