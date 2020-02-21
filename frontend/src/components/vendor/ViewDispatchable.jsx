import React, { Component } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

class ViewDispatchable extends Component {
  constructor() {
    super();

    this.state = {
      products: [],
    };
  }

  fetchDispatchable() {
    axios
      .get("/product/dispatchable")
      .then(data => {
        this.setState({ products: data.data });
      })
      .catch(err => console.log(err));
  }

  dispatchProduct(productId) {
    axios
      .post("/product/dispatch", { productId: productId })
      .then(data => {})
      .catch(err => console.log(err));

    this.fetchDispatchable();
  }

  componentDidMount() {
    this.fetchDispatchable();
  }

  render() {
    return (
      <Container>
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
              <th>Price</th>
              <th>Quantity Left</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => (
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
                <td className="align-middle">
                  <Button
                    className="btn btn-primary"
                    onClick={() => this.dispatchProduct(product._id)}
                  >
                    DISPATCH
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default ViewDispatchable;
