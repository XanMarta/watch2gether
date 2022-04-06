// --- Define library --- Server run port ---

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const socket = require('socket.io')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://127.0.0.1:3000"
}))

app.use(express.static("public"))

const server = app.listen(3000, () => console.log('Listening on port 3000 ...'))

const io = socket(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

// --- Implement for handling connection ---

// let host = null

// io.on("connection", (socket) => {
//     console.log(`Connection established: ${socket.id}`)

//     socket.on("client_ready", () => {

//     })

//     socket.on("stream_start", () => {

//     })

//     socket.on("stream_accept", (id) => {
//         io.to(id).emit("stream_accepted", socket.id)
//     })

//     socket.on("data_send", (id, data) => {
//         io.to(id).emit("data_receive", socket.id, data)
//     })

//     socket.on("node_disconnect", () => {

//     })

//     socket.on("disconnect", () => {

//     })

//     socket.onAny((event) => {
//         console.log(`Event: ${event}`)
//     })
// })


room = {}

io.on("connection", (socket) => {
    console.log("New connection from socket id: ", socket.id);

    socket.on("client", (message) => {
        console.log(`Get message from client ${socket.id} with message: ${message}`)
        io.to(socket.id).emit("server", "Hello from server")
    })

    socket.on("join_room", (roomId) => {
        console.log(`Client ${socket.id} want to join ${roomId}`);

        socket.join(roomId)
        socket.to(roomId).emit('join_room', socket.id);

        socket.emit("room_joined", roomId)

        room[socket.id] = roomId
        console.log(io.sockets.adapter.rooms)
    })

    socket.on("broadcast_message_room", (message) => {
        console.log(`Client ${socket.id} send message to ${room[socket.id]}`)

        socket.to(room[socket.id]).emit("room_message", message)
    })

    socket.on("disconnect", () => {
        console.log(`Client ${socket.id} disconnect`)
        if (room[socket.id] != null)
        {
            io.to(room[socket.id]).emit("room_message", `User ${socket.id} disconnected.`)
            delete room[socket.id]
        }
    })

    socket.on("get-room-info", () => {
        if (room[socket.id] != null) {
            console.log("Get request for room infomation: ", room[socket.id])

            let roomClientArr = {
                roomId: room[socket.id],
                client: Array.from(io.sockets.adapter.rooms.get(room[socket.id]))
            }
            
            socket.emit("room-info", roomClientArr)
            console.log("Return room information to client: ", )
        } else {
            socket.emit("not-in-room")
        }

    })
})
