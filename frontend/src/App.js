import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Register from "./components/Register";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style/App.css";

function App() {
  return (
    <div>
      <Router>
        <Route exact path="/register" component={Register} />
      </Router>
    </div>
  );
}

export default App;
