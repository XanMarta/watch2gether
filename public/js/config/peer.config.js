
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
                url: "stun:stun2.l.google.com:19302",
                urls: "stun:stun2.l.google.com:19302"
            },
            {
                url: "stun:numb.viagenie.ca:3478",
                urls: "stun:numb.viagenie.ca:3478"
            },
            {
                url: 'turn:numb.viagenie.ca',
                urls: 'turn:numb.viagenie.ca',
                credential: 'muazkh',
                username: 'webrtc@live.com'
            },
            {
                url: 'turn:turn.anyfirewall.com:443?transport=tcp',
                urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
                credential: 'webrtc',
                username: 'webrtc'
            }
        ]
    }
}
