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

  getRoom() {
    return this.room;
  }

  getEvents() {
    return this.socket.eventNames();
  }

  join(room: Room) {
    this.room = room;
    this.socket.join(room.getId());
    // Only call room.addUser if the user is not already in the room (ensures we don't get stuck in infinite loop)
    if(!room.hasUser(this))
      room.addUser(this);
  }

  leave() {
    if (this.room) {
      this.socket.leave(this.room.getId());
      // Only call room.removeUser if the user is in the room (ensures we don't get stuck in infinite loop)
      if(this.room.hasUser(this))
        this.room.removeUser(this);
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