import React, { useCallback, useEffect, useMemo, useState } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = ({ children }) => {
  const [remoteStream, setRemoteStream] = useState(null);

  const peer = useMemo(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });

    pc.addEventListener("signalingstatechange", () => {
      console.log("📡 Signaling state:", pc.signalingState);
    });

    return pc;
  }, []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAns = async (ans) => {
    if (peer.signalingState === "have-local-offer") {
      await peer.setRemoteDescription(new RTCSessionDescription(ans));
    } else {
      console.warn("❌ Can't set remote answer. State is", peer.signalingState);
    }
  };

  const sendStream = useCallback((stream) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });
  }, [peer]);

  const handleTrackEvent = useCallback((event) => {
    const [stream] = event.streams;
    if (stream) {
      setRemoteStream(stream);
    }
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);
    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [peer, handleTrackEvent]);

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAns,
        sendStream,
        remoteStream,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
