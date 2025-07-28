import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";
import VideoPlayer from "../components/VideoPlayer";

const RoomPage = () => {
  const { socket } = useSocket();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAns,
    sendStream,
    remoteStream,
  } = usePeer();

  const [myStream, setMyStream] = useState(null);
  const [remoteEmailId, setRemoteEmailId] = useState(null);

  const handleNewUserJoined = useCallback(
    async ({ emailId }) => {
      console.log("New user joined room ", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
      setRemoteEmailId(emailId);
    },
    [createOffer, socket]
  );

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      console.log("Incoming call from", from);
      const answer = await createAnswer(offer);
      socket.emit("call-accepted", { emailId: from, ans: answer });
      setRemoteEmailId(from);
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async ({ ans }) => {
      console.log("Call Got Accepted", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
    } catch (err) {
      console.error("Failed to get media stream", err);
    }
  }, []);

  const handleNegotiationNeeded = useCallback(async () => {
    console.log("🔁 Negotiation needed");
    if (peer.signalingState !== "stable") {
      console.warn("⏸ Skipping negotiation: not in stable state:", peer.signalingState);
      return;
    }

    try {
      const offer = await createOffer();
      socket.emit("call-user", { emailId: remoteEmailId, offer });
    } catch (err) {
      console.error("Negotiation error:", err);
    }
  }, [createOffer, peer.signalingState, remoteEmailId, socket]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  useEffect(() => {
    if (myStream) {
      sendStream(myStream);
    }
  }, [myStream, sendStream]);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleNewUserJoined, handleIncommingCall, handleCallAccepted]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiationNeeded);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
    };
  }, [peer, handleNegotiationNeeded]);

  return (
    <div className="room-page-container">
      <h1>Room Page</h1>
      <h4>Connected to: {remoteEmailId || "Waiting for user..."}</h4>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div>
          <h3>My Video</h3>
          <VideoPlayer
  stream={myStream}
  muted={true}
  onSendStream={sendStream}
  showSendButton={true}
/>

        </div>
        <div>
          <h3>Remote Video</h3>
          <VideoPlayer stream={remoteStream} muted={false} />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
