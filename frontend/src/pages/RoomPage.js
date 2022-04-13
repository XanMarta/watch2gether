import VideoPlayer from '../components/General/VideoPlayer'
import ChatForm from '../components/Room/ChatForm'
import { useParams } from 'react-router';

function RoomPage() {
  let { id } = useParams();
  return (
    // <h1>This is room page.</h1>
    <div className="mt-4 mb-52">
      <VideoPlayer
        //videoURL={"https://www.youtube.com/watch?v=" + id}
        //videoPlaying={true}
        videoURL={"https://www.youtube.com/watch?v=Bwx3JFWi9XE#Nightstep_-_Run_Away"}
      />
      <div className="ml-40">
        <ChatForm />
      </div>
    </div>
  )
}

export default RoomPage;