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

interface ICustomPeer extends Peer {
  _id: string;
}

interface IRoomData {
  ws: Socket;
  myPeer?: ICustomPeer;
}

export const RoomContext = createContext<null | IRoomData>(null);
const ws = socketIO(WS);

const RoomProvider: React.FC<IRoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const [myPeer, setMyPeer] = useState<ICustomPeer>();
    
    const enterRoom = useCallback(({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    }, [navigate]);
  
    useEffect(() => {
      const myPeerId = uuidV4();
      const peer = new Peer(myPeerId);
      setMyPeer(peer as ICustomPeer);
      ws.on(`room-created`, enterRoom);
    }, [enterRoom]);
  
  return <RoomContext.Provider value={{ ws, myPeer }}>{children}</RoomContext.Provider>;
};

RoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RoomProvider;