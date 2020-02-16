import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { setUser, userLogout } from "./actions/authActions";

import Register from "./components/Register";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Home from "./components/Home";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style/App.css";

if (localStorage.jwt) {
  const token = localStorage.jwt;
  setAuthToken(token);

  const decoded = jwt_decode(token);
  store.dispatch(setUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(userLogout());
    window.location.href = "./login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
