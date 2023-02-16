import { Server, Socket } from 'socket.io';
import SocketWrapper from './wrapper';
import { v4 as uuidv4 } from 'uuid';

interface Options {
  rooms: Rooms,
  connectedUsers: ConnectedUsers
}

export default (io: Server, socket: Socket, { rooms, connectedUsers }: Options) => {
  socket.on('disconnect', () => {
    const wSocket = SocketWrapper(socket);
    const id = wSocket.getQuery().id as string;
    const name = wSocket.getQuery().name as string;
    console.log(`[${id}] ${name} disconnected`);
    rooms[connectedUsers[id].room].msgs.push({
      id: uuidv4(),
      userId: 'System',
      name: 'System',
      msg: `${name} left the room`,
      timestamp: Date.now()
    })
    io.to(connectedUsers[id].room).emit('messages', rooms[connectedUsers[id].room].msgs);
    delete connectedUsers[id];
  })
}