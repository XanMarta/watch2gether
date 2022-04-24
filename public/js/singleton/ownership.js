import { getSocket } from './init_socket.js'

var hostid = null 

export function isHost() {
    console.log("** Ask whether this is host of room")
    console.log(`Get result: ${getSocket().id == hostid}`)
    return getSocket().id == hostid
}

export function isRemoteHost(socketid) {
    console.log(`Ask whether ${socketid} is equal to the host ${hostid}`)
    console.log(`Get result: ${socketid == hostid}`)
    return socketid == hostid
}

export function setHost(hostId) {
    console.log(`** Set hostId to ${hostId}`)
    hostid = hostId 
}

export function getHost() {
    console.log(`Get hostId, get ${hostid}`)
    return hostid
}