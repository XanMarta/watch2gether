
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
                url: "turn:turn-w2g.duckdns.org:3478",
                urls: "turn:turn-w2g.duckdns.org:3478",
                credential: "webrtc",
                username: "webrtc"
            }
        ]
    }
}
