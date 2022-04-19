// var videoStreamSendButton = document.querySelector("#video-stream-send-stream-button")
// var videoFaceSendButton = document.querySelector("#video-stream-send-face-button")

// var videoStreamStopButton = document.querySelector("#video-stream-stop-stream-button")
// var videoFaceStopButton = document.querySelector("#video-stream-stop-face-button")

// var videoStreamLocalInput = document.querySelector("#video-stream-get-file-from-local")

// videoStreamStopButton.disabled  = true 
// videoFaceStopButton.disabled  = true 


// var videoStreamRemoteVideo = document.querySelector("#video-player-remote-player")
// var videoStreamRemoteVideo2 = document.querySelector("#video-player-remote-player-2")

// var id = 0
// var peer1
// var peer2

// var currentStream = null

// function remoteStreamDisable() {
//     if (currentStream != null) 
//     {
//         peer1.removeStream(currentStream)
//         currentStream = null;
//     }

//     videoStreamStopButton.disabled = true
//     videoStreamSendButton.disabled = false 
// }


// videoStreamSendButton.addEventListener("click", function() {
//     var stream = document.querySelector('#video-player-local').getElementsByTagName('video')[0].captureStream();

//     currentStream = stream 

//     stream.isFilestream = true
//     console.log(stream.isFilestream)

//     peer1 = new SimplePeer({initiator: true, stream: stream})
//     peer2 = new SimplePeer({initiator: false})

//     peer1.on('signal', (data) => {
//         console.log("peer 1 sense signal from peer 2")
//         peer2.signal(data)
//     })

//     peer2.on('signal', (data) => {
//         console.log("peer 2 sense signal from peer 1")
//         peer1.signal(data)
//     })

//     peer2.on('data', data => {
//         console.log("Get message: ", data)
//     })

//     peer1.on('connect', () => {
//         peer1.send('Halo')
//     })

//     // peer2.on('track', (track, stream) => {
//     //     console.log('Get track: ', track)
//     //     console.log('Get stream: ', stream)
        
//     //     videoStreamRemoteVideo2.srcObject = stream
//     // })

//     peer2.on('stream', (stream) => {
//         console.log("Get stream")
//         console.log(stream.id)
//         console.log(stream.isFilestream)
//         videoStreamRemoteVideo.srcObject = stream
//     })

//     videoStreamStopButton.addEventListener('click', () => {
//         remoteStreamDisable()
//     })

//     videoStreamLocalInput.addEventListener('change', (event) => {
//         console.log("File change")
//         var file = document.getElementById('video-stream-get-file-from-local').files[0] 
//         var url = URL.createObjectURL(file)
//         console.log(url)
    
//         document.querySelector('#video-player-local').getElementsByTagName('video')[0].src = url
    
//         remoteStreamDisable()
//     })

//     videoStreamStopButton.disabled = false 
//     videoStreamSendButton.disabled = true 
// })

// videoFaceSendButton.addEventListener('click', async () => {
//     const streamConstraints = {
//         audio: false,
//         video: { width: 300, height: 300 },
//     }

//     let stream = await navigator.mediaDevices.getUserMedia(streamConstraints);
//     currentStream = stream 

//     peer1.addStream(currentStream)

//     videoFaceStopButton.addEventListener('click', () => {
//         remoteStreamDisable();
//     })

//     videoFaceStopButton.disabled = false  
//     videoFaceSendButton.disabled = true
// })

// export function videoRender() {
//     var player = videojs(document.querySelector('#video-player-local'), {
//         controls: true,
//         autoplay: false,
//         preload: 'auto',
//         width: 960,
//         height: 400,
//         poster: "http://vjs.zencdn.net/v/oceans.png" 
//     })

//     player.ready(function () {
//         this.addClass('my-example')

//         var currentVolumn = player.volume();
//         console.log(`Current volume ${currentVolumn}`)

//         player.volume(0.5);
//     })

//     player.src({
//         type: 'video/mp4',
//         src: '/video/short.mp4'
//     })

//     // Set source or smth: player.src({type: 'video/mp4', src=''})
//     // https://docs.videojs.com/tutorial-player-workflows.html

//     // TODO: full-screen
//     // TODO: muted
//     // TODO: volumn
//     // TODO: play, pause
//     // TODO: current-time, duration, remain time, buffered, bufferdPercent. Only buffer a certain amount of time, otherwise costs RAM (i think)

//     // TODO: player key
//     // TODO: video track
//     // https://docs.videojs.com/tutorial-options.html#standard-video-element-options

//     // TODO: poster

//     // player.on("ready", function () {
//     //     this.addClass('my-example')
//     // })
// }