import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";

import store from "./store";
import setAuthToken from "./utils/setAuthToken";
import { setUser, userLogout } from "./actions/authActions";

// Special routes
import LoggedInRoute from "./components/LoggedInRoute";
import RestrictedRoute from "./components/RestrictedRoute";

// Components
import AppNavbar from "./components/Navbar";

import Landing from "./components/Landing";
import Register from "./components/Register";
import Login from "./components/Login";

import Home from "./components/Home";
import Profile from "./components/Profile";

import _404 from "./components/_404";

import NewOrder from "./components/NewOrder";
import MyOrder from "./components/MyOrder";

import ViewDispatchable from "./components/vendor/ViewDispatchable";
import ViewDispatched from "./components/vendor/ViewDispatched";

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
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
      <AppNavbar />
      <>
        <Router>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <LoggedInRoute exact path="/home" component={Home} />

            <LoggedInRoute exact path="/order/new" component={NewOrder} />
            <LoggedInRoute exact path="/order/my" component={MyOrder} />

            <RestrictedRoute
              exact
              path="/order/dispatchable"
              isVendorRoute
              component={ViewDispatchable}
            />

            <RestrictedRoute
              exact
              path="/order/dispatched"
              isVendorRoute
              component={ViewDispatched}
            />

            <LoggedInRoute path="/vendors/:id" component={Profile} />

            <Route component={_404} />
          </Switch>
        </Router>
      </>
    </Provider>
  );
}

export default App;
