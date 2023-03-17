import { Users } from "#classes/user";
import { v4 as uuidv4 } from 'uuid';

interface IdSessions {
  [id: string]: Session;
}

interface Session {
  token: string;
  expires: Date;
}

const sessions: IdSessions  = {};

const get = (id: string) => {
  return sessions[id];
}

const has = (id: string) => {
  return sessions[id] !== undefined;
}

const add = (id: string) => {
  const token = uuidv4();

  const expires = new Date();
  expires.setMinutes(expires.getMinutes() + 180);

  sessions[id] = { token, expires };
  return token;
}

// Executed periodically to remove expired sessions of offline users
const cleanup = (users: Users) => {
  let deleted = 0; 
  const now = new Date();
  for (const id in sessions) {
    if (sessions[id].expires < now && !users[id]) {
      delete sessions[id];
      deleted++;
    }
  }
  console.log(`[Cleanup] Removed ${deleted} expired sessions.`)
}

export default {
  get,
  has,
  add,
  cleanup
}