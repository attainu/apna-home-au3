import axios from 'axios';
let axiosInstance = axios.create({
  baseURL: " http://192.168.0.108/user" //change this to your own base url
  /* other custom settings */
});
export default axiosInstance;

