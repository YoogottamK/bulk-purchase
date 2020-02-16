import { ERROR } from "../actions/types";

const initialState = {};

export default (state = initialState, action) => {
  switch (action.type) {
    case ERROR:
      return action.payload;
    default:
      return state;
  }
};
