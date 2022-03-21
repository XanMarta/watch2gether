import ReactPlayer from 'react-player'

function VideoPlayer(props) {
  const videoURL = props.videoURL;
  // const videoPlaying = props.videoPlaying
  // const videoControls = props.videoControls;
  return (
    <div className="ml-40">
      <ReactPlayer url={videoURL}
        videoPlaying={true}
        videoControls={true}
      />
    </div>
  );
}

export default VideoPlayer;