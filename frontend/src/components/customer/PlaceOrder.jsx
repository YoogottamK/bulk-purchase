import React, { Component } from "react";
import {
  Button,
  Container,
  Table,
  InputGroup,
  Form,
  FormControl,
  Dropdown,
  Row,
  Col,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faSearch,
  faShoppingCart,
  faClone,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

class PlaceOrder extends Component {
  constructor() {
    super();

    this.sorters = {
      price: (a, b) => a.price > b.price,
      quantity: (a, b) => a.quantity > b.quantity,
      rating: (a, b) => a.rating > b.rating,
    };

    this.state = {
      searchString: "",
      products: [],
      sorter: (a, b) => false,
      isOrdering: false,
      productId: -1,
      quantity: 1,
      errors: {},
    };

    this.updateSearch = this.updateSearch.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.readyOrder = this.readyOrder.bind(this);
    this.onChange = this.onChange.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  fetchOrders() {
    axios
      .get("/order")
      .then(data => {
        this.setState({ products: data.data });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchOrders();
  }

  updateSearch(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  updateSort(e) {
    this.setState({ sorter: this.sorters[e.target.name] });
  }

  readyOrder(e) {
    this.setState({ isOrdering: true, productId: e.target.name });
  }

  onChange(e) {
    this.setState({ quantity: e.target.value });
  }

  placeOrder(e) {
    e.preventDefault();

    const orderDetails = {
      productId: this.state.products[this.state.productId]._id,
      quantity: `${this.state.quantity}`,
    };

    axios
      .post("/order/new", orderDetails)
      .then(data => {
        alert("Order placed successfully");

        this.setState({
          isOrdering: false,
          productId: -1,
          quantity: 1,
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
        <InputGroup className="mb-3 bg-dark">
          <InputGroup.Prepend>
            <InputGroup.Text>
              <FontAwesomeIcon icon={faSearch} />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="search"
            className="form-input"
            id="searchString"
            onChange={this.updateSearch}
          />
        </InputGroup>
        <Dropdown>
          <Dropdown.Toggle variant="primary">Sort by</Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              as={Button}
              onClick={this.updateSort}
              name="quantity"
            >
              Quantity
            </Dropdown.Item>
            <Dropdown.Item as={Button} onClick={this.updateSort} name="price">
              Price
            </Dropdown.Item>
            <Dropdown.Item as={Button} onClick={this.updateSort} name="rating">
              Rating
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
              <th>Price</th>
              <th>Quantity Left</th>
              <th>Vendor</th>
              <th>Rating</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products
              .filter(product => product.name.includes(this.state.searchString))
              .sort(this.state.sorter)
              .map((product, index) => (
                <tr key={index}>
                  <td className="align-middle">{index}</td>
                  <td className="align-middle">
                    <img
                      src={product.image}
                      alt={`product ${product.name}`}
                      height="50"
                    />
                  </td>
                  <td className="align-middle">{product.name}</td>
                  <td className="align-middle">{product.price}</td>
                  <td className="align-middle">{product.quantity}</td>
                  <td className="align-middle">{product.vendorId.username}</td>
                  <td className="align-middle">{product.vendorId.rating}</td>
                  <td className="align-middle">
                    <Button
                      className="btn btn-primary"
                      name={index}
                      onClick={this.readyOrder}
                    >
                      ORDER
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>

        {this.state.isOrdering ? (
          <Form className="text-center mx-auto" onSubmit={this.placeOrder}>
            <Form.Group as={Row} controlId="name">
              <Form.Label column xs="2">
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              </Form.Label>
              <Col xs="10">
                <Form.Control
                  className="form-input"
                  type="text"
                  value={this.state.products[this.state.productId].name}
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
                  max={this.state.products[this.state.productId].quantity}
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
                  Place order
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

export default PlaceOrder;
