import React, {useEffect, useState, useCallback} from 'react'
import { useNavigate } from 'react-router-dom';
import {useSocket} from "../providers/Socket"

const Home = () => {
  const { socket } = useSocket();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleRoomJoined = useCallback(({roomId})=>{
    navigate(`/room/${roomId}`)
  }, [navigate])

  useEffect(()=>{
    socket.on('joined-room', handleRoomJoined)
    return ()=>{
      socket.off('joined-room', handleRoomJoined)
    }
  }, [handleRoomJoined, socket])

  const handleJoinRoom = () => {
    socket.emit("join-room", {emailId: email, roomId})
  }

  return (
    <div className='homepage-container'>
        <div className='input-container'>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder='Enter Your Email here' />
            <input type="text" value={roomId} onChange={e=>setRoomId(e.target.value)} placeholder='Enter Room code' />
            <button onClick={handleJoinRoom}>Enter Room</button>
        </div>
    </div>
  )
}

export default Home