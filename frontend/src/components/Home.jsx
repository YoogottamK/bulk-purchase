import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { userLogout } from "../actions/authActions";

// TODO: refactor this
import VendorActions from "./vendor/VendorActions";
import CustomerActions from "./customer/CustomerActions";

class Home extends Component {
  render() {
    const { user } = this.props.auth;

    return (
      <Container>
        <h1>Welcome, {user.username}</h1>
        <div className="pb-5">Here is a list of actions you can perform:</div>
        {user.isVendor ? <VendorActions /> : <CustomerActions />}
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
