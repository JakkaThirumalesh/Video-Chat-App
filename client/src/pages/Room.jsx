import { useCallback, useEffect } from "react";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";
import { useState } from "react";
import ReactPlayer from "react-player";

const RoomPage = () => {
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAns } = usePeer();

  const [myStream, setMyStream] = useState(null);

  const handleNewUserJoined = useCallback(
    async (data) => {
      const { emailId } = data;
      console.log("New user joined room ", emailId);
      const offer = await createOffer();
      socket.emit("call-user", { emailId, offer });
    },
    [createOffer, socket]
  );

  const handleIncommingCall = useCallback(async (data) => {
    const { from, offer } = data;
    console.log("Incomming call from", from, offer);
    const ans = await createAnswer(offer);
    socket.emit("call-accepted", { emailId: from, ans });
  }, []);

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("Call Got Accepted", ans);
      await setRemoteAns(ans);
    },
    [setRemoteAns]
  );

  const getUserMediaStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  }, []);

  useEffect(() => {
    socket.on("user-joined", handleNewUserJoined);
    socket.on("incomming-call", handleIncommingCall);
    socket.on("call-accepted", handleCallAccepted);
    return () => {
      socket.off("user-joined", handleNewUserJoined);
      socket.off("incomming-call", handleIncommingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [handleIncommingCall, handleNewUserJoined, handleCallAccepted, socket]);

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  return (
    <div className="room-page-container">
      <h1>Room page</h1>
      <ReactPlayer url={myStream} />
    </div>
  );
};

export default RoomPage;
