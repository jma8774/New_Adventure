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

  constructor (name: string, users: User[] = [], io: Server) {
    const listeners = ['message'];
    super(name, users, io, listeners);
    this.msgs = []
  }

  removeUser(user: User): Room {
    this.users = this.users.filter(u => u.getId() !== user.getId())
    user.leave();

    console.log(`[${user.getId()}] ${user.getName()} left [${this.name}]`)
    return this
  }

  addUser(user: User): Room {
    this.users.push(user)
    user.join(this)

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
    
    console.log(`[${user.getId()}] ${user.getName()} joined [${this.name}]`)
    console.log("Users:", this.users.map(u => u.getName()))
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
    this.io.to(this.name).emit(eventName, payload);
  }

}

export default Chatroom;