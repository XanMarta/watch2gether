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

// WebRTC

let host = null

io.on("connection", (socket) => {
    console.log(`Connection established: ${socket.id}`)

    socket.on("client_ready", () => {
        if (host != null) {
            io.to(socket.id).emit("stream_receive", host)
        }
    })

    socket.on("stream_start", () => {
        if (host == null) {
            socket.broadcast.emit("stream_receive", socket.id)
            host = socket.id
        } else {
            io.to(socket.id).emit("host_declined")
        }
    })

    socket.on("stream_accept", (id) => {
        io.to(id).emit("stream_accepted", socket.id)
    })

    socket.on("data_send", (id, data) => {
        io.to(id).emit("data_receive", socket.id, data)
    })

    socket.on("node_disconnect", () => {
        socket.broadcast.emit("node_disconnected", socket.id)
        if (socket.id == host) {
            socket.broadcast.emit("host_disconnected")
            host = null
        }
    })

    socket.on("disconnect", () => {
        console.log(`Connection destroyed: ${socket.id}`)
        socket.broadcast.emit("node_disconnected", socket.id)
        if (socket.id == host) {
            socket.broadcast.emit("host_disconnected")
            host = null
        }
    })

    socket.onAny((event) => {
        console.log(`Event: ${event}`)
    })
})