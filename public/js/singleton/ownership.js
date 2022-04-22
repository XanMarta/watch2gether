import { getSocket } from './init_socket.js'

var hostid = null 

export function isHost() {
    console.log("** Ask whether this is host of room")
    return getSocket().id == hostid
}

export function isRemoteHost(socketid) {
    console.log(`Ask whether ${socketid} is equal to the host ${hostid}`)
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