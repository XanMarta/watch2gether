import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";

//import for react useEffect
import { Card } from 'react-bootstrap'
import { getSocket } from "../adapters/Streaming/StreamSingleton/init_socket.js"
import * as localStreamManager from "../adapters/Streaming/StreamSingleton/init_localstream.js";
import * as peerManager from "../adapters/Streaming/StreamSingleton/init_peer.js";
import { remoteStreamClose } from "../adapters/Streaming/stream.js"
import init from "../adapters/Streaming/main.js"
//import io from 'socket.io-client';

function CreateRoomPage() {
  const username = useSelector((state) => state.loginInfo.value);
  const localStreamVideo = useRef(); // ref => { current: null }
  const remoteVideo = useRef();
  //const socket = getSocket();
  let { roomid } = useParams();
  const navigate = useNavigate();

  const streamConstraints = {
    audio: false,
    video: { width: 300, height: 300 },
  }

  const socket = getSocket();

  //setSocket(socket)
  useEffect(() => {
    socket.emit("register-username", username)
    socket.emit("join-room", roomid);
    init()
  }, []);

  async function startStreaming() {
    console.log("Create Streaming")
    //TO START STREAMING HERE
    try {
      let localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
      localStreamVideo.current.srcObject = localStream;
      console.log("Local stream rendered!")

      peerManager.addStreamAll(localStream)

      localStreamManager.setLocalStream(localStream)
    }
    catch (err) {
      console.log("Local stream cannot be rendered: ", err)
    }
  }

  function stopStreaming() {
    if (localStreamManager.getLocalStream() != null && localStreamManager.getLocalStream() != undefined) {
      peerManager.removeStreamAll(localStreamManager.getLocalStream(), (peerId) => {
        socket.emit("stream-disconnected", {
          peerId: peerId
        })
      })

      localStreamManager.setLocalStream(null)
      localStreamVideo.current.srcObject = null
    }
  }

  function leaveRoom() {
    console.log("Disconnect")
    //HOST DISCONNECTS THE STREAMING
    socket.emit("leave-room")

    // TODO: What should it be when out room?
    // Delete all stream.
    peerManager.deletePeerAll(remoteStreamClose)

    // Set local stream to null.
    localStreamVideo.current.srcObject = null
    localStreamManager.setLocalStream(null)
    navigate("/");
  }
  return (
    <div>
      <video ref={localStreamVideo} autoPlay playsInline></video> <br></br>
      {/* <video ref={remoteVideo} autoPlay playsInline></video> */}
      <button onClick={(e) => startStreaming(e)}>Host a room</button>
      <button onClick={(e) => stopStreaming(e)}>Stop Streaming</button>
      {/* <button onClick={(e) => clientEnter(e)}>Client</button> */}
      <button onClick={(e) => leaveRoom(e)}>Leave room</button>
      <Card border="primary" style={{ 'width': '50rem', 'height': '700px', overflow: 'auto', float: 'right' }}>
        <Card.Header>Chat Form</Card.Header>
        <Card.Body>
          <Card.Title>Welcome to room ....</Card.Title>
          <div className="border" style={{ 'width': '450px', 'background-color': 'white', float: 'left' }}>
            <Card.Title style={{ 'font-size': "20" }}>Other User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'purple', float: 'right' }}>
            <Card.Title style={{ 'font-size': "20" }}>The User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'white', float: 'left' }}>
            <Card.Title style={{ 'font-size': "20" }}>Other User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'white', float: 'left' }}>
            <Card.Title style={{ 'font-size': "20" }}>Other User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
          <div className="border" style={{ 'width': '450px', 'background-color': 'white', float: 'left' }}>
            <Card.Title style={{ 'font-size': "20" }}>Other User - current time</Card.Title>
            <Card.Text>
              Some quick example text to build on the card title and make up the bulk
              of the card's content.
            </Card.Text>
          </div>
        </Card.Body>
        <input type="text" size="50" placeholder="Enter your message here"></input>
        <button>send</button>
      </Card>
    </div >
  )
}

export default CreateRoomPage;