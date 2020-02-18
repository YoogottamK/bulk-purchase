import React, { Component } from "react";
import PropTypes from "prop-types";
import { Navbar, Nav } from "react-bootstrap";
import { connect } from "react-redux";
import { userLogout } from "../actions/authActions";

class AppNavbar extends Component {
  render() {
    const { user } = this.props.auth;

    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/home">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/home">Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

AppNavbar.propTypes = {
  userLogout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { userLogout })(AppNavbar);
