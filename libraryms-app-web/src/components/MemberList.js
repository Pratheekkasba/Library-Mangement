import React, { Component } from "react";
import { Card, Table, ButtonGroup, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faList, faRedo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MyToast from "./MyToast";
import { Link } from "react-router-dom";
import { getApiUrl } from "../apiConfig";

export default class MemberList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      loading: true,
      error: null,
      show: false,
    };
  }

  componentDidMount() {
    this.fetchMembers();
  }

  fetchMembers = () => {
    this.setState({ loading: true, error: null });
    const apiUrl = getApiUrl();
    axios
      .get(`${apiUrl}/members`)
      .then((response) => {
        this.setState({
          members: Array.isArray(response.data) ? response.data : [],
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        console.error("Fetch members error:", err);
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Could not reach backend API server.";
        this.setState({ loading: false, error: msg });
      });
  };

  deleteMember = (memberId) => {
    const apiUrl = getApiUrl();
    axios
      .delete(`${apiUrl}/member/${memberId}`)
      .then((response) => {
        this.setState({
          show: true,
          members: this.state.members.filter((member) => member.id !== memberId),
        });
        setTimeout(() => this.setState({ show: false }), 3000);
      })
      .catch((err) => {
        console.error("Delete member error:", err);
        alert("Failed to delete member: " + (err.message || "Unknown error"));
      });
  };

  render() {
    const currentApi = getApiUrl();

    return (
      <div className="mb-5">
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={"Member was deleted successfully."}
            type={"danger"}
          />
        </div>

        {this.state.error && (
          <Alert variant="danger" className="shadow-sm">
            <Alert.Heading className="h6 font-weight-bold">
              ?? Unable to fetch members from backend
            </Alert.Heading>
            <p className="mb-2 small">{this.state.error}</p>
            <p className="mb-2 small text-muted">
              <strong>Target URL:</strong> <code>{currentApi}/members</code>
            </p>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={this.fetchMembers}
            >
              <FontAwesomeIcon icon={faRedo} className="mr-1" /> Retry Connection
            </Button>
          </Alert>
        )}

        <Card className="border-secondary bg-dark text-white shadow">
          <Card.Header className="d-flex justify-content-between align-items-center bg-dark border-secondary">
            <div className="font-weight-bold">
              <FontAwesomeIcon icon={faList} className="mr-2 text-info" /> Registered Members
            </div>
            <div>
              <Link to="/member/add" className="btn btn-sm btn-info mr-2">
                + Add Member
              </Link>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={this.fetchMembers}
                title="Refresh"
              >
                <FontAwesomeIcon icon={faRedo} />
              </Button>
            </div>
          </Card.Header>

          <Card.Body className="p-0">
            {this.state.loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="info" role="status" />
                <p className="mt-3 text-muted small">Loading library members...</p>
              </div>
            ) : (
              <Table responsive hover variant="dark" className="mb-0 text-center">
                <thead style={{ backgroundColor: "#1f242d" }}>
                  <tr>
                    <th className="text-left pl-4">Full Name</th>
                    <th>Email Address</th>
                    <th>Membership Date</th>
                    <th>Membership Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.members.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-5 text-muted">
                        <div style={{ fontSize: "2rem" }}>??</div>
                        <div className="font-weight-bold mt-2">No Members Registered</div>
                        <p className="small text-muted mb-3">
                          Register your first library patron or student.
                        </p>
                        <Link to="/member/add" className="btn btn-sm btn-info">
                          + Register New Member
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    this.state.members.map((member) => (
                      <tr key={member.id}>
                        <td className="text-left pl-4 font-weight-bold text-light">
                          {member.name}
                        </td>
                        <td>{member.email}</td>
                        <td>{member.membershipDate || "N/A"}</td>
                        <td>
                          <Badge variant="info">{member.membershipType || "Standard"}</Badge>
                        </td>
                        <td>
                          <ButtonGroup size="sm">
                            <Link
                              to={"/member/edit/" + member.id}
                              className="btn btn-outline-info"
                              title="Edit Member"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                            <Button
                              variant="outline-danger"
                              onClick={() => this.deleteMember(member.id)}
                              title="Delete Member"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            )}
          </Card.Body>
          <Card.Footer className="bg-dark border-secondary text-muted small d-flex justify-content-between">
            <span>Total Members: {this.state.members.length}</span>
            <span>Database: TiDB Serverless</span>
          </Card.Footer>
        </Card>
      </div>
    );
  }
}
