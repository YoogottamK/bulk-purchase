import React, { Component } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faEnvelope,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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
    this.setState(
      {
        [e.target.id]: e.target.value,
      },
      () => console.log(this.state)
    );
  }

  onSubmit(e) {
    e.preventDefault();

    const loginDetails = {
      email: this.state.email,
      password: this.state.password,
    };

    console.log(loginDetails);
  }

  render() {
    const { errors } = this.state;

    return (
      <Container>
        <div className="form-container text-center">
          <div className="back">
            <Link to="/">
              <FontAwesomeIcon icon={faChevronLeft} /> BACK TO HOME
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
                </Col>
              </Form.Group>
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

export default Login;
