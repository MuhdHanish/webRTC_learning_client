import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RoomContext } from '../context/RoomContext';
import VideoPlayer from '../components/VideoPlayer';

const Room: React.FC = () => {
  const { id } = useParams();
  const socketData = useContext(RoomContext);
  useEffect(() => {
    if (socketData?.myPeer) {
      socketData?.ws.emit(`join-room`, {
        roomId: id,
        peerId: socketData?.myPeer?.id,
      });
    }
  }, [socketData?.ws, socketData?.myPeer, id]);
  return (
    <>
      <div>Room {id}</div>
      <VideoPlayer stream={socketData?.stream}/>
    </>
  );
}

export default Room