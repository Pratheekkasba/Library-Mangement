import React, { Component } from "react";
import { Card, Form, Button, Col, Alert } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faList,
  faEdit,
  faSave,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import MyToast from "./MyToast";
import { getApiUrl } from "../apiConfig";

export default class Member extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
      show: false,
      saving: false,
      error: null,
    };
    this.memberChange = this.memberChange.bind(this);
    this.submitMember = this.submitMember.bind(this);
  }

  initialState = {
    id: "",
    name: "",
    email: "",
    membershipDate: "",
    membershipType: "Standard",
  };

  componentDidMount() {
    const memberId = +this.props.match.params.id;
    if (memberId) {
      this.findMemberById(memberId);
    }
  }

  findMemberById = (memberId) => {
    const apiUrl = getApiUrl();
    axios
      .get(`${apiUrl}/member/${memberId}`)
      .then((response) => {
        if (response.data != null) {
          this.setState({
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            membershipDate: response.data.membershipDate,
            membershipType: response.data.membershipType || "Standard",
          });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
        this.setState({ error: "Could not load member: " + error.message });
      });
  };

  resetMember = () => {
    this.setState(this.initialState);
  };

  memberChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  memberList = () => {
    return this.props.history.push("/member/list");
  };

  submitMember = (event) => {
    event.preventDefault();
    this.setState({ saving: true, error: null });

    const member = {
      name: this.state.name,
      email: this.state.email,
      membershipDate: this.state.membershipDate,
      membershipType: this.state.membershipType,
    };

    const apiUrl = getApiUrl();
    axios
      .post(`${apiUrl}/member`, member)
      .then((response) => {
        if (response.data != null) {
          this.setState({ show: true, method: "post", saving: false });
          setTimeout(() => {
            this.setState({ show: false });
            this.props.history.push("/member/list");
          }, 1500);
        } else {
          this.setState({ show: false, saving: false });
        }
      })
      .catch((err) => {
        console.error("Save member error:", err);
        this.setState({
          saving: false,
          error: "Failed to save member: " + (err.response?.data?.message || err.message),
        });
      });
  };

  updateMember = (event) => {
    event.preventDefault();
    this.setState({ saving: true, error: null });

    const member = {
      id: this.state.id,
      name: this.state.name,
      email: this.state.email,
      membershipDate: this.state.membershipDate,
      membershipType: this.state.membershipType,
    };

    const apiUrl = getApiUrl();
    axios
      .put(`${apiUrl}/member/${this.state.id}`, member)
      .then((response) => {
        if (response.data != null) {
          this.setState({ show: true, method: "put", saving: false });
          setTimeout(() => {
            this.setState({ show: false });
            this.memberList();
          }, 1500);
        } else {
          this.setState({ show: false, saving: false });
        }
      })
      .catch((err) => {
        console.error("Update member error:", err);
        this.setState({
          saving: false,
          error: "Failed to update member: " + (err.response?.data?.message || err.message),
        });
      });
  };

  render() {
    const { name, email, membershipDate, membershipType, error, saving } = this.state;
    return (
      <div className="mb-5">
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={
              this.state.method === "put"
                ? "Member updated successfully."
                : "Member registered successfully."
            }
            type={"success"}
          />
        </div>

        {error && (
          <Alert variant="danger" dismissible onClose={() => this.setState({ error: null })}>
            {error}
          </Alert>
        )}

        <Card className="border-secondary bg-dark text-white shadow">
          <Card.Header className="bg-dark border-secondary font-weight-bold">
            <FontAwesomeIcon
              icon={this.state.id ? faEdit : faPlusSquare}
              className="mr-2 text-info"
            />
            {this.state.id ? "Update Member Details" : "Register New Library Member"}
          </Card.Header>
          <Form
            onReset={this.resetMember}
            onSubmit={this.state.id ? this.updateMember : this.submitMember}
            id="memberFormId"
          >
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} md={6} controlId="formGridName">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.memberChange}
                    className="bg-secondary text-white border-0"
                    placeholder="Enter Patron's Full Name"
                  />
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="formGridEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.memberChange}
                    className="bg-secondary text-white border-0"
                    placeholder="patron@example.com"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md={6} controlId="formGridMembershipDate">
                  <Form.Label>Membership Date</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="membershipDate"
                    value={membershipDate}
                    onChange={this.memberChange}
                    className="bg-secondary text-white border-0"
                  />
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="formGridMembershipType">
                  <Form.Label>Membership Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="membershipType"
                    value={membershipType}
                    onChange={this.memberChange}
                    className="bg-secondary text-white border-0"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Student">Student</option>
                    <option value="Premium">Premium</option>
                    <option value="Faculty">Faculty</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
            </Card.Body>
            <Card.Footer className="bg-dark border-secondary d-flex justify-content-between">
              <Button
                size="sm"
                variant="outline-secondary"
                type="button"
                onClick={this.memberList}
              >
                <FontAwesomeIcon icon={faList} className="mr-1" />
                Back to Members
              </Button>
              <div>
                <Button size="sm" variant="outline-light" type="reset" className="mr-2">
                  <FontAwesomeIcon icon={faUndo} className="mr-1" />
                  Reset
                </Button>
                <Button size="sm" variant="info" type="submit" disabled={saving}>
                  <FontAwesomeIcon icon={faSave} className="mr-1" />
                  {saving ? "Saving..." : this.state.id ? "Update Member" : "Register Member"}
                </Button>
              </div>
            </Card.Footer>
          </Form>
        </Card>
      </div>
    );
  }
}
