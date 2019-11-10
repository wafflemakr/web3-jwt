import React, { Component } from "react";
import { Container, Form } from "react-bootstrap";
import axios from "axios";
import jwt from "jsonwebtoken";

import Header from "./components/Header";
import Modal from "./components/MyModal";

const Web3 = window.Web3;

class App extends Component {
  state = {
    auth: false,
    account: null,
    showRegisterModal: false,
    showLoginModal: false,
    email: null,
    dbEmail: null
  };

  componentDidMount() {
    this.setup();
    this.checkAuth();
  }

  checkAuth() {
    const token = localStorage.getItem("token");
    const decoded = jwt.decode(token);

    if (token) this.setState({ auth: true, email: decoded.email });
    else this.setState({ auth: false, email: null });
  }

  setup = async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      console.log("Using Ethereum enabled browser");
      window.web3 = new Web3(window.ethereum);

      try {
        await window.ethereum.enable();

        //If accounts change
        window.ethereum.on("accountsChanged", accounts => {
          if (accounts.length > 0) {
            this.setState({
              account: accounts[0]
            });
          } else {
            this.setState({ account: null });
          }
        });
        this.setState({
          account: window.ethereum.selectedAddress
        });
      } catch (error) {
        console.error("You must approve this dApp to interact with it");
      }
    }

    // Legacy dapp browsers...
    else if (window.web3) {
      console.log("Using web3 enabled browser");
      window.web3 = new Web3(window.web3.currentProvider);

      let accounts = await window.web3.eth.getAccounts();

      if (accounts.length > 0)
        this.setState({
          account: accounts[0]
        });

      setInterval(async () => {
        let _accounts = await window.web3.eth.getAccounts();
        if (_accounts.length > 0) {
          if (_accounts[0] !== this.state.currentAccount) {
            this.setState({ account: _accounts[0] });
          }
        } else this.setState({ account: null });
      }, 500);
    }

    // Non-dapp browsers...
    else {
      console.log(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  register = async () => {
    this.setState({ showRegisterModal: false });

    if (!this.state.account || !this.state.email) return;

    try {
      let signature = await window.web3.eth.personal.sign(
        "Registering to Web3 Auth",
        this.state.account
      );

      let response = await axios.post("/api/users/register", {
        email: this.state.email,
        account: window.web3.utils.toChecksumAddress(this.state.account),
        signature
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        this.checkAuth();
      }
    } catch (e) {
      console.log(e);
    }
  };

  logout = () => {
    localStorage.removeItem("token");
    this.checkAuth();
  };

  login = async () => {
    this.setState({ showLoginModal: false });

    if (!this.state.account) return;

    let signature = await window.web3.eth.personal.sign(
      "Logging in to Web3 Auth",
      this.state.account
    );

    try {
      let response = await axios.post("/api/users/login", {
        email: this.state.email,
        signature
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        this.checkAuth();
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const renderRegisterModal = (
      <Modal
        setEmail={e => this.setState({ email: e.target.value })}
        show={this.state.showRegisterModal}
        close={() => this.setState({ showRegisterModal: false })}
        title="Register"
        done={this.register}
      />
    );

    const renderLoginModal = (
      <Modal
        setEmail={e => this.setState({ email: e.target.value })}
        show={this.state.showLoginModal}
        close={() => this.setState({ showLoginModal: false })}
        title="Login"
        done={this.login}
      />
    );

    const renderContent = this.state.auth ? (
      <div className="mt-5 d-flex flex-column align-items-center">
        <Form.Group style={{ width: "50%" }}>
          <Form.Label className="font-weight-bold">Email address:</Form.Label>
          <Form.Control plaintext readOnly defaultValue={this.state.email} />
        </Form.Group>
        <Form.Group style={{ width: "50%" }}>
          <Form.Label className="font-weight-bold">Account:</Form.Label>
          <Form.Control plaintext readOnly defaultValue={this.state.account} />
        </Form.Group>
      </div>
    ) : (
      <div className="mt-5">
        <h2>Not Connected!</h2>
      </div>
    );

    return (
      <Container>
        <Header
          auth={this.state.auth}
          loginClicked={() => this.setState({ showLoginModal: true })}
          registerClicked={() => this.setState({ showRegisterModal: true })}
          logout={this.logout}
        />
        <Container>{renderContent}</Container>
        {renderRegisterModal}
        {renderLoginModal}
      </Container>
    );
  }
}

export default App;
