import React, { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RoomContext } from '../context/RoomContext';

const Room: React.FC = () => {
  const { id } = useParams();
  const socketData = useContext(RoomContext);
  useEffect(() => {
    if (socketData?.myPeer) {
      socketData?.ws.emit(`join-room`, { roomId: id, peerId: socketData?.myPeer?._id });
    }
  }, [socketData?.ws, socketData?.myPeer, id]);
  return (
    <div>Room {id}</div>
  )
}

export default Room