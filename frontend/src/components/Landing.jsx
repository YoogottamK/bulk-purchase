import React from "react";
import { Container } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import "../style/Landing.css";

function Landing(auth) {
  return (
    <Container>
      {auth.isAuthenticated ? (
        <>
          <Link to="/register" className="btn btn-primary">
            Register
          </Link>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </>
      ) : (
        <Redirect to="/home" />
      )}
    </Container>
  );
}

Landing.protoTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Landing);
