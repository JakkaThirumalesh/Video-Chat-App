import { Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Home";
import { SocketProvider } from "./providers/Socket";
import { PeerProvider } from "./providers/Peer";
import RoomPage from "./pages/Room";

function App() {
  return (
    <>
      <div>
        <SocketProvider>
          <PeerProvider>
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="/room/:roomId" element={<RoomPage />} />
            </Routes>
          </PeerProvider>
        </SocketProvider>
      </div>
    </>
  );
}

export default App;
