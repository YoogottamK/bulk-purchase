import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ViewProduct from "./ViewProduct";
import ViewOrder from "./ViewOrder";

class MyOrder extends Component {
  render() {
    return (
      <>{this.props.auth.user.isVendor ? <ViewProduct /> : <ViewOrder />}</>
    );
  }
}

MyOrder.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MyOrder);
