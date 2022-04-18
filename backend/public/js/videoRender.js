var videoStreamSendButton = document.querySelector("#video-stream-send-stream-button")
var videoFaceSendButton = document.querySelector("#video-stream-send-face-button")

var videoStreamStopButton = document.querySelector("#video-stream-stop-stream-button")
var videoFaceStopButton = document.querySelector("#video-stream-stop-face-button")

var videoStreamLocalInput = document.querySelector("#video-stream-get-file-from-local")

videoStreamStopButton.disabled  = true 
videoFaceStopButton.disabled  = true 


var videoStreamRemoteVideo = document.querySelector("#video-player-remote-player")
var videoStreamRemoteVideo2 = document.querySelector("#video-player-remote-player-2")

// Youtube stream 
var videoStreamYoutubeDiv = document.querySelector("#youtube-video-frame")
var videoStreamYoutubeLinkInput = document.querySelector("#video-stream-youtube-link")
var videoStreamYoutubeLinkButton = document.querySelector("#video-stream-enter-youtube-link-button")
var videoStreamYoutubeDisposeButton = document.querySelector("#video-stream-delete-youtube-button")
var videoStreamYoutubeSendStreamButton = document.querySelector("#video-stream-send-youtube-stream-button")

var id = 0
var peer1
var peer2

var currentStream = null

function remoteStreamDisable() {
    peer1.removeStream(currentStream)

    videoStreamStopButton.disabled = true
    videoStreamSendButton.disabled = false 
}


function getYoutubePlayButton() {
    return document.querySelector(".ytp-large-play-button.ytp-button")
}

function getYoutubeVideoStream() {
    return document.querySelector(".video-stream.html5-main-video")
}


videoStreamSendButton.addEventListener("click", function() {
    var stream = document.querySelector('#video-player-local').getElementsByTagName('video')[0].captureStream();

    currentStream = stream 

    stream.isFilestream = true
    console.log(stream.isFilestream)

    peer1 = new SimplePeer({initiator: true, stream: stream})
    peer2 = new SimplePeer({initiator: false})

    peer1.on('signal', (data) => {
        console.log("peer 1 sense signal from peer 2")
        peer2.signal(data)
    })

    peer2.on('signal', (data) => {
        console.log("peer 2 sense signal from peer 1")
        peer1.signal(data)
    })

    peer2.on('data', data => {
        console.log("Get message: ", data)
    })

    peer1.on('connect', () => {
        peer1.send('Halo')
    })

    // peer2.on('track', (track, stream) => {
    //     console.log('Get track: ', track)
    //     console.log('Get stream: ', stream)
        
    //     videoStreamRemoteVideo2.srcObject = stream
    // })

    peer2.on('stream', (stream) => {
        console.log("Get stream")
        console.log(stream.id)
        console.log(stream.isFilestream)
        videoStreamRemoteVideo.srcObject = stream
    })

    videoStreamStopButton.addEventListener('click', () => {
        remoteStreamDisable()
    })

    videoStreamLocalInput.addEventListener('change', (event) => {
        console.log("File change")
        var file = document.getElementById('video-stream-get-file-from-local').files[0] 
        var url = URL.createObjectURL(file)
        console.log(url)
    
        document.querySelector('#video-player-local').getElementsByTagName('video')[0].src = url
    
        remoteStreamDisable()
    })

    videoStreamStopButton.disabled = false 
    videoStreamSendButton.disabled = true 
})

videoFaceSendButton.addEventListener('click', async () => {
    const streamConstraints = {
        audio: false,
        video: { width: 300, height: 300 },
    }

    let stream = await navigator.mediaDevices.getUserMedia(streamConstraints);
    currentStream = stream 

    peer1.addStream(currentStream)

    videoFaceStopButton.addEventListener('click', () => {
        remoteStreamDisable();
    })

    videoFaceStopButton.disabled = false  
    videoFaceSendButton.disabled = true
})


// var videoStreamYoutubeDiv = document.querySelector("#youtube-video-frame")
// var videoStreamYoutubeLinkInput = document.querySelector("#video-stream-youtube-link")
// var videoStreamYoutubeLinkButton = document.querySelector("#ideo-stream-enter-youtube-link-button")

