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

const users = [];

io.on("connection", (socket) => {
    console.log("Make socket connection")
    users.push(socket.id)

    socket.on("client", (message) => {
        console.log(`Message received: ${message}`)
        io.to(socket.id).emit("server", "Hello from server")
    })

    socket.on("offer", (offer) => {
        // socket.broadcast.emit("r_offer", socket.id, offer)
        socket.broadcast.emit("r_offer", offer)
        console.log("Receive offer")
    })

    socket.on("answer", (offer) => {
        // io.to(id).emit("r_answer", offer)
        socket.broadcast.emit("r_answer", offer)
        console.log("Receive answer")
    })

    socket.on("icecandidate", (candidate) => {
        socket.broadcast.emit("r_icecandidate", candidate)
        console.log("Ice candidate")
    })

    socket.on("ready", () => {
        socket.broadcast.emit("r_ready")
        console.log("Ready")
    })
})