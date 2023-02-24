import { Server, Socket } from "socket.io";
import SocketWrapper from "./wrapper";
import User from "#classes/user";
import { users, rooms } from "#core/store";
import { Chatroom } from "#classes/room";
import { v4 as uuidv4 } from 'uuid';
import { logCyan, logGreen, logRed, logBlue } from "#src/util/colorConsole";

let io: Server;
let sameRoomId: string = uuidv4();

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
    
    socket.onAny((event, ...args) => {
      logBlue(`[Debug] Event: ${event} ${args}`)
    })
    
    socket.on('join', (roomData: { id: string, name: string }) => {
      const { id, name } = roomData;
      const room = rooms[sameRoomId] = rooms[sameRoomId] || new Chatroom(sameRoomId, name, [], io);
      room.addUser(user);
      // Emit to user that they have joined the room and give them the listener events prefixed by some id
      socket.emit("join", roomData)
    })

    socket.on('leave', () => {
      user.getRoom()?.removeUser(user);
      // Emit to user that they have left the room
      socket.emit("leave")
    })

    socket.on('disconnect', () => {
      console.log(`[${user.getId()}] ${user.getName()} disconnected`);
      user.leave();
      delete users[user.getId()];
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