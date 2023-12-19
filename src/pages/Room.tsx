import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RoomContext } from '../context/RoomContext';
import VideoPlayer from '../components/VideoPlayer';
import { PeerState } from '../context/peerReducer';

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
      <div className="grid grid-cols-4 gap-4 ">
        <VideoPlayer stream={socketData?.stream} />
        {Object.values(socketData?.peers as PeerState).map((peer) => (
          <VideoPlayer stream={peer.stream} key={peer.stream.id} />
        ))}
      </div>
    </>
  );
}

export default Room