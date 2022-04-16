// import { useEffect, useRef, useState } from "react";

// function LocalStreamVideo(props) {
//   //const localstreamVideo = useRef("");
//   //const localstreamVideo = useRef();
//   props.localStreamVideo = useRef();
//   const streamConstraints = {
//     audio: false,
//     video: { width: 300, height: 300 },
//   }
//   useEffect(() => {
//     async function startStreaming() {
//           //props.localStreamVideo.current.srcObject =
//       let localStream = await navigator.mediaDevices.getUserMedia(streamConstraints);
//       props.localStreamVideo.current.srcObject = localStream;
//     }
//     startStreaming();
//   })
//   return (
//     <>
//       <video ref={props.localStreamVideo} autoPlay playsInline></video> <br></br>
//     </>
//   )
// }

// export default LocalStreamVideo;