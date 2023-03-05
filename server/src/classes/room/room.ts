import User from '#classes/user';
import { logBlue } from '#src/util/colorConsole';
import { Server } from 'socket.io';

abstract class Room {
  protected readonly id: string;
  protected readonly name: string;
  protected users: User[];
  protected readonly listeners: string[];
  protected readonly io: Server;

  constructor(
    id: string,
    name: string, 
    users: User[] = [], 
    io: Server, 
    listeners: string[] = []
  ) {
    console.log(`Room [${name}] - ${id} created`)
    this.id = id;
    this.name = name;
    this.users = users;
    this.io = io;
    this.listeners = listeners;
  }

  // TODO: write some method to generate prefixed listeners maybe: `${id}-${listener}`
  
  removeUser(user: User): Room {
    this.users = this.users.filter(u => u.getId() !== user.getId())

    // Only call the user leave if the user is in the room (ensures we don't get stuck in infinite loop) 
    if(user.getRoom()?.getId() === this.id) {
      user.leave();
      // Remove all listeners that were added when they joined this room
      this.listeners.forEach(listener => {
        user.getSocket().removeAllListeners(listener)
      });
    }

    this.io.to(this.id).emit("users", this.users.map(u => u.getName()));
    console.log(`[${user.getId()}] ${user.getName()} left [${this.name} - ${this.id}]`)
    logBlue(`[Debug] [${this.name} - ${this.id}] Users: [${this.users.map(u => u.getName())}]`)
    
    // Room specific logic
    this.afterRemoveUser(user)
    return this
  }

  addUser(user: User): Room {
    this.users.push(user)

    // Only call the user join if the user is not in the room (ensures we don't get stuck in infinite loop)
    if(user.getRoom()?.getId() !== this.id) {
      user.leave()
      user.join(this)
    }
    
    this.io.to(this.id).emit("users", this.users.map(u => u.getName()));
    console.log(`[${user.getId()}] ${user.getName()} joined [${this.name} - ${this.id}]`)
    logBlue(`[Debug] [${this.name} - ${this.id}] Users: [${this.users.map(u => u.getName())}]`)

    // Room specific logic
    this.afterAddUser(user)
    return this
  }

  protected abstract afterRemoveUser(user: User): Room;
  protected abstract afterAddUser(user: User): Room;
  abstract close(): Room;

  hasUser(user: User): boolean {
    return this.users.some(u => u.getId() === user.getId());
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.constructor.name;
  }

  getName() {
    return this.name;
  }

  getUsers() {
    return this.users;
  }
}

export default Room;