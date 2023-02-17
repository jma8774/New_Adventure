import { Socket } from "socket.io";
import { Room } from "#classes/room";

interface Options {
  room?: Room;
}

class User {
  private id: string;
  private name: string;
  private socket: Socket;
  private room: Room | undefined;

  constructor(
    id:string, 
    name: string, 
    socket: Socket, 
    { room }: Options = {}
  ) {
    this.id = id;
    this.name = name;
    this.socket = socket;
    this.room = room;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getSocket() {
    return this.socket;
  }

  join(room: Room) {
    this.room = room;
    this.socket.join(room.getName());
  }

  leave() {
    if (this.room) {
      this.socket.leave(this.room.getName());
      this.room = undefined;
    }
  }
}

interface Users {
  [id: string]: User;
}

export default User;
export {
  Users
}