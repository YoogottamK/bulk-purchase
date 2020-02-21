import React, { Component } from "react";
import { Container } from "react-bootstrap";
import axios from "axios";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.fetch = this.fetch.bind(this);
    // eslint-disable-next-line
    this.id = this.props.match.params.id;
    console.log(this.id);
  }

  fetch() {
    axios
      .post("/user/profile", { id: this.id })
      .then(data => console.log(data));
  }

  componentDidMount() {
    this.fetch();
  }

  render() {
    console.log(this.id);

    return (
      <Container>
        <p>Hello</p>
      </Container>
    );
  }
}

export default Profile;
