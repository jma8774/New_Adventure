import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

export default (io: Server, socket: Socket) => {
  socket.on('message', (msg: string) => {
    io.sockets.emit('message', {
      id: uuidv4(),
      userId: socket.handshake.query.id,
      name: socket.handshake.query.name,
      msg,
      timestamp: Date.now()
    })
  })
}