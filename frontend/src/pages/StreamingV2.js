import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import init from '../adapters/Streaming/main'
import { getSocket } from "../adapters/Streaming/StreamSingleton/init_socket"
import * as peerManager from "../adapters/Streaming/StreamSingleton/init_peer.js";
import * as localStreamManager from "../adapters/Streaming/StreamSingleton/init_localstream.js";
import { remoteStreamClose } from "./../adapters/Streaming/stream.js"
//import init from "../adapters/Streaming/main.js"
//import LocalStreamVideo from "../components/StreamV2Page/localStreamVideo";

function StreamingV2() {
  const username = useSelector((state) => state.loginInfo.value);
  const [callerID, setCallerID] = useState("");
  const streamConstraints = {
    audio: false,
    video: { width: 300, height: 300 },
  }
  const localStreamVideo = useRef(); // ref => { current: null }
  const [roomId, setRoomId] = useState("")
  const socket = getSocket();

  useEffect(() => {
    //init();
  })

  async function startStreaming() {
    //init();
    try {
      let localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
      localStreamVideo.current.srcObject = localStream;
      console.log("Local stream rendered!")

      peerManager.addStreamAll(localStream)

      localStreamManager.setLocalStream(localStream)
      //init();
    }
    catch (err) {
      console.log("Local stream cannot be rendered: ", err)
    }
  }
  function stopStreaming() {
    //init();
    if (localStreamManager.getLocalStream() != null && localStreamManager.getLocalStream() != undefined) {
      peerManager.removeStreamAll(localStreamManager.getLocalStream(), (peerId) => {
        socket.emit("stream-disconnected", {
          peerId: peerId
        })
      })

      localStreamManager.setLocalStream(null)
      localStreamVideo.current.srcObject = null
      //init();
    }
  }
  function leaveRoom() {
    //init();
    //todo
    console.log("Disconnect")
    //HOST DISCONNECTS THE STREAMING
    socket.emit("leave-room")

    // TODO: What should it be when out room?
    // Delete all stream.
    peerManager.deletePeerAll(remoteStreamClose)

    // Set local stream to null.
    localStreamVideo.current.srcObject = null
    localStreamManager.setLocalStream(null)
    //window.location.reload();
  }

  function enterUsername() {
    //init();
    //e.preventDefault()
    console.log("Username is " + username);
    socket.emit("register-username", username)
    //init();
  }

  function joinRoom() {
    //init();
    //e.preventDefault();
    console.log("Room enter?");
    //console.log("Join room: ", RoomId)
    socket.emit("join-room", roomId)
    //init();
    //init();
    //init();
    //navigate('/joinroom/'.concat(RoomId));
  }

  return (
    <>
      <h1>Create a username</h1>
      <br></br>
      <input type="text" value={username} placeholder="Enter username"></input>
      <button id="enter-username" onClick={(e) => enterUsername(e)}>Enter username</button>
      <h1>Join a room</h1>
      <input type="text" onChange={(e) => setRoomId(e.target.value)} placeholder="Enter room id"></input>
      <br></br>
      <button id="join-room" onClick={(e) => joinRoom(e)}>Join room</button>
      <h1>Streaming</h1>

      <video ref={localStreamVideo} autoPlay playsInline></video> <br></br>
      {/* <LocalStreamVideo ref={localStreamVideo}></LocalStreamVideo> */}
      <button id="start-streaming" onClick={(e) => startStreaming(e)}>Start streaming</button>
      <button id="stop-streaming" onClick={(e) => stopStreaming(e)}>Stop streaming</button>
      <button id="leave-room" onClick={(e) => leaveRoom(e)}>Leave room</button>
      <div id="remote-video-container">
        <br></br>
        {/* <video id="remote-stream"></video> */}
      </div>
    </>
  )
}

export default StreamingV2;