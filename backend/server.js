// const express = require('express');
// const app = express();
// const server = require('http').Server(app);
// const { v4: uuidv4 } = require("uuid");
// const io = require("socket.io")(server)
// const {ExpressPeerServer} = require("peer");
// const { SocketAddress } = require('net');

// const peerServer = ExpressPeerServer(server, {
//   debug: true
// })

// app.set('view engine', 'ejs')

// app.use(express.static('public'))
// app.use("/peerjs", peerServer)

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidv4()}`);
// });


// app.get('/:room', (req, res) => {
//   res.render('room', { 
//     roomId: req.params.room
//   });
// })

// io.on("connection", (socket) => {

//   socket.on("connect-error", (err) => {
//     console.log("Connect_error due to ", err.message)
//   })

//   socket.on("join-room", (roomId, userId) => {
//     console.log("Server get join request")
//     console.log("Room id: ", roomId)
//     console.log("User id: ", userId)
//   })

//   socket.on('ready', () => {
//     console.log("Socket get ready")
//   })

//   socket.on("join-room", (roomId, userId) => {
//     console.log("1. Join room userId: ", userId)
//     console.log("2. Join room roomId: ", roomId)
//     console.log("3. Add ready and disconnect to socket")

//     socket.join(roomId)
//     io.broadcast.to(roomId).emit('user-connected', userId)

//     socket.on('disconnect', () => {
//       console.log("Socket disconnected")
//       io.to(roomId).emit('user-disconnected', userId)
//     })
//   })
// })

// server.listen(3030);


const express = require("express");
const socket = require("socket.io");
const { v4: uuidv4 } = require("uuid");


// App setup
const PORT = 5000;
const app = express();
const server = app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Static files
app.use(express.static("public"));
app.set('view engine', 'ejs')

// Socket setup
const io = socket(server);

const activeUsers = new Set();

// redirect client to a room URL
app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

// API for a room. Render page and extract roomID
app.get('/:room', (req, res) => {
  res.render('room', { 
    roomId: req.params.room
  });
})

// Called whenever get a new connection
io.on("connection", function (socket) {
  console.log("Made socket connection");

  // called whenever get a new user
  socket.on("new user", function (data) {
    console.log("New user")

    socket.userId = data;
    activeUsers.add(data);

    // server send broadcast to all client
    io.emit("new user", [...activeUsers]);
  });

  // call when an connection is disconnected
  socket.on("disconnect", () => {
    console.log("Disconnected")

    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
  });

  // call when an connection want to join a room 
  // INCOMPLETE + UNCHECK
  socket.on("join-room", function(roomId, userId) {
    console.log(`${userId} joined room ${roomId}`)

    socket.join(roomId)
    socket.broadcast.emit("hello", "world")
  })

  // Call when a client wants to connect to this client.
  socket.on("connect to user", (message) => {
    console.log("Got connect offer: ", message)
  })
});