import React, { Component } from "react";
import { Navbar, Nav, Button, Modal, Form, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getApiUrl, setApiUrl } from "../apiConfig";

class NavigationBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      apiUrlInput: getApiUrl(),
      currentApiUrl: getApiUrl(),
    };
  }

  handleSaveApiUrl = (e) => {
    e.preventDefault();
    setApiUrl(this.state.apiUrlInput);
    this.setState({ currentApiUrl: getApiUrl(), showModal: false });
    window.location.reload();
  };

  handleResetApiUrl = () => {
    setApiUrl("");
    this.setState({ apiUrlInput: getApiUrl(), currentApiUrl: getApiUrl(), showModal: false });
    window.location.reload();
  };

  render() {
    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const isApiHttp = this.state.currentApiUrl.startsWith("http://") && !this.state.currentApiUrl.includes("localhost");
    const isLocalhostOnProd = isHttps && this.state.currentApiUrl.includes("localhost");

    return (
      <>
        <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary shadow-sm px-3">
          <Link to="/" className="navbar-brand d-flex align-items-center font-weight-bold">
            <span role="img" aria-label="book" className="mr-2" style={{ fontSize: "1.4rem" }}>??</span>
            <span style={{ letterSpacing: "0.5px" }}>LibraryMS</span>
          </Link>
          <Navbar.Toggle aria-controls="main-navbar-nav" />
          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="mr-auto">
              <Link to="/list" className="nav-link font-weight-normal px-2">
                Books
              </Link>
              <Link to="/add" className="nav-link font-weight-normal px-2">
                + Add Book
              </Link>
              <Link to="/member/list" className="nav-link font-weight-normal px-2">
                Members
              </Link>
              <Link to="/member/add" className="nav-link font-weight-normal px-2">
                + Add Member
              </Link>
              <Link to="/loan/list" className="nav-link font-weight-normal px-2">
                Loans
              </Link>
              <Link to="/loan/add" className="nav-link font-weight-normal px-2">
                + Add Loan
              </Link>
            </Nav>
            <Nav className="align-items-center">
              {(isLocalhostOnProd || isApiHttp) && (
                <Badge variant="warning" className="mr-2 py-1 px-2 cursor-pointer" onClick={() => this.setState({ showModal: true })}>
                  ?? Backend URL Needed
                </Badge>
              )}
              <Button
                variant="outline-info"
                size="sm"
                onClick={() => this.setState({ showModal: true, apiUrlInput: getApiUrl() })}
                title="Configure Backend URL"
              >
                ?? Backend URL
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })} centered>
          <Modal.Header closeButton className="bg-dark text-white border-secondary">
            <Modal.Title>Backend Server Connection</Modal.Title>
          </Modal.Header>
          <Form onSubmit={this.handleSaveApiUrl}>
            <Modal.Body className="bg-dark text-light">
              <Form.Group>
                <Form.Label>Backend REST API URL</Form.Label>
                <Form.Control
                  type="url"
                  placeholder="https://your-backend.onrender.com"
                  value={this.state.apiUrlInput}
                  onChange={(e) => this.setState({ apiUrlInput: e.target.value })}
                  className="bg-secondary text-white border-0"
                  required
                />
                <Form.Text className="text-muted mt-2">
                  Paste your live Render backend URL here (e.g. <code>https://libraryms-backend.onrender.com</code>).
                </Form.Text>
              </Form.Group>
              <div className="small text-muted">
                <strong>Current Active URL:</strong> {this.state.currentApiUrl}
              </div>
            </Modal.Body>
            <Modal.Footer className="bg-dark border-secondary">
              <Button variant="secondary" size="sm" onClick={this.handleResetApiUrl}>
                Reset to Default
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save & Connect
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </>
    );
  }
}

export default NavigationBar;
