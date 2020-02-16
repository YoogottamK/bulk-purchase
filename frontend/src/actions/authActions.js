import axios from "axios";
import jwt_decode from "jwt-decode";

import setAuthToken from "../utils/setAuthToken";
import { SET_USER, ERROR, USER_LOADING } from "./types";

export const setUser = decoded => {
  return {
    type: SET_USER,
    payload: decoded,
  };
};

export const userRegister = (userData, history) => dispatch => {
  axios
    .post("/user/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: ERROR,
        payload: err.response.data,
      })
    );
};

export const userLogin = userData => dispatch => {
  axios
    .post("/user/login", userData)
    .then(res => {
      const { token } = res.data;
      localStorage.setItem("jwt", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setUser(decoded));
    })
    .catch(err => dispatch({ type: ERROR, payload: err.response.data }));
};

export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

export const userLogout = () => dispatch => {
  localStorage.removeItem("jwt");
  setAuthToken(false);
  dispatch(setUser({}));
};
