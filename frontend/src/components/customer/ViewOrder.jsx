import React, { Component } from "react";
import { Button, Container, Table, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faShoppingCart,
  faClone,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

class ViewOrder extends Component {
  constructor() {
    super();

    this.state = {
      orders: [],
      isOrdering: false,
      orderId: -1,
      quantity: 1,
      errors: {},
    };

    this.editOrder = this.editOrder.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
  }

  fetchOrders() {
    axios
      .get("/order/my")
      .then(data => {
        this.setState({ orders: data.data });
      })
      .catch(err => console.log(err));
  }

  // eslint-disable-next-line
  componentWillMount() {
    this.fetchOrders();
  }

  editOrder(e) {
    this.setState({
      isOrdering: true,
      orderId: e.target.name,
      quantity: this.state.orders[e.target.name].quantity,
    });
  }

  onChange(e) {
    this.setState({ quantity: e.target.value });
  }

  updateOrder(e) {
    e.preventDefault();

    const orderDetails = {
      orderId: this.state.orders[this.state.orderId]._id,
      quantity: `${this.state.quantity}`,
    };

    axios
      .post("/order/update", orderDetails)
      .then(data => {
        alert("Order updated successfully");

        this.setState({
          isOrdering: false,
          orderId: -1,
        });

        this.fetchOrders();
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <Container className="generic-container">
        <div className="back py-3">
          <Link to="/home">
            <FontAwesomeIcon icon={faChevronLeft} /> BACK
          </Link>
        </div>

        <Table
          striped
          bordered
          hover
          responsive
          variant="dark"
          className="text-center"
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Name</th>
              <th>Status</th>
              <th>Quantity ordered</th>
              <th>Quantity Left</th>
              <th>Rating</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.orders.map((order, index) => (
              <tr key={index}>
                <td className="align-middle">{index}</td>
                <td className="align-middle">
                  <img
                    src={order.productId.image}
                    alt={`order ${order.productId.name}`}
                    height="50"
                  />
                </td>
                <td className="align-middle">{order.productId.name}</td>
                <td className="align-middle">{order.productId.state}</td>
                <td className="align-middle">{order.quantity}</td>
                <td className="align-middle">{order.productId.quantity}</td>
                <td className="align-middle">{order.rating}</td>
                <td className="align-middle">
                  {order.productId.state <= 1 ? (
                    <Button
                      className="btn btn-primary"
                      name={index}
                      onClick={this.editOrder}
                    >
                      EDIT
                    </Button>
                  ) : (
                    <></>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {this.state.isOrdering ? (
          <Form className="text-center mx-auto" onSubmit={this.updateOrder}>
            <Form.Group as={Row} controlId="name">
              <Form.Label column xs="2">
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              </Form.Label>
              <Col xs="10">
                <Form.Control
                  className="form-input"
                  type="text"
                  value={this.state.orders[this.state.orderId].productId.name}
                  disabled
                />
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
                  error={this.state.errors.quantity}
                  min={1}
                  max={
                    parseInt(
                      this.state.orders[this.state.orderId].productId.quantity
                    ) + parseInt(this.state.orders[this.state.orderId].quantity)
                  }
                  required
                />
                <span className="text-danger text-right w-100 d-block">
                  {this.state.errors.quantity}
                </span>
              </Col>
            </Form.Group>
            <Row>
              <Col>
                <Button
                  variant="primary"
                  type="submit"
                  className="form-submit w-50"
                >
                  Update order
                </Button>
              </Col>
            </Row>
          </Form>
        ) : (
          <></>
        )}
      </Container>
    );
  }
}

export default ViewOrder;
