import React, { createContext, useCallback, useEffect, useState } from "react";
import socketIO, { Socket } from "socket.io-client";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";

const WS = import.meta.env.VITE_BASE_URL;

interface IRoomProviderProps {
  children: React.ReactNode;
}

interface IRoomData {
  ws: Socket;
  myPeer: Peer | null;
  stream: MediaStream | null;
}

export const RoomContext = createContext<IRoomData | null>(null);
const ws = socketIO(WS);

const RoomProvider: React.FC<IRoomProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [myPeer, setMyPeer] = useState<Peer| null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const enterRoom = useCallback(({ roomId }: { roomId: string }) => {
    navigate(`/room/${roomId}`);
  }, [navigate]);

  const getUsers = useCallback(({ participants }: { participants: string[] }) => {
    console.log({participants});
  }, []);

  useEffect(() => {
    if (!myPeer) {
      const myPeerId = uuidV4();
      const peer = new Peer(myPeerId);
      setMyPeer(peer);
      ws.on(`room-created`, enterRoom);
      try {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream)=>setStream(stream));
      } catch (error) {
        console.error(error);
      }
    }
  }, [enterRoom, myPeer]);
 
  useEffect(() => {
    ws.on(`get-users`, getUsers);
  }, [getUsers]);

  useEffect(() => {
    if (myPeer || stream) {
      ws.on(`user-joined`, ({ peerId }: { peerId: string }) => {
        const call = myPeer?.call(peerId, stream as MediaStream);
      });
      myPeer?.on(`call`, (call) => {
        call.answer(stream as MediaStream);
      });
    }
  },[myPeer, stream])

  return (
    <RoomContext.Provider value={{ ws, myPeer, stream }}>
      {children}
    </RoomContext.Provider>
  );
};

RoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RoomProvider;
