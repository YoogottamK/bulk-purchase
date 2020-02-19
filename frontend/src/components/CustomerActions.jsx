import React from "react";
import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomerActions = () => {
  const actions = [
    { name: "Search for products", link: "/order/new" },
    { name: "View orders", link: "/order/my" },
  ];

  return (
    <ListGroup className="justify-content-center">
      {actions.map((action, index) => (
        <ListGroup.Item className="bg-dark p-0 m-0" key={index}>
          <Link to={action.link} className="btn btn-primary w-100">
            {action.name}
          </Link>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CustomerActions;
