import React, { Component } from "react";
import { Card, Table, ButtonGroup, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faList, faRedo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MyToast from "./MyToast";
import { Link } from "react-router-dom";
import { getApiUrl } from "../apiConfig";

export default class LoanList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loans: [],
      loading: true,
      error: null,
      show: false,
    };
  }

  componentDidMount() {
    this.fetchLoans();
  }

  fetchLoans = () => {
    this.setState({ loading: true, error: null });
    const apiUrl = getApiUrl();
    axios
      .get(`${apiUrl}/loans`)
      .then((response) => {
        this.setState({
          loans: Array.isArray(response.data) ? response.data : [],
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        console.error("Fetch loans error:", err);
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Could not reach backend API server.";
        this.setState({ loading: false, error: msg });
      });
  };

  deleteLoan = (loanId) => {
    const apiUrl = getApiUrl();
    axios
      .delete(`${apiUrl}/loan/${loanId}`)
      .then((response) => {
        this.setState({
          show: true,
          loans: this.state.loans.filter((loan) => loan.id !== loanId),
        });
        setTimeout(() => this.setState({ show: false }), 3000);
      })
      .catch((err) => {
        console.error("Delete loan error:", err);
        alert("Failed to delete loan: " + (err.message || "Unknown error"));
      });
  };

  render() {
    const currentApi = getApiUrl();

    return (
      <div className="mb-5">
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={"Loan record deleted successfully."}
            type={"danger"}
          />
        </div>

        {this.state.error && (
          <Alert variant="danger" className="shadow-sm">
            <Alert.Heading className="h6 font-weight-bold">
              ?? Unable to fetch loans from backend
            </Alert.Heading>
            <p className="mb-2 small">{this.state.error}</p>
            <p className="mb-2 small text-muted">
              <strong>Target URL:</strong> <code>{currentApi}/loans</code>
            </p>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={this.fetchLoans}
            >
              <FontAwesomeIcon icon={faRedo} className="mr-1" /> Retry Connection
            </Button>
          </Alert>
        )}

        <Card className="border-secondary bg-dark text-white shadow">
          <Card.Header className="d-flex justify-content-between align-items-center bg-dark border-secondary">
            <div className="font-weight-bold">
              <FontAwesomeIcon icon={faList} className="mr-2 text-info" /> Book Lending & Loans
            </div>
            <div>
              <Link to="/loan/add" className="btn btn-sm btn-success mr-2">
                + Issue Loan
              </Link>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={this.fetchLoans}
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
                <p className="mt-3 text-muted small">Loading circulation records...</p>
              </div>
            ) : (
              <Table responsive hover variant="dark" className="mb-0 text-center">
                <thead style={{ backgroundColor: "#1f242d" }}>
                  <tr>
                    <th className="text-left pl-4">Book Title</th>
                    <th>Borrower Name</th>
                    <th>Checkout Date</th>
                    <th>Due Date</th>
                    <th>Status / Return Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.loans.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-5 text-muted">
                        <div style={{ fontSize: "2rem" }}>??</div>
                        <div className="font-weight-bold mt-2">No Active or Past Loans</div>
                        <p className="small text-muted mb-3">
                          No books have been borrowed yet.
                        </p>
                        <Link to="/loan/add" className="btn btn-sm btn-success">
                          + Issue a Book Loan
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    this.state.loans.map((loan) => (
                      <tr key={loan.id}>
                        <td className="text-left pl-4 font-weight-bold text-light">
                          {loan.book?.title || `Book #${loan.book?.id}`}
                        </td>
                        <td>{loan.member?.name || `Member #${loan.member?.id}`}</td>
                        <td>{loan.checkoutDate || "N/A"}</td>
                        <td>{loan.dueDate || "N/A"}</td>
                        <td>
                          {loan.returnDate ? (
                            <Badge variant="success">Returned: {loan.returnDate}</Badge>
                          ) : (
                            <Badge variant="warning" className="text-dark">Active Checkout</Badge>
                          )}
                        </td>
                        <td>
                          <ButtonGroup size="sm">
                            <Link
                              to={"/loan/edit/" + loan.id}
                              className="btn btn-outline-info"
                              title="Edit Loan"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                            <Button
                              variant="outline-danger"
                              onClick={() => this.deleteLoan(loan.id)}
                              title="Delete Loan"
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
            <span>Total Loans: {this.state.loans.length}</span>
            <span>Database: TiDB Serverless</span>
          </Card.Footer>
        </Card>
      </div>
    );
  }
}
