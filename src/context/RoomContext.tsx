import React, {
  createContext,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import socketIO, { Socket } from "socket.io-client";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { v4 as uuidV4 } from "uuid";
import { PeerState, peerReducer } from "./peerReducer";
import { addPeerAction, removePeerAction } from "./peerActions";

const WS = import.meta.env.VITE_BASE_URL;

interface IRoomProviderProps {
  children: React.ReactNode;
}

interface IRoomData {
  ws: Socket;
  myPeer: Peer | null;
  stream: MediaStream | null;
  peers: PeerState;
}

export const RoomContext = createContext<IRoomData | null>(null);
const ws = socketIO(WS);

const RoomProvider: React.FC<IRoomProviderProps> = ({ children }) => {
  const navigate = useNavigate();

  const [myPeer, setMyPeer] = useState<Peer | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, dispatch] = useReducer(peerReducer, {});

  const enterRoom = useCallback(
    ({ roomId }: { roomId: string }) => {
      navigate(`/room/${roomId}`);
    },
    [navigate]
  );

  const getUsers = useCallback(
    ({ participants }: { participants: string[] }) => {
      console.log({ participants });
    },
    []
  );

  const removePeer = useCallback(({ peerId }: { peerId: string }) => {
    dispatch(removePeerAction(peerId));
  }, []);

  useEffect(() => {
    if (!myPeer) {
      const myPeerId = uuidV4();
      const peer = new Peer(myPeerId);
      setMyPeer(peer);
      ws.on(`room-created`, enterRoom);
      try {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => setStream(stream));
      } catch (error) {
        console.error(error);
      }
    }
    ws.on(`get-users`, getUsers);
    ws.on(`user-disconnected`, removePeer);
  }, [myPeer, enterRoom, getUsers, removePeer]);

  useEffect(() => {
    if (myPeer && stream) {
      ws.on(`user-joined`, ({ peerId }: { peerId: string }) => {
        const call = myPeer?.call(peerId, stream as MediaStream);
        call?.on(`stream`, (peerStream) => {
          dispatch(addPeerAction(peerId, peerStream));
        });
      });
      myPeer?.on(`call`, (call) => {
        call.answer(stream as MediaStream);
        call?.on(`stream`, (peerStream) => {
          dispatch(addPeerAction(call.peer, peerStream));
        });
      });
    }
  }, [myPeer, stream]);

  return (
    <RoomContext.Provider value={{ ws, myPeer, stream, peers }}>
      {children}
    </RoomContext.Provider>
  );
};

RoomProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RoomProvider;
