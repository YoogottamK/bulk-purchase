import React, { Component } from "react";
import PropTypes from "prop-types";
import { Navbar, Nav, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { userLogout } from "../actions/authActions";

const LoggedInLinks = props => (
  <>
    <Nav.Link href="/home">Home</Nav.Link>
    <Button onClick={props.logout}>Logout</Button>
  </>
);

const LoggedOutLinks = () => (
  <>
    <Nav.Link href="/register">Register</Nav.Link>
    <Nav.Link href="/login">Login</Nav.Link>
  </>
);

class AppNavbar extends Component {
  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/home">BulkPurchase</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {isAuthenticated ? (
              <LoggedInLinks logout={this.props.userLogout} />
            ) : (
              <LoggedOutLinks />
            )}
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

LoggedInLinks.propTypes = {
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { userLogout })(AppNavbar);
