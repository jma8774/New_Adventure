import User from '#classes/user';
import { Server } from 'socket.io';

abstract class Room {
  protected readonly name: string;
  protected users: User[];
  protected readonly listeners: string[];
  protected readonly io: Server;

  constructor(
    name: string, 
    users: User[] = [], 
    io: Server, 
    listeners: string[] = []
  ) {
    console.log(`Room [${name}] created`)
    this.name = name;
    this.users = users;
    this.io = io;
    this.listeners = listeners;
  }

  abstract removeUser(user: User): Room;

  abstract addUser(user: User): Room;

  abstract close(): Room;

  getName() {
    return this.name;
  }

  getUsers() {
    return this.users;
  }
}

export default Room;