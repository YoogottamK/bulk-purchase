import React, { Component } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faShoppingCart,
  faMoneyBillAlt,
  faClone,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

import "../style/Form.css";

class CreateProduct extends Component {
  constructor() {
    super();

    this.state = {
      name: "",
      price: "",
      quantity: "",
      image: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    if (e.target.type === "file") {
      var self = this;
      var reader = new FileReader();
      var file = e.target.files[0];

      reader.onload = function(upload) {
        self.setState({
          image: upload.target.result,
        });
      };

      reader.readAsDataURL(file);
    } else {
      this.setState({
        [e.target.id]: e.target.value,
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const productDetails = {
      name: this.state.name,
      price: this.state.price,
      quantity: this.state.quantity,
      image: this.state.image,
    };

    axios
      .post("/product/new", productDetails)
      //eslint-disable-next-line no-unused-vars
      .then(res => {
        alert("Product successfully added");
        window.location.reload();
      })
      .catch(err => console.log(err));
  }

  render() {
    const { errors } = this.state;

    return (
      <Container>
        <div className="form-container text-center">
          <div className="back">
            <Link to="/home">
              <FontAwesomeIcon icon={faChevronLeft} /> BACK
            </Link>
          </div>
          <h1 className="form-header">Create a new product</h1>
          <Container>
            <Form className="text-center mx-auto" onSubmit={this.onSubmit}>
              <Form.Group as={Row} controlId="name">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="text"
                    placeholder="name"
                    onChange={this.onChange}
                    value={this.state.name}
                    error={errors.name}
                    required
                  />
                  <span className="text-danger text-right w-100 d-block">
                    {errors.name}
                  </span>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="price">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faMoneyBillAlt} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="number"
                    placeholder="price"
                    onChange={this.onChange}
                    value={this.state.price}
                    error={errors.price}
                    required
                  />
                  <span className="text-danger text-right w-100 d-block">
                    {errors.price}
                  </span>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="quantity">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faClone} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="number"
                    placeholder="quantity"
                    onChange={this.onChange}
                    value={this.state.quantity}
                    error={errors.quantity}
                    required
                  />
                  <span className="text-danger text-right w-100 d-block">
                    {errors.quantity}
                  </span>
                </Col>
              </Form.Group>
              <Form.Group as={Row} controlId="image">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faImage} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="file"
                    accept="image/*"
                    onChange={this.onChange}
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
                    Add product
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      </Container>
    );
  }
}

export default CreateProduct;
