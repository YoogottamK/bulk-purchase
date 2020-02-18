import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import "../style/Landing.css";

function Landing() {
  return (
    <Container>
      <Link to="/register" className="btn btn-primary">
        Register
      </Link>
      <Link to="/login" className="btn btn-primary">
        Login
      </Link>
    </Container>
  );
}

export default Landing;
