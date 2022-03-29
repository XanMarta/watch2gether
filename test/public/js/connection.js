
/**
 * Establish connection between two peer.
 * @param {*} pc RTCPeerConnection object
 * @param {*} socket io socket object
 */
 export async function setConnectionHandler(pc, socket) {
    /**
     * When get an ice candidate from server, emit it own ice cancdidate
     */
    pc.onicecandidate = e => {
        console.log("Ice candidate")
        socket.emit("icecandidate", e.candidate)
    }

    /**
     * Get offer from other peer. Set to it remote description
     * Send it answer.
     * Like establish handshake connection
     */
    socket.on("r_offer", async (r_offer) => {
        await pc.setRemoteDescription(r_offer)
        const answer = await pc.createAnswer()
        socket.emit("answer", answer)
        await pc.setLocalDescription(answer)
        console.log("Receive offer and send answer")
    });
    
    /**
     * Get answer from other peer.
     * Set to it remote description.
     */
    socket.on("r_answer", async (r_answer) => {
        await pc.setRemoteDescription(r_answer);
        console.log("Receive answer")
    });

    /**
     * Get ice candidate from other peer
     * Set to it ice candidate
     */
    socket.on("r_icecandidate", async (candidate) => {
        await pc.addIceCandidate(candidate);
    });
}

/**
 * Send a greet from client. To check connection
 * @param {*} socket : io socket object
 */
export async function testCallServer(socket) {
    console.log("Send socket message");
    socket.emit("client", "Hello from client");
    socket.on("server", (message) => {
        console.log(`Message received: ${message}`);
    })
}