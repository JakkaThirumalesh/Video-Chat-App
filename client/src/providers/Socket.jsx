import React, { useMemo } from 'react';
import {io} from "socket.io-client"

const SocketContext = React.createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return React.useContext(SocketContext)
}

export const SocketProvider = (props) => {
    const socket = useMemo(()=> io('http://localhost:8001'), [])
  return (
    <>
    <SocketContext value={{socket}}>
        {props.children}
    </SocketContext>
    </>
  )
}
