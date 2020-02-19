import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import CreateProduct from "./CreateProduct";
import CreateOrder from "./CreateOrder";

class NewProduct extends Component {
  render() {
    return (
      <>{this.props.auth.user.isVendor ? <CreateProduct /> : <CreateOrder />}</>
    );
  }
}

NewProduct.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(NewProduct);
