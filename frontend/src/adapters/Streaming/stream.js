import io from 'socket.io-client';
import SimplePeer from 'simple-peer';

const WS_ENDPOINT = "ws://127.0.0.1:3000"
const socket = io(WS_ENDPOINT)
const pcs = {}
var onConnection = false


export async function createHost(stream, onError = null) {
  if (!onConnection) {
    socket.on("host_declined", () => {
      console.log("Cannot create host. Host existed")
      socket.off("stream_accepted")
      socket.off("data_receive")
      socket.off("host_declined")
      onConnection = false
      if (onError != null) {
        onError()
      }
    })
    socket.on("stream_accepted", (id) => {
      let pc = createPeer(id, { initiator: true, stream: stream })
      pcs[id] = pc
    })
    socket.on("data_receive", (id, data) => {
      let pc = pcs[id]
      pc.signal(data)
    })
    onConnection = true
    socket.emit("stream_start")
  }
}


export async function createClient(setStream) {
  if (!onConnection) {
    socket.emit("client_ready")
    socket.on("stream_receive", (id) => {
      let pc = createPeer(id)
      pc.on("stream", stream => {
        setStream(stream)
      })
      socket.emit("stream_accept", id)
      pcs[id] = pc
    })
    socket.on("data_receive", (id, data) => {
      let pc = pcs[id]
      pc.signal(data)
    })
    socket.on("host_disconnected", () => {
      setStream(null)
    })
    socket.on("node_disconnected", (id) => {
      if (pcs[id] != null) {
        pcs[id].destroy()
        delete pcs[id]
      }
    })
    onConnection = true
  }
}


export async function disconnect() {
  // Revoke socket.io event
  socket.off("stream_accepted")
  socket.off("data_receive")
  socket.off("stream_receive")
  socket.off("data_receive")
  socket.off("host_disconnected")
  socket.off("node_disconnected")
  // Disconnect
  socket.emit("node_disconnect")
  Object.keys(pcs).forEach(id => {
    pcs[id].destroy()
    delete pcs[id]
  })
  onConnection = false
}


function createPeer(id, options = {}) {
  let pc = new SimplePeer(options)
  pc.on("connect", () => {
    console.log(`Open connection with peer: ${id}`)
  })
  pc.on("close", () => {
    console.log(`Close connection with peer: ${id}`)
  })
  pc.on("signal", data => {
    socket.emit("data_send", id, data)
  })
  return pc
}