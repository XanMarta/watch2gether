const { createServer } = require('http')
const { Server } = require('socket.io')
const Client = require('socket.io-client')

const routes = require('../routes')

const roomid = 13


function init_server() {
    let server = createServer()
    let io = new Server(server)
    server.listen(3000)
    routes(io)  // Test agent
    return io
}

function delete_server(io) {
    io.close()
}

async function init_client(num, joinRoom=false) {
    let clients = []
    for (let i = 0; i < num; i++) {
        clients.push(new Client('http://localhost:3000'))
    }
    // Join room
    if (joinRoom) {
        let promises = []
        for (let i = 0; i < num; i++) {
            clients[i].emit("register-username", `client${i}`)
            clients[i].emit("join-room", roomid)
            promises.push(new Promise(res => clients[i].on("room-joined", () => res())))
        }
        await Promise.all(promises)
    }
    return clients
}

function delete_client(clients) {
    for (const client of clients) {
        client.close()
    }
}


module.exports = {
    init_server,
    delete_server,
    init_client,
    delete_client,
    roomid
}
