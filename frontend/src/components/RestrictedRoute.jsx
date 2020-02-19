import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const RestrictedRoute = ({
  component: Component,
  auth,
  isVendorRoute,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated ? (
        auth.user.isVendor === isVendorRoute ? (
          <Component {...props} />
        ) : (
          <Redirect to="/invalid" />
        )
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

RestrictedRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  auth: PropTypes.object.isRequired,
  isVendorRoute: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(RestrictedRoute);
