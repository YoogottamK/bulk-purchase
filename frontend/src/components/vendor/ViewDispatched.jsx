import React, { Component } from "react";
import { Container, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";

class ViewDispatched extends Component {
  constructor() {
    super();

    this.state = {
      products: [],
    };
  }

  fetchDispatched() {
    axios
      .get("/product/dispatched")
      .then(data => {
        this.setState({ products: data.data });
      })
      .catch(err => console.log(err));
  }

  // eslint-disable-next-line
  componentWillMount() {
    this.fetchDispatched();
  }

  render() {
    // TODO: review, rating, etc
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
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    );
  }
}

export default ViewDispatched;
