import { Server } from 'socket.io';
import Room from './room';
import User from '#classes/user';
import { v4 as uuidv4 } from 'uuid';

interface MessagePayload {
  name: string;
  msg: string;
}

class Chatroom extends Room {
  private msgs: Message[];

  constructor (id: string, name: string, users: User[] = [], io: Server) {
    const listeners = ['message'];
    super(id, name, users, io, listeners);
    this.msgs = []
  }

  afterRemoveUser(user: User): Room {
    // TODO: perform some room logic here for the chatroom
    return this
  }

  afterAddUser(user: User): Room {
    // When they join the room, they should load the messages
    this.emitToRoom('messages', this.msgs)
    
    user.getSocket().on('message', (payload: MessagePayload) => {
      this.msgs.push({
        id: uuidv4(),
        userId: uuidv4(),
        name: payload.name,
        msg: payload.msg,
        timestamp: new Date()
      });
      this.emitToRoom('messages', this.msgs)
    })
    return this
  }

  close(): Room {
    throw new Error('Method not implemented.');
    for (const user of this.users) {
      this.listeners.forEach(listener => {
        user.getSocket().removeAllListeners(listener)
      });
      user.leave();
    }
  }

  private emitToRoom(eventName: string, payload: any) {
    this.io.to(this.id).emit(eventName, payload);
  }

}

export default Chatroom;