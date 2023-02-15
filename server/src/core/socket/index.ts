import { Server, Socket } from "socket.io";
import registerMessageHandler from "./messageHandler";

let io: Server;
const connectedUsers: {[userId: string]: Socket} = {}

const use = (server: Server) => {
  io = server;
  onConnect();
  onDisconnect();
};

const onConnect = () => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.id as string;
    const userName = socket.handshake.query.name as string;

    // If the user is already connected, disconnect the other socket
    if(connectedUsers[userId]) {
      console.log(`[${userId}] ${userName} connected again, disconnecting other socket...`);
      connectedUsers[userId].disconnect();
    } else {
      console.log(`[${userId}] ${userName} connected`);
    }
    connectedUsers[userId] = socket;

    registerMessageHandler(io, socket);
  });
}

const onDisconnect = () => {
  io.on('disconnect', (socket: Socket) => {
    console.log('A user disconnected', socket.handshake.query.id);
  });
}

export default {
  use
};