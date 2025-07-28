import React, { useCallback, useEffect } from 'react'
import {useSocket} from "../providers/Socket"
import {usePeer} from "../providers/Peer"

const RoomPage = () => {
    const {socket} = useSocket();
    const {peer, createOffer} = usePeer();

    const handleNewUserJoined = useCallback(async (data) => {
        const {emailId} = data;
        console.log("New user joined room ",emailId)
        const offer = await createOffer();
        socket.emit("call-user", {emailId, offer});
    }, [createOffer, socket])

    const handleIncommingCall = useCallback((data)=>{
        const {from, offer} = data;
        console.log("Incomming call from", from, offer)
    }, [])

    useEffect(()=>{
        socket.on("user-joined", handleNewUserJoined)
        socket.on('incomming-call', handleIncommingCall)
        return ()=>{
            socket.off('user-joined', handleNewUserJoined)
            socket.off('incomming-call', handleIncommingCall)
        }
    },[handleIncommingCall, handleNewUserJoined, socket])



  return (
    <div className='room-page-container'>
        <h1>Room page</h1>
    </div>
  )
}

export default RoomPage