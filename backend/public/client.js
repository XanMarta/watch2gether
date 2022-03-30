// DOM elements.
const roomSelectionContainer = document.getElementById('room-selection-container')
const roomInput = document.getElementById('room-input')
const connectButton = document.getElementById('connect-button')

const videoChatContainer = document.getElementById('video-chat-container')
const localVideoComponent = document.getElementById('local-video')
const remoteVideoComponent = document.getElementById('remote-video')

// Variables.
const socket = io()
const mediaConstraints = {
  audio: false,
  video: { width: 1280, height: 720 },
}
let localStream
let remoteStream
let isRoomCreator
let rtcPeerConnection // Connection between the local device and the remote peer.
let roomId

// Free public STUN servers provided by Google.
const iceServers = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
  ],
}

// BUTTON LISTENER ============================================================
connectButton.addEventListener('click', () => {
  joinRoom(roomInput.value)
})

// SOCKET EVENT CALLBACKS =====================================================
socket.on('room_created', async () => {
  console.log('Socket event callback: room_created')

  await setLocalStream(mediaConstraints)
  isRoomCreator = true
})

socket.on('room_joined', async () => {
  console.log('Socket event callback: room_joined')

  await setLocalStream(mediaConstraints)
  socket.emit('start_call', roomId)
})

socket.on('full_room', () => {
  console.log('Socket event callback: full_room')

  alert('The room is full, please try another one')
})

/**
 * When trigger a start call callback.
 * AMBIGIUOUS: ontrack=setRemoteStream call whenever got a stream to handle (!?)
 * localStream add track to peerConnection. ontrack on the other side called when track is added to peerConnection.
 * TODO: multiple stream via PeerConnection.
 * https://stackoverflow.com/questions/66243915/how-to-get-multiple-streams-from-webrtc-peerconnection
 * 
 */
socket.on('start_call', async () => {
    console.log('Socket event callback: start_call')
  
    if (isRoomCreator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        addLocalTracks(rtcPeerConnection)
        rtcPeerConnection.ontrack = setRemoteStream
        rtcPeerConnection.onicecandidate = sendIceCandidate
        await createOffer(rtcPeerConnection)

        /**
         * EXPLAIN: since this Peer start the call, it must create offer.
         * Step 1: send an offer for connection
         */
    }
})
  
// ESTABLISH CONNECTION CALLBACKS =================================================

socket.on('webrtc_offer', async (event) => {
    console.log('Socket event callback: webrtc_offer')

    if (!isRoomCreator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers)
        addLocalTracks(rtcPeerConnection)
        rtcPeerConnection.ontrack = setRemoteStream
        rtcPeerConnection.onicecandidate = sendIceCandidate
        rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
        await createAnswer(rtcPeerConnection)

        /**
         * EXPLAIN: this peer wait for offer and send it answer.
         * It has setRemoteDescription for saving description for caller server
         * Step 2: Receive offer, set state, send answer
         */
    }
})
  
socket.on('webrtc_answer', (event) => {
    console.log('Socket event callback: webrtc_answer')

    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
    /**
     * EXPLAIN: It has setRemoteDescription for saving description for callee server
     * Step 3: Receive answer, set state, done.
     */
})

socket.on('webrtc_ice_candidate', (event) => {
    console.log('Socket event callback: webrtc_ice_candidate')

    // ICE candidate configuration.
    var candidate = new RTCIceCandidate({
    sdpMLineIndex: event.label,
    candidate: event.candidate,
    })
    rtcPeerConnection.addIceCandidate(candidate)
})

// FUNCTIONS ==================================================================
function joinRoom(room) {
  if (room === '') {
    alert('Please type a room ID')
  } else {
    roomId = room
    
    /**
     * Call socket join in server side
     */
    socket.emit('join', room)
    showVideoConference()
  }
}

/**
 * Enable HTML elemnt for videochat
 * Disable HTML elemnt for room selection
 */
function showVideoConference() {
  roomSelectionContainer.style = 'display: none'
  videoChatContainer.style = 'display: block'
}

/**
 * Get user permission and render stream from local user stream.
 * @param {*} mediaConstraints: Constraint for camera and audio.
 */
async function setLocalStream(mediaConstraints) {
    let stream
    try {
        stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    } catch (error) {
        console.error('Could not get user media', error)
    }

    localStream = stream
    /** Render video to local HTML video element */
    localVideoComponent.srcObject = stream
}

/**
 * add local track (stream) to PeerConnection
 * @param {RTCPeerConnection} rtcPeerConnection
 */
function addLocalTracks(rtcPeerConnection) {
    localStream.getTracks().forEach((track) => {
        rtcPeerConnection.addTrack(track, localStream)
        /**
         * AMBIGIOUS: What track do ?
         */
    })
}

/**
 * Create offer, set to Local Description and send to remote peer
 * @param {*} rtcPeerConnection 
 */
async function createOffer(rtcPeerConnection) {
    let sessionDescription
    try {
        sessionDescription = await rtcPeerConnection.createOffer()
        rtcPeerConnection.setLocalDescription(sessionDescription)
    } catch (error) {
        console.error(error)
    }

    socket.emit('webrtc_offer', {
        type: 'webrtc_offer',
        sdp: sessionDescription,
        roomId,
    })
}

/**
 * Create answer, set to local description, and send to remote peer
 * @param {*} rtcPeerConnection 
 */
async function createAnswer(rtcPeerConnection) {
    let sessionDescription
    try {
        sessionDescription = await rtcPeerConnection.createAnswer()
        rtcPeerConnection.setLocalDescription(sessionDescription)
    } catch (error) {
        console.error(error)
    }

    socket.emit('webrtc_answer', {
        type: 'webrtc_answer',
        sdp: sessionDescription,
        roomId,
    })
}
  
/**
 * Set remote stream to HTML element
 * @param {*} event 
 */
function setRemoteStream(event) {
    remoteVideoComponent.srcObject = event.streams[0]
    remoteStream = event.stream
}
  
/**
 * Send ice candidate or smth. Still ambigiuous about the ice candidate.
 * @param {*} event 
 */
function sendIceCandidate(event) {
    if (event.candidate) {
        socket.emit('webrtc_ice_candidate', {
            roomId,
            label: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate,
        })
    }
}

// TODO: User want to disconnect to room.