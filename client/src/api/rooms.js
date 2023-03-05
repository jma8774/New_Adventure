import axios from 'axios';

const getRooms = async () => {
  try {
    const response = await axios.get('/api/rooms');
    return response.data;
  } catch(e) {
    console.log(e);
  }
}

export { 
  getRooms
}