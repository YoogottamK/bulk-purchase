import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { userLogout } from "../actions/authActions";

class Home extends Component {
  render() {
    const { user } = this.props.auth;

    return (
      <Container>
        <h1>Hello {user.username}</h1>
      </Container>
    );
  }
}

Home.propTypes = {
  userLogout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { userLogout })(Home);
