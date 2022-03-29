

/**
 * Add handler for track (??)
 * @param {*} pc RTCPeerConnection object
 * @param {*} remoteVideo html element for rendering video
 */
 export async function setStreamHandler(pc, remoteVideo) {
    /**
     * Get a track object from server. Set remoteVideo to render stream. 
     */
    pc.ontrack = e => {
        remoteVideo.srcObject = e.streams[0];
        console.log("Receive track");
    };
}

/**
 * 
 * @param {*} pc RTCPeerConnection object 
 * @param {*} socket io socket object 
 * @param {*} localVideo html element for rendering video from local machine
 */
export async function getStream(pc, socket, localVideo) {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        localVideo.srcObject = stream;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        console.log("Stream started")
    } catch (err) {
        console.log("Cannot get stream: ", err)
    }

    const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    });
    socket.emit("offer", offer)
    await pc.setLocalDescription(offer);
}

