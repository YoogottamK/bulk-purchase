import React, { Component } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faEnvelope,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { userLogin } from "../actions/authActions";

import "../style/Register.css";

class Login extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const loginDetails = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.userLogin(loginDetails);
  }

  // eslint-disable-next-line
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/home");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/home");
    }
  }

  render() {
    const { errors } = this.state;

    return (
      <Container>
        <div className="form-container text-center">
          <div className="back">
            <Link to="/">
              <FontAwesomeIcon icon={faChevronLeft} /> BACK
            </Link>
          </div>
          <h1 className="form-header">Login to your account</h1>
          <Container>
            <Form className="text-center mx-auto" onSubmit={this.onSubmit}>
              <Form.Group as={Row} controlId="email">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faEnvelope} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="email"
                    placeholder="email"
                    onChange={this.onChange}
                    value={this.state.email}
                    error={errors.email}
                    required
                  />
                  <span className="text-danger text-right w-100 d-block">
                    {errors.email}
                  </span>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="password">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faKey} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="password"
                    placeholder="password"
                    onChange={this.onChange}
                    value={this.state.password}
                    required
                  />
                  <span className="text-danger text-right w-100 d-block">
                    {errors.password}
                  </span>
                </Col>
              </Form.Group>
              <span className="text-danger text-right w-100 d-block">
                {errors.accountNotFound}
              </span>
              <Row>
                <Col>
                  <Button
                    variant="primary"
                    type="submit"
                    className="form-submit w-50"
                  >
                    Login
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <h4>OR</h4>
                  Don&apos;t have an account?
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link
                    to="/register"
                    className="form-submit btn btn-primary w-50"
                  >
                    Register
                  </Link>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      </Container>
    );
  }
}

Login.propTypes = {
  userLogin: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { userLogin })(Login);
