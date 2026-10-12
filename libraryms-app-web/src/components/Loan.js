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

export default class Loan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.initialState,
      show: false,
      books: [],
      members: [],
      saving: false,
      error: null,
    };
    this.loanChange = this.loanChange.bind(this);
    this.submitLoan = this.submitLoan.bind(this);
  }

  initialState = {
    id: "",
    bookId: "",
    memberId: "",
    checkoutDate: "",
    dueDate: "",
    returnDate: "",
  };

  componentDidMount() {
    const apiUrl = getApiUrl();
    axios
      .get(`${apiUrl}/books`)
      .then((response) => this.setState({ books: Array.isArray(response.data) ? response.data : [] }))
      .catch((e) => console.error("Books load error:", e));

    axios
      .get(`${apiUrl}/members`)
      .then((response) => this.setState({ members: Array.isArray(response.data) ? response.data : [] }))
      .catch((e) => console.error("Members load error:", e));

    const loanId = +this.props.match.params.id;
    if (loanId) {
      this.findLoanById(loanId);
    }
  }

  findLoanById = (loanId) => {
    const apiUrl = getApiUrl();
    axios
      .get(`${apiUrl}/loan/${loanId}`)
      .then((response) => {
        if (response.data != null) {
          this.setState({
            id: response.data.id,
            bookId: response.data.book?.id || "",
            memberId: response.data.member?.id || "",
            checkoutDate: response.data.checkoutDate || "",
            dueDate: response.data.dueDate || "",
            returnDate: response.data.returnDate || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
        this.setState({ error: "Could not load loan details: " + error.message });
      });
  };

  resetLoan = () => {
    this.setState(this.initialState);
  };

  loanChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  loanList = () => {
    return this.props.history.push("/loan/list");
  };

  submitLoan = (event) => {
    event.preventDefault();
    this.setState({ saving: true, error: null });

    const loan = {
      bookId: parseInt(this.state.bookId),
      memberId: parseInt(this.state.memberId),
      checkoutDate: this.state.checkoutDate,
      dueDate: this.state.dueDate,
      returnDate: this.state.returnDate || null,
    };

    const apiUrl = getApiUrl();
    axios
      .post(`${apiUrl}/loan`, loan)
      .then((response) => {
        if (response.data != null) {
          this.setState({ show: true, method: "post", saving: false });
          setTimeout(() => {
            this.setState({ show: false });
            this.props.history.push("/loan/list");
          }, 1500);
        } else {
          this.setState({ show: false, saving: false });
        }
      })
      .catch((err) => {
        console.error("Save loan error:", err);
        this.setState({
          saving: false,
          error: "Failed to issue loan: " + (err.response?.data?.message || err.message),
        });
      });
  };

  updateLoan = (event) => {
    event.preventDefault();
    this.setState({ saving: true, error: null });

    const loan = {
      bookId: parseInt(this.state.bookId),
      memberId: parseInt(this.state.memberId),
      checkoutDate: this.state.checkoutDate,
      dueDate: this.state.dueDate,
      returnDate: this.state.returnDate || null,
    };

    const apiUrl = getApiUrl();
    axios
      .put(`${apiUrl}/loan/${this.state.id}`, loan)
      .then((response) => {
        if (response.data != null) {
          this.setState({ show: true, method: "put", saving: false });
          setTimeout(() => {
            this.setState({ show: false });
            this.loanList();
          }, 1500);
        } else {
          this.setState({ show: false, saving: false });
        }
      })
      .catch((err) => {
        console.error("Update loan error:", err);
        this.setState({
          saving: false,
          error: "Failed to update loan: " + (err.response?.data?.message || err.message),
        });
      });
  };

  render() {
    const { bookId, memberId, checkoutDate, dueDate, returnDate, error, saving, books, members } = this.state;
    return (
      <div className="mb-5">
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={
              this.state.method === "put"
                ? "Loan record updated successfully."
                : "Book loan issued successfully."
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
            {this.state.id ? "Update Loan Record" : "Issue New Book Loan"}
          </Card.Header>
          <Form
            onReset={this.resetLoan}
            onSubmit={this.state.id ? this.updateLoan : this.submitLoan}
            id="loanFormId"
          >
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} md={6} controlId="formGridBook">
                  <Form.Label>Select Book</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    name="bookId"
                    value={bookId}
                    onChange={this.loanChange}
                    className="bg-secondary text-white border-0"
                  >
                    <option value="">-- Choose Book from Catalog --</option>
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} (by {b.author})
                      </option>
                    ))}
                  </Form.Control>
                  {books.length === 0 && (
                    <Form.Text className="text-warning">
                      No books available. Please add a book first.
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="formGridMember">
                  <Form.Label>Select Borrower / Member</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    name="memberId"
                    value={memberId}
                    onChange={this.loanChange}
                    className="bg-secondary text-white border-0"
                  >
                    <option value="">-- Choose Member --</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.email})
                      </option>
                    ))}
                  </Form.Control>
                  {members.length === 0 && (
                    <Form.Text className="text-warning">
                      No members registered. Please add a member first.
                    </Form.Text>
                  )}
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md={4} controlId="formGridCheckoutDate">
                  <Form.Label>Checkout Date</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="checkoutDate"
                    value={checkoutDate}
                    onChange={this.loanChange}
                    className="bg-secondary text-white border-0"
                  />
                </Form.Group>
                <Form.Group as={Col} md={4} controlId="formGridDueDate">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="dueDate"
                    value={dueDate}
                    onChange={this.loanChange}
                    className="bg-secondary text-white border-0"
                  />
                </Form.Group>
                <Form.Group as={Col} md={4} controlId="formGridReturnDate">
                  <Form.Label>Return Date (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    name="returnDate"
                    value={returnDate}
                    onChange={this.loanChange}
                    className="bg-secondary text-white border-0"
                  />
                </Form.Group>
              </Form.Row>
            </Card.Body>
            <Card.Footer className="bg-dark border-secondary d-flex justify-content-between">
              <Button
                size="sm"
                variant="outline-secondary"
                type="button"
                onClick={this.loanList}
              >
                <FontAwesomeIcon icon={faList} className="mr-1" />
                Back to Loans
              </Button>
              <div>
                <Button size="sm" variant="outline-light" type="reset" className="mr-2">
                  <FontAwesomeIcon icon={faUndo} className="mr-1" />
                  Reset
                </Button>
                <Button size="sm" variant="success" type="submit" disabled={saving}>
                  <FontAwesomeIcon icon={faSave} className="mr-1" />
                  {saving ? "Processing..." : this.state.id ? "Update Loan" : "Issue Loan"}
                </Button>
              </div>
            </Card.Footer>
          </Form>
        </Card>
      </div>
    );
  }
}
