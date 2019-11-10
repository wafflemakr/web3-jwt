import React from "react";
import { Navbar, Nav, Button } from "react-bootstrap";

export default function Header(props) {
  let renderAuth = (
    <>
      <Button
        className="mr-3"
        variant="outline-info"
        onClick={props.loginClicked}
      >
        Login
      </Button>
      <Button variant="outline-light" onClick={props.registerClicked}>
        Register
      </Button>
    </>
  );

  if (props.auth)
    renderAuth = (
      <Button variant="outline-info" onClick={props.logout}>
        Logout
      </Button>
    );

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">Web3 Auth</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Link1</Nav.Link>
        <Nav.Link href="#features">Link2</Nav.Link>
      </Nav>
      {renderAuth}
    </Navbar>
  );
}