var currentYoutubeVideo = null;

videoStreamYoutubeLinkButton.addEventListener('click', async () => {
    var link = videoStreamYoutubeLinkInput.value; 

    // check if string is an valid youtube link
    if (false) {
        alert(`${link} is not an youtube link!`)
        return 
    }

    // try {
        console.log(`Link: ${link}`)
        link = link.split('?')
        link = '?' + link[link.length - 1]
        var urlComponents = new URLSearchParams(link)
        var youtubeVideoId = urlComponents.get('v')

        console.log(`Parameter extracted: ${link}`)

        console.log(`Video id extracted: ${youtubeVideoId}`)

        var newYoutubeFrame = document.createElement('iframe') 

        newYoutubeFrame.setAttribute('allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay")
        newYoutubeFrame.setAttribute('autoplay', "1")
        newYoutubeFrame.setAttribute('width', "560")
        newYoutubeFrame.setAttribute('height', "315")
        newYoutubeFrame.setAttribute('title', "Youtube video player")
        newYoutubeFrame.setAttribute('frameborder', "0")
        newYoutubeFrame.setAttribute('src', `https://www.youtube.com/embed/${youtubeVideoId}`)
        newYoutubeFrame.id = "iframe-youtube-embed"

        if (currentYoutubeVideo != null) 
        {
            currentYoutubeVideo.remove();
            currentYoutubeVideo = null;
        }

        videoStreamYoutubeDiv.appendChild(newYoutubeFrame)
        currentYoutubeVideo = newYoutubeFrame

        newYoutubeFrame.onload = () => {
            console.log(`get current youtube video element ${getYoutubeVideoStream()}`)

            console.log(`get current youtube video element ${getYoutubePlayButton()}`)

            var youtubeVideoElement = newYoutubeFrame.querySelector(".video-stream.html5-main-video")
            console.log(`Get element inside iframe got ${youtubeVideoElement}`)
            console.log(`Get element inside iframe got ${newYoutubeFrame.captureStream()}`)
        }

        videoStreamYoutubeSendStreamButton.addEventListener("click", () => {
            console.log(`get current youtube video element ${getYoutubeVideoStream()}`)

            console.log(`get current youtube video element ${getYoutubePlayButton()}`)

            var youtubeVideoElement = newYoutubeFrame.querySelector(".video-stream.html5-main-video")
            console.log(`Get element inside iframe got ${youtubeVideoElement}`)
        })

    // } catch (err) {
    //     alert(err.message)

    //     if (currentYoutubeVideo != null) 
    //     {
    //         currentYoutubeVideo.remove()
    //     }
    //     currentYoutubeVideo = null 
    // }
})

videoStreamYoutubeDisposeButton.addEventListener('click', () => {
    if (currentYoutubeVideo != null) 
    {
        currentYoutubeVideo.remove();
    }
    currentYoutubeVideo = null
})


export function videoRender() {
    var player = videojs(document.querySelector('#video-player-local'), {
        controls: true,
        autoplay: false,
        preload: 'auto',
        width: 960,
        height: 400,
        poster: "http://vjs.zencdn.net/v/oceans.png" 
    })

    player.ready(function () {
        this.addClass('my-example')

        var currentVolumn = player.volume();
        console.log(`Current volume ${currentVolumn}`)

        player.volume(0.5);
    })

    player.src({
        type: 'video/mp4',
        src: '/video/short.mp4'
    })

    // Set source or smth: player.src({type: 'video/mp4', src=''})
    // https://docs.videojs.com/tutorial-player-workflows.html

    // TODO: full-screen
    // TODO: muted
    // TODO: volumn
    // TODO: play, pause
    // TODO: current-time, duration, remain time, buffered, bufferdPercent. Only buffer a certain amount of time, otherwise costs RAM (i think)

    // TODO: player key
    // TODO: video track
    // https://docs.videojs.com/tutorial-options.html#standard-video-element-options

    // TODO: poster

    // player.on("ready", function () {
    //     this.addClass('my-example')
    // })
}