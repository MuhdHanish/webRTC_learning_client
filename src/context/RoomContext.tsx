import React, { createContext } from "react";
import socketIO, { Socket } from "socket.io-client";
import PropTypes from "prop-types";

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
  return <RoomContext.Provider value={{ ws }}>{children}</RoomContext.Provider>;
};

RoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RoomProvider;