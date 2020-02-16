import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";

import Register from "./components/Register";
import Login from "./components/Login";
import Landing from "./components/Landing";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style/App.css";

function App() {
  return (
    <Provider store={store}>
      <div>
        <Router>
          <Route exact path="/" component={Landing} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Router>
      </div>
    </Provider>
  );
}

export default App;
