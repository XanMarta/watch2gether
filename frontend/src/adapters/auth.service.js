import axios from 'axios';
import { getLoginInfo } from "../redux/loginInfo";

//API url. Need to change later
const API_URL = "http://localhost:3000/api/users/"
export const login = (username, password) => (dispatch) => {
  return axios.post(API_URL + "login", {
    username, password,
  })
    .then((res) => {
      if (res.status !== 400) {
        console.log(res.data)
        dispatch(getLoginInfo(res.data));
        return Promise.resolve();
      }
    })
    .catch((err) => {
      console.log(err.message);
      return Promise.reject();
    })
}

// const register = (username, email, password) => {

// }
