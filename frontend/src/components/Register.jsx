import React, { Component } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faUser,
  faEnvelope,
  faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../style/Register.css";

class Register extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      email: "",
      password: "",
      password2: "",
      isVendor: false,
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState(
      {
        [e.target.id]:
          e.target.type === "checkbox" ? e.target.checked : e.target.value,
      },
      () => console.log(this.state)
    );
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
      isVendor: this.state.isVendor,
    };

    console.log(newUser);
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
          <h1 className="form-header">Create account</h1>
          <Container>
            <Form className="text-center mx-auto" onSubmit={this.onSubmit}>
              <Form.Group as={Row} controlId="username">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faUser} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="text"
                    placeholder="username"
                    onChange={this.onChange}
                    value={this.state.username}
                    error={errors.username}
                    required
                  />
                </Col>
              </Form.Group>
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
                    placeholder="8 <= len(passwd) <= 32"
                    onChange={this.onChange}
                    value={this.state.password}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="password2">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faKey} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="password"
                    placeholder="Please enter the passwd again"
                    onChange={this.onChange}
                    value={this.state.password2}
                    required
                  />
                </Col>
              </Form.Group>
              <Form.Group
                as={Row}
                controlId="isVendor"
                className="align-items-center"
              >
                <Form.Label column xs="2">
                  Vendor?
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="checkbox"
                    onChange={this.onChange}
                    checked={this.state.isVendor}
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
                    Register
                  </Button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col>
                  <h4>OR</h4>
                  Already have an account?
                </Col>
              </Row>
              <Row>
                <Col>
                  <Link
                    to="/login"
                    className="form-submit btn btn-primary w-50"
                  >
                    Login
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

export default Register;
