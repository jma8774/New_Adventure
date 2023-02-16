import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

interface Option {
  room: Room
}

export default (io: Server, socket: Socket, { room }: Option) => {
  socket.on('message', (msg: string) => {
    room.msgs.push({
      id: uuidv4(),
      userId: socket.handshake.query.id as string,
      name: socket.handshake.query.name as string,
      msg,
      timestamp: Date.now()
    })

    io.to(room.name).emit('messages', room.msgs)
  })
}