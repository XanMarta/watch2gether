const express = require('express');
const app = express();
const server = require('http').Server(app);
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server)
const {ExpressPeerServer} = require("peer");

const peerServer = ExpressPeerServer(server, {
  debug: true
})

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use("/peerjs", peerServer)

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`);
});


app.get('/:room', (req, res) => {
  res.render('room', { 
    roomId: req.params.room
  });
})

io.on("connection", (socket) => {
  console.log("1. Server connection")
  console.log("2. Socket id: ", socket.id)

  socket.on("join-room", (roomId, userId) => {
    console.log("1. Join room userId: ", userId)
    console.log("2. Join room roomId: ", roomId)
    console.log("3. Add ready and disconnect to socket")

    socket.join(roomId)
    socket.broadcast.to(roomId).emit('user-connected', userId)

    socket.on('ready', () => {
      console.log("Socket get ready")
    })

    socket.on('disconnect', () => {
      console.log("Socket disconnected")
      socket.to(roomId).emit('user-disconnected', userId)
    })
  })
})

server.listen(3030);