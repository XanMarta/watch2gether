// --- Define library --- Server run port ---

const fs = require('fs')
const cors = require('cors')
const express = require('express')
const socket = require('socket.io')
const bodyParser = require('body-parser')

const { setIo, getIo } = require('./singleton/io')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: "http://127.0.0.1:3000"
}))

app.use(express.static("public"))

const server = app.listen(3000, () => console.log('Listening on port 3000 ...'))

setIo(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

require("./routes")(getIo())

