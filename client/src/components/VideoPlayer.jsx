import React, { useEffect, useRef } from "react";

const VideoPlayer = ({ stream, muted, onSendStream, showSendButton = false }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div style={{ position: "relative", width: "300px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        style={{
          width: "100%",
          backgroundColor: "#000",
          borderRadius: "8px",
        }}
      />
      {showSendButton && onSendStream && (
        <button
          onClick={() => onSendStream(stream)}
          style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Send My Video
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
