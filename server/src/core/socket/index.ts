import { Server, Socket } from "socket.io";
import SocketWrapper from "./wrapper";
import User from "#classes/user";
import { users, rooms } from "#core/store";
import { Room, Chatroom } from "#classes/room";
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
    console.log(socket.id)

    users[userId] 
      ? console.log(`[${userId}] ${users[userId].getName()} reconnected as ${userName}`)
      : console.log(`[${userId}] ${userName} connected`)
    const user = users[userId] = new User(userId, userName, socket)
    
    socket.onAny((event, ...args) => {
      logBlue(`[Debug] Event: ${event} ${args}`)
    })
    
    socket.on('join', (roomData: { id: string, name: string }) => {
      const { id, name } = roomData;
      // Create a new room with the name if it doesn't exist, otherwise name is not used
      const room = rooms[id] = rooms[id] || new Chatroom(id, name, [], io);
      room.addUser(user);
      // TODO: Emit to user that they have joined the room and give them the listener events prefixed by some id
      socket.emit("join", {
        id,
        name: rooms[id].getName(),
      })
    })

    socket.on('leave', () => {
      const room = user.getRoom()
      room?.removeUser(user);
      deleteRoomIfEmpty(room)
    })

    socket.on('disconnect', () => {
      console.log(`[${user.getId()}] ${user.getName()} disconnected`);
      const room = user.getRoom()
      room?.removeUser(user);
      deleteRoomIfEmpty(room)
      delete users[user.getId()];
    })
  });
}

const onDisconnect = () => {
  io.on('disconnect', (socket: Socket) => {
    console.log('Server has disconnected');
  });
}

const deleteRoomIfEmpty = (room?: Room) => {
  if(!room) return;

  if(room && room.getUsers().length === 0) {
    console.log(`Room [${room.getName()} - ${room.getId()}] closed`)
    delete rooms[room.getId()]
  }
}

export default {
  use
};