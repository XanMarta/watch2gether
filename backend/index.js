const express = require('express')
const app = express()
const server = require('http').createServer(app)

/**
 * Init server socket.
 */
const io = require('socket.io')(server)

/**
 * Setup middleware
 */
app.use(express.json())
app.use('/', express.static('public'))


/**
 * Setup connection handler.
 * Hypothesis: All socket in client are connecting to the server socket io
 * Client talk to other using RTCPeerConnection and RTCDataChannel, not socket io.
 * 
 * If a socket emits in server js file, it will trigger a handler in client js file.
 * Vice versa for emitting in client js file.
 */

/**
 * Literally whenever client emit something.
 */
io.on('connection', (socket) => {
    console.log("Got new connection")

    /**
     * When socket want to join a room
     */
    socket.on('join', (roomId) => {
        console.log("Curious on join: io adapter rooms: ", typeof(io.sockets.adapter.rooms))
        const roomClients = io.sockets.adapter.rooms.get(roomId) || { size: 0 }

        console.log("Curious number of clients: ", typeof(roomClients))
        const numberOfClients = roomClients.size

        // These events are emitted only to the sender socket.
        // In this example, only 2 clients is present, 
        if (numberOfClients == 0) {
            console.log(`Creating room ${roomId} and emitting room_created socket event`)
            socket.join(roomId)

            /**
             * TEST
             */
            console.log("Check if number of client in room increase: ", io.sockets.adapter.rooms.get(roomId))
            console.log("Check if length of set of client increase: ", io.sockets.adapter.rooms.get(roomId).size)
            /**
             * END TEST
             */

            io.to(roomId).emit('room_created', roomId)

        } else if (numberOfClients == 1) {
            console.log(`Joining room ${roomId} and emitting room_joined socket event`)
            socket.join(roomId)

            /**
             * TEST
             */
            console.log("Check if number of client in room increase: ", io.sockets.adapter.rooms.get(roomId))
            console.log("Check if length of set of client increase: ", io.sockets.adapter.rooms.get(roomId).size)
            /**
             * END TEST
             */

            io.to(roomId).emit('room_joined')

        } else {
            // TODO: Upgrade for more client
            console.log(`Can't join room ${roomId}, emitting full_room socket event`)
            socket.emit('full_room', roomId)
        }
    })

    // These events are emitted to all the sockets connected to the same room except the sender.
    /**
     * roomId: int
     */
    socket.on('start_call', (roomId) => {
        console.log(`Broadcasting start_call event to peers in room ${roomId}`)

        /**
         * EXPLAIN: send an event "start_call" to all socket connect to roomId
         */
        socket.to(roomId).emit('start_call')
    })
    /**
     * event: object.
     * {type: 'webrtc_offer', sdp: sessionDescription, roomId}
     */
    socket.on('webrtc_offer', (event) => {
            console.log(`Broadcasting webrtc_offer event to peers in room ${event.roomId}`)
            console.log("Curious webrtc offer: ", typeof(event))

            /**
             * EXPLAIN: send event.sdp to all socket in roomId.
             * So all socket in room can establish an connection to socket in room.
             */
            socket.to(event.roomId).emit('webrtc_offer', event.sdp)
            /**
             * AMBIGUOUS: "socket" or it shoule be "io"
             */
    })
    /**
     * event: object.
     * {type: 'webrtc_answer', sdp: sessionDescription, roomId}
     */
    socket.on('webrtc_answer', (event) => {
            console.log(`Broadcasting webrtc_answer event to peers in room ${event.roomId}`)
            console.log("Curious webrtc answer: ", typeof(event))

            socket.to(event.roomId).emit('webrtc_answer', event.sdp)
            /**
             * AMBIGUOUS: "socket" or it shoule be "io"
             */
    })
    /**
     * event: object of ice candidate.
     * {roomId, label: event.candidate.sdpMLineIndex, candidate: event.candidate.candidate}
     * send event to all socket in the same room.
     */
    socket.on('webrtc_ice_candidate', (event) => {
            console.log(`Broadcasting webrtc_ice_candidate event to peers in room ${event.roomId}`)
            console.log("Curious webrtc ice candidate: ", typeof(event))

            socket.to(event.roomId).emit('webrtc_ice_candidate', event)
            /**
             * AMBIGUOUS: "socket" or it shoule be "io"
             */
    })
})

// START THE SERVER =================================================================
const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
})