import React, { useContext, useState, useCallback } from "react";
import { RoomContext } from "../context/RoomContext";

const CreateButton: React.FC = () => {
  const socketData = useContext(RoomContext);
  const [loading, setLoading] = useState(false);
  
  const createRoom = useCallback(() => {
    setLoading(true);
    socketData?.ws.emit(`create-room`);
    setLoading(false);
  }, [socketData?.ws]);

  return (
    <>
      <button
        onClick={createRoom}
        className="bg-rose-400 py-2 px-8 rounded-lg text-lg hover:bg-rose-600 text-white duration-300"
        disabled={loading}
      >
        {loading ? "Connecting..." : "Start new meeting"}
      </button>
    </>
  );
};

export default CreateButton;
