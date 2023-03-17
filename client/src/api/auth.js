import axios from 'axios';

const postAccess = async (id) => {
  try {
    const response = await axios.post('/api/auth/getAccess', { id });
    return response.data;
  } catch(e) {
    console.log(e)
  }
}

export {
  postAccess,
}