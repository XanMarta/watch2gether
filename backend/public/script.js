// const videoGrid = document.getElementById("video-grid");
// const myVideo = document.createElement("video");
// const socket = io()
// var myVideoStream;

// // Create and receive connection
// var peer = new Peer(undefined, {
//   path: "/peerjs",
//   host: "/",
//   port: "3030"
// });
// myVideo.muted = true;

// console.log("Create new peer: ", peer)


// const connectToNewUser = (userId, stream) => {
//   console.log("Connect to new user: ", userId) 

//   const call = peer.call(userId, stream)
//   const video = document.createElement("video")

//   call.on("stream", (userVideoStream) => {
//     console.log("Call got a answer stream")
//     addVideoStream(video, userVideoStream)
//   })
// }

// peer.on("open", (id) => {
//   console.log("Peer got open room id: ", ROOM_ID)
//   console.log("Peer got open user id: ", id)

//   console.log("Emit join-room")
//   console.log("Emit socket id: ", socket.id)
//   console.log("Socket: ", socket)
//   socket.emit("join-room", ROOM_ID, id)
// })

// const addVideoStream = (video, stream) => {
//   video.srcObject = stream;
//   video.addEventListener("loadedmetadata", () => {
//      video.play();
//      videoGrid.append(video);
//   });
// };


// navigator.mediaDevices.getUserMedia({
//   audio: true,
//   video: true,
// })
// .then((stream) => {
//   myVideoStream = stream;
//   addVideoStream(myVideo, stream);

//   peer.on("call", (call) => {
//     console.log("Peer got a call")

//     call.answer(stream);

//     const video = document.createElement("video")

//     call.on("stream", (userVideoStream) => {
//       console.log("Call got a stream")
//       addVideoStream(video, userVideoStream)
//     })
//   })

//   socket.on("user-connected", (userId) => {
//     connectToNewUser(userId, stream);
//   })

//   console.log("Emit message ready")
//   socket.emit("ready")
// });


const socket = io();

// Define reference to UI element
const loginBtn = document.querySelector("#loginBtn")
const localVideo = document.querySelector("#localVideo")
const remoteVideo = document.querySelector("#remoteVideo")
const usernameInput = document.querySelector("#usernameInput")
const callToUsernameInput = document.querySelector("#callToUsernameInput")
const callBtn = document.querySelector("#callBtn")

// Get right to use camera 
var myStream;
const userMediaConstraint = {
  video: true
}

// Current username 
let userName = "";

// Function called when new user is connected
const newUserConnected = (user) => {
  console.log("Create new user")

  userName = usernameInput.value;

  if (userName.length > 0) {
      socket.emit("new user", userName);
      addToUsersBox(userName);
  }
};

// Function logs all current online username
const addToUsersBox = (userName) => {
    console.log(`* ${userName}`)
};

// Function call when want to connect to other user
const connectToUser = () => {
  var userToConnect = callToUsernameInput.value;

  if (userToConnect.length > 0) {
    socket.emit("connect to user", `Hello from ${userName}`)
  }
}


// new user is created so we get nickname and emit event
loginBtn.addEventListener("click", (event) => {
  navigator.mediaDevices.getUserMedia(userMediaConstraint)
    .then((stream) => {
      myStream = stream;
      localVideo.srcObject = stream;
    })
    .catch((err) => console.log("WebRTC get error: ", err))

  newUserConnected();
})

// Connect to a specific user
callBtn.addEventListener("click", (event) => {
  connectToUser();
})

// Whenever get a new user, logs all current online user
socket.on("new user", function (data) {
    console.log("Current user list:")

    data.map((data) => addToUsersBox(data));
});

// Call when an user disconnected
socket.on("user disconnected", function (userName) {
    console.log(`User ${userName} disconnected.`)
});

