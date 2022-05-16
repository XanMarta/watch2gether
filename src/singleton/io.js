const socket = require('socket.io')

var io = undefined 

function setIo(server, option) {
    console.log("** A Single instance of IO is created !! **")
    io = socket(server, option)
}

function getIo() {
    return io 
}

module.exports = {
    setIo,
    getIo
}

