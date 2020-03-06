import axios from 'axios';
let axiosInstance = axios.create({
  baseURL: " http://192.168.0.108/user"
  /* other custom settings */
});
export default axiosInstance;

