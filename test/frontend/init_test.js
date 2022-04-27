const { createServer } = require('http')
const { Server } = require('socket.io')


function init_server(port) {
    let server = createServer()
    let io = new Server(server)
    server.listen(port)
    routes(io)  // Test agent
    return io
}

function delete_server(io) {
    io.close()
}


module.exports = {
    init_server,
    delete_server
}
