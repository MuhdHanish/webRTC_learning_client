import React, { useContext, useState, useCallback } from "react";
import { RoomContext } from "../context/RoomContext";

const JoinButton: React.FC = () => {
  const socketData = useContext(RoomContext);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const joinRoom = useCallback(() => {
    setLoading(true);
    setFeedback("Connecting...");

    socketData?.ws.emit(`join-room`);

    socketData?.ws.on("joined-room", () => {
      setLoading(false);
      setFeedback("Joined Room");
    });

    socketData?.ws.on("error", (errorMessage: string) => {
      setLoading(false);
      setFeedback(`Error: ${errorMessage}`);
    });
  }, [socketData]);

  return (
    <button
      onClick={joinRoom}
      className="bg-rose-400 py-2 px-8 rounded-lg text-lg hover:bg-rose-600 text-white duration-300"
      disabled={loading}
    >
      {loading ? "Connecting..." : "Start new meeting"}
    </button>
  );
};

export default JoinButton;
