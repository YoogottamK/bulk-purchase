import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ViewProduct from "./ViewProduct";

class MyOrder extends Component {
  render() {
    {
      /* TODO: implement customer side view */
    }
    return <>{this.props.auth.user.isVendor ? <ViewProduct /> : <></>}</>;
  }
}

MyOrder.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MyOrder);
