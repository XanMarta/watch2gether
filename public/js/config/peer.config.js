
export function getPeerConfig() {
    return {
        iceServers: [
            {
                url: "stun:stun.l.google.com:19302",
                urls: "stun:stun.l.google.com:19302"
            },
            {
                url: "stun:stun1.l.google.com:19302",
                urls: "stun:stun1.l.google.com:19302"
            },
            {
                url: "turn:159.89.204.211:3478",
                urls: "turn:159.89.204.211:3478",
                credential: "webrtc",
                username: "webrtc"
            }
        ]
    }
}
