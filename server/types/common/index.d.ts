interface UserInfo {
  id: string,
  name: string,
  room: string,
  socket: Socket,
}

interface ConnectedUsers {
  [userId: string]: UserInfo
}

interface Rooms {
  [roomName: string]: Room
}

interface Room {
  name: string,
  users: UserInfo[],
  msgs: Message[]
}

interface Message {
  id: string,
  userId: string,
  name: string,
  msg: string,
  timestamp: number
}

