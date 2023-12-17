import React, { createContext, useCallback, useEffect } from "react";
import socketIO, { Socket } from "socket.io-client";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const WS = import.meta.env.VITE_BASE_URL;

interface IRoomProviderProps {
  children: React.ReactNode;
}

interface IRoomData {
    ws: Socket
}

export const RoomContext = createContext<null | IRoomData>(null);
const ws = socketIO(WS);

const RoomProvider: React.FC<IRoomProviderProps> = ({ children }) => {
    const navigate = useNavigate();
    const enterRoom = useCallback(({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    },[navigate]);
    useEffect(() => {
        ws.on(`room-created`, enterRoom);
    }, [enterRoom]);
  return <RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>;
};

RoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RoomProvider;