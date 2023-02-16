import { Server, Socket } from "socket.io";
import SocketWrapper from "./wrapper";
import registerMessageHandler from "./messageHandler";
import registerDisconnectHandler from "./disconnectHandler";
import { v4 as uuidv4 } from 'uuid';

let io: Server;
const connectedUsers: ConnectedUsers = {}
const rooms: Rooms = {
  default: {
    name: 'default',
    users: [],
    msgs: []
  }
}

const use = (server: Server) => {
  io = server;
  onConnect();
  onDisconnect();
};

const onConnect = () => {
  io.on('connection', (socket: Socket) => {
    const wSocket = SocketWrapper(socket);
    const newUserId = wSocket.getQuery().id as string;
    const newUserName = wSocket.getQuery().name as string;

    // If the user is already connected, disconnect the other socket
    if(connectedUsers[newUserId]) {
      console.log(`[${newUserId}] ${newUserName} connected again, disconnecting other socket...`);
      connectedUsers[newUserId].socket.disconnect();
    } else {
      console.log(`[${newUserId}] ${newUserName} connected`);
    }
    connectedUsers[newUserId] = createUserInfo(socket);
    
    // Join a default room with everyone if the user didn't specify a joinRoom query param
    if(!wSocket.getQuery().joinRoom) {
      socket.join('default');
      rooms.default.users.push(connectedUsers[newUserId]);
      rooms.default.msgs.push({
        id: uuidv4(),
        userId: 'System',
        name: 'System',
        msg: `${newUserName} joined the room`,
        timestamp: Date.now()
      })
      io.to('default').emit('users', Object.values(connectedUsers).map(ui => ui.name));
      io.to('default').emit('messages', rooms.default.msgs);
    }

    // Create a Room class to control flow of users in and out and the chat msgs is the best way to do it
    registerDisconnectHandler(io, socket, { rooms, connectedUsers });
    registerMessageHandler(io, socket, { room: rooms[connectedUsers[newUserId].room] });
  });
}

const onDisconnect = () => {
  io.on('disconnect', (socket: Socket) => {
    console.log('Server has disconnected');
  });
}

const createUserInfo = (socket: Socket): UserInfo => {
  return {
    id: socket.handshake.query.id as string,
    name: socket.handshake.query.name as string,
    room: socket.handshake.query.joinRoom as string || 'default',
    socket,
  }
}

export default {
  use
};