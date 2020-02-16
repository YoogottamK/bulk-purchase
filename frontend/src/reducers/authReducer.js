import { SET_USER, USER_LOADING } from "../actions/types";

// eslint-disable-next-line
const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      console.log("Setting user:", action.payload);
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
