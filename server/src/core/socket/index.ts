import { Server, Socket } from "socket.io";
import SocketWrapper from "./wrapper";
// import registerMessageHandler from "./messageHandler";
import User from "#classes/user";
import { users, rooms } from "#core/store";
import { Room, Chatroom } from "#classes/room";

let io: Server;

const use = (server: Server) => {
  io = server;
  onConnect();
  onDisconnect();
};

const onConnect = () => {
  io.on('connection', (socket: Socket) => {
    const wSocket = SocketWrapper(socket);
    const userId = wSocket.getQuery().id as string;
    const userName = wSocket.getQuery().name as string;

    users[userId] 
      ? console.log(`[${userId}] ${users[userId].getName()} reconnected as ${userName}`)
      : console.log(`[${userId}] ${userName} connected`)
    const user = users[userId] = new User(userId, userName, socket)
    
    // Join a default room with everyone if the user didn't specify a joinRoom query param
    // if(!wSocket.getQuery().joinRoom) {
    //   socket.join('default');
    //   rooms.default.users.push(connectedUsers[userId]);
    //   rooms.default.msgs.push({
    //     id: uuidv4(),
    //     userId: 'System',
    //     name: 'System',
    //     msg: `${userName} joined the room`,
    //     timestamp: Date.now()
    //   })
    //   io.to('default').emit('users', Object.values(connectedUsers).map(ui => ui.name));
    //   io.to('default').emit('messages', rooms.default.msgs);
    // }

    socket.on('join', (roomName: string) => {
      // registerMessageHandler(io, socket, { room: rooms[users[userId].room] });
      const room = rooms[roomName] = rooms[roomName] || new Chatroom(roomName, [], io);
      room.addUser(user);
    })

    socket.on('leave', () => {
        
    })

    socket.on('disconnect', () => {
      console.log(`[${user.getId()}] ${user.getName()} disconnected`);
      delete users[user.getId()];
      // TODO: Handle leave logic for when user disconnects, make them leave the room
    })
  });
}

const onDisconnect = () => {
  io.on('disconnect', (socket: Socket) => {
    console.log('Server has disconnected');
  });
}

export default {
  use
};