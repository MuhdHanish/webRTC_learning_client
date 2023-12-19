import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const VideoPlayer: React.FC<{ stream: MediaStream | null | undefined }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
    return (
        <video ref={videoRef} autoPlay  />
    );
};

VideoPlayer.propTypes = {
    stream : PropTypes.instanceOf(MediaStream)
}

export default VideoPlayer;
