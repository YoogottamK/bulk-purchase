import React, { Component } from "react";
import { Button, Container, Table, Form, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faShoppingCart,
  faClone,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import StarRatings from "react-star-ratings";

import { PRODUCT_STATE, PRODUCT_STATE_REV } from "../../utils/constants";

class ViewOrder extends Component {
  constructor() {
    super();

    this.state = {
      orders: [],
      isPerformingAction: false,
      orderId: -1,
      quantity: 1,
      review: "",
      errors: {},
    };

    this.editOrder = this.editOrder.bind(this);
    this.onChange = this.onChange.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.reviewOrder = this.reviewOrder.bind(this);
    this.manageRating = this.manageRating.bind(this);
    this.postReview = this.postReview.bind(this);
  }

  fetchOrders() {
    axios
      .get("/order/my")
      .then(data => {
        this.setState({ orders: data.data }, () =>
          console.log(this.state.orders)
        );
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchOrders();
  }

  editOrder(e) {
    this.setState({
      isPerformingAction: true,
      orderId: e.target.name,
      quantity: this.state.orders[e.target.name].quantity,
    });
  }

  reviewOrder(e) {
    this.setState({
      isPerformingAction: true,
      orderId: e.target.name,
      quantity: this.state.orders[e.target.name].quantity,
    });
  }

  onChange(e) {
    this.setState({ [e.target.id]: e.target.value });
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
          isPerformingAction: false,
          orderId: -1,
        });

        this.fetchOrders();
      })
      .catch(err => console.log(err));
  }

  postReview(e) {
    e.preventDefault();

    console.log(this.state.review);

    const reviewDetails = {
      orderId: this.state.orders[this.state.orderId]._id,
      review: this.state.review,
    };

    axios
      .post("/order/review", reviewDetails)
      .then(data => console.log(data))
      .catch(err => console.log(err));

    this.fetchOrders();
  }

  manageRating(newRating, name) {
    const orderIdx = parseInt(name),
      orderId = this.state.orders[orderIdx]._id;

    const ratingData = {
      orderId: orderId,
      givenRating: `${newRating}`,
    };

    axios
      .post("/order/rate", ratingData)
      .then(data => console.log(data))
      .catch(err => console.log(err.response.data));

    this.fetchOrders();
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
              <th>Action</th>
              <th>Rate vendor</th>
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
                <td className="align-middle">
                  {PRODUCT_STATE_REV[order.productId.state]}
                </td>
                <td className="align-middle">{order.quantity}</td>
                <td className="align-middle">{order.productId.quantity}</td>
                <td className="align-middle">
                  {order.productId.state <= PRODUCT_STATE.PLACED ? (
                    <Button
                      className="btn btn-primary"
                      name={index}
                      onClick={this.editOrder}
                    >
                      EDIT
                    </Button>
                  ) : order.productId.state === PRODUCT_STATE.DISPATCHED ? (
                    order.hasReviewedProduct ? (
                      <>Already reviewed</>
                    ) : (
                      <Button
                        className="btn btn-primary"
                        name={index}
                        onClick={this.reviewOrder}
                      >
                        REVIEW
                      </Button>
                    )
                  ) : (
                    <></>
                  )}
                </td>
                <td className="align-middle">
                  {order.productId.state >= PRODUCT_STATE.PLACED &&
                  order.productId.state !== PRODUCT_STATE.CANCELLED ? (
                    order.hasRatedVendor ? (
                      <>Already rated</>
                    ) : (
                      <StarRatings
                        starDimension="20px"
                        starSpacing="1px"
                        name={`${index}`}
                        starRatedColor="rgb(255, 211, 0)"
                        starHoverColor="rgb(255, 211, 0)"
                        changeRating={this.manageRating}
                      />
                    )
                  ) : (
                    <>Cannot rate</>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {this.state.isPerformingAction ? (
          this.state.orders[this.state.orderId].productId.state <=
          PRODUCT_STATE.PLACED ? (
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
                      ) +
                      parseInt(this.state.orders[this.state.orderId].quantity)
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
            <Form className="text-center mx-auto" onSubmit={this.postReview}>
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
              <Form.Group as={Row} controlId="review">
                <Form.Label column xs="2">
                  <FontAwesomeIcon icon={faPen} size="lg" />
                </Form.Label>
                <Col xs="10">
                  <Form.Control
                    className="form-input"
                    type="text"
                    placeholder="review"
                    onChange={this.onChange}
                    value={this.state.review}
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
                    Review Order
                  </Button>
                </Col>
              </Row>
            </Form>
          )
        ) : (
          <></>
        )}
      </Container>
    );
  }
}

export default ViewOrder;
