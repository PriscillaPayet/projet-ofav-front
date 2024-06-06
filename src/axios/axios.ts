import axios from 'axios';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const headers = {
  Authorization: 'Bearer my-token',
};

const axiosInstance = axios.create({
  baseURL: 'http://gregchampenois-server.eddi.cloud/projet-o-fav-back/public/',
  timeout: 3600,
});

export default axiosInstance;
