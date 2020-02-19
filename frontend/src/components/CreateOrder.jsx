import React, { Component } from "react";
import {
  Button,
  Container,
  Table,
  InputGroup,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

class CreateOrder extends Component {
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
    };

    this.updateSearch = this.updateSearch.bind(this);
    this.updateSort = this.updateSort.bind(this);
  }

  fetchProducts() {
    axios
      .get("/order")
      .then(data => {
        this.setState({ products: data.data });
      })
      .catch(err => console.log(err));
  }

  // eslint-disable-next-line
  componentWillMount() {
    this.fetchProducts();
  }

  updateSearch(e) {
    this.setState({ [e.target.id]: e.target.value });
  }

  updateSort(e) {
    this.setState({ sorter: this.sorters[e.target.name] });
  }

  render() {
    return (
      <Container>
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
            aria-describedby="basic-addon1"
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
              <th></th>
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
                    <Button className="btn btn-primary">ORDER</Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default CreateOrder;
