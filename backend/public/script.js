const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const socket = io('/')
var myVideoStream;

// Create and receive connection
var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3030"
});
myVideo.muted = true;

console.log("Create new peer: ", peer)


const connectToNewUser = (userId, stream) => {
  console.log("Connect to new user: ", userId)

  const call = peer.call(userId, stream)
  const video = document.createElement("video")

  call.on("stream", (userVideoStream) => {
    console.log("Call got a answer stream")
    addVideoStream(video, userVideoStream)
  })
}

peer.on("open", (id) => {
  console.log("Peer got open room id: ", ROOM_ID)
  console.log("Peer got open user id: ", id)

  console.log("Emit join-room")
  console.log("Emit socket id: ", socket.id)
  socket.emit("join-room", ROOM_ID, id)
})

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
     video.play();
     videoGrid.append(video);
  });
};


navigator.mediaDevices.getUserMedia({
  audio: true,
  video: true,
})
.then((stream) => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  peer.on("call", (call) => {
    console.log("Peer got a call")

    call.answer(stream);

    const video = document.createElement("video")

    call.on("stream", (userVideoStream) => {
      console.log("Call got a stream")
      addVideoStream(video, userVideoStream)
    })
  })

  socket.on("user-connected", (userId) => {
    connectToNewUser(userId, stream);
  })

  console.log("Emit message ready")
  socket.emit("ready")
});
