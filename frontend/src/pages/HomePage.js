import { useState, Fragment, useEffect } from 'react';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getSocket, setSocket } from "../adapters/Streaming/StreamSingleton/init_socket"
import init from '../adapters/Streaming/main'

function HomePage() {
  const username = useSelector((state) => state.loginInfo.value);
  const navigate = useNavigate();
  const style = {
    "margin-top": "20px",
    "margin-left": "30rem",
  }
  const [RoomId, setRoomId] = useState('');
  const socket = getSocket();
  useEffect(() => {
    init()
  }, []);
  function enterRoom(e) {
    e.preventDefault();
    console.log("Room enter?");
    //console.log("Join room: ", RoomId)
    socket.emit("register-username", username)
    socket.emit("join-room", RoomId)
    navigate('/joinroom/'.concat(RoomId));
  }

  // function createRoom() {

  // }
  if (username !== "") {
    return (
      <div className="aligns-items-center justify-content-center" style={style}>
        <section>
          <h1>Welcome back. What are you gonna do today?</h1>
        </section>
        <section>
          <h1>Welcome user to our site!</h1>
        </section>
        <Button variant="primary" size="lg" onClick={(e) => { navigate("/search") }}>Find a video</Button>
        <br></br>
        <input type="text" placeholder="Enter room id" onChange={(e) => setRoomId(e.target.value)}></input>
        <input type="text" placeholder="Enter name to join/create room" value={username}></input>
        <br></br>
        <Button variant="primary" size="lg" onClick={(e) => {
          e.preventDefault();
          navigate("/createroom/".concat(RoomId)); console.log("Join room id is: ", RoomId)
          socket.emit("register-username", username)
          socket.emit("join-room", RoomId);
          console.log(socket);
        }}>Create a room</Button>
        <br></br>
        <Button variant="primary" size="lg" onClick={enterRoom}>
          Enter a room
        </Button>
        {/* {
          ShowForm ? <Form /> : null
        } */}
      </div >
    );
  } else {
    return (
      <>
        <div class="container">
          <h1 class="mt-5">Sticky footer with fixed navbar</h1>
          <p class="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code class="small">padding-top: 60px;</code> on the <code class="small">main &gt; .container</code>.</p>
          <p>Back to <a href="../examples/sticky-footer/">the default sticky footer</a> minus the navbar.</p>
        </div>
        <div class="container">
          <h1 class="mt-5">Sticky footer with fixed navbar</h1>
          <p class="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code class="small">padding-top: 60px;</code> on the <code class="small">main &gt; .container</code>.</p>
          <p>Back to <a href="../examples/sticky-footer/">the default sticky footer</a> minus the navbar.</p>
        </div>
        <div class="container">
          <h1 class="mt-5">Sticky footer with fixed navbar</h1>
          <p class="lead">Pin a footer to the bottom of the viewport in desktop browsers with this custom HTML and CSS. A fixed navbar has been added with <code class="small">padding-top: 60px;</code> on the <code class="small">main &gt; .container</code>.</p>
          <p>Back to <a href="../examples/sticky-footer/">the default sticky footer</a> minus the navbar.</p>
        </div>
      </>
    );
  }
}

export default HomePage;