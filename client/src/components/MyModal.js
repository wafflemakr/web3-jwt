import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function MyModal(props) {
  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          placeholder="Please enter your email"
          onChange={props.setEmail}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.close}>
          Close
        </Button>
        <Button variant="primary" onClick={props.done}>
          {props.title}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
