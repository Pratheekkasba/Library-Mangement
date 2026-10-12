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

export default class Book extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.initialState,
      show: false,
      saving: false,
      error: null,
    };
    this.bookChange = this.bookChange.bind(this);
    this.submitBook = this.submitBook.bind(this);
  }

  initialState = { id: "", title: "", author: "", isbn: "", rating: "" };

  componentDidMount() {
    const bookId = +this.props.match.params.id;
    if (bookId) {
      this.findBookById(bookId);
    }
  }

  findBookById = (bookId) => {
    const apiUrl = getApiUrl();
    axios
      .get(`${apiUrl}/book/${bookId}`)
      .then((response) => {
        if (response.data != null) {
          this.setState({
            id: response.data.id,
            title: response.data.title,
            author: response.data.author,
            isbn: response.data.isbn,
            rating: response.data.rating,
          });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
        this.setState({ error: "Could not load book: " + error.message });
      });
  };

  resetBook = () => {
    this.setState(() => this.initialState);
  };

  submitBook = (event) => {
    event.preventDefault();
    this.setState({ saving: true, error: null });

    const book = {
      title: this.state.title,
      author: this.state.author,
      isbn: this.state.isbn,
      rating: parseInt(this.state.rating) || 0,
    };

    const apiUrl = getApiUrl();
    axios
      .post(`${apiUrl}/book`, book)
      .then((response) => {
        if (response.data != null) {
          this.setState({ show: true, method: "post", saving: false });
          setTimeout(() => {
            this.setState({ show: false });
            this.props.history.push("/list");
          }, 1500);
        } else {
          this.setState({ show: false, saving: false });
        }
      })
      .catch((err) => {
        console.error("Save book error:", err);
        this.setState({
          saving: false,
          error: "Failed to save book: " + (err.response?.data?.message || err.message),
        });
      });
  };

  bookChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  bookList = () => {
    return this.props.history.push("/list");
  };

  updateBook = (event) => {
    event.preventDefault();
    this.setState({ saving: true, error: null });

    const book = {
      id: this.state.id,
      title: this.state.title,
      author: this.state.author,
      isbn: this.state.isbn,
      rating: parseInt(this.state.rating) || 0,
    };

    const apiUrl = getApiUrl();
    axios
      .put(`${apiUrl}/book/${this.state.id}`, book)
      .then((response) => {
        if (response.data != null) {
          this.setState({ show: true, method: "put", saving: false });
          setTimeout(() => {
            this.setState({ show: false });
            this.bookList();
          }, 1500);
        } else {
          this.setState({ show: false, saving: false });
        }
      })
      .catch((err) => {
        console.error("Update book error:", err);
        this.setState({
          saving: false,
          error: "Failed to update book: " + (err.response?.data?.message || err.message),
        });
      });
  };

  render() {
    const { title, author, isbn, rating, error, saving } = this.state;
    return (
      <div className="mb-5">
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={
              this.state.method === "put"
                ? "Book was updated successfully."
                : "Book was saved successfully."
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
            {this.state.id ? "Update Book Details" : "Add New Book to Library"}
          </Card.Header>
          <Form
            onReset={this.resetBook}
            onSubmit={this.state.id ? this.updateBook : this.submitBook}
            id="bookFormId"
          >
            <Card.Body>
              <Form.Row>
                <Form.Group as={Col} md={6} controlId="formGridTitle">
                  <Form.Label>Book Title</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="text"
                    name="title"
                    value={title}
                    onChange={this.bookChange}
                    className="bg-secondary text-white border-0"
                    placeholder="e.g. Clean Code"
                  />
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="formGridAuthor">
                  <Form.Label>Author Name</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="text"
                    name="author"
                    value={author}
                    onChange={this.bookChange}
                    className="bg-secondary text-white border-0"
                    placeholder="e.g. Robert C. Martin"
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row>
                <Form.Group as={Col} md={6} controlId="formGridIsbn">
                  <Form.Label>ISBN Number</Form.Label>
                  <Form.Control
                    required
                    autoComplete="off"
                    type="text"
                    name="isbn"
                    value={isbn}
                    onChange={this.bookChange}
                    className="bg-secondary text-white border-0"
                    placeholder="e.g. 9780132350884"
                  />
                </Form.Group>
                <Form.Group as={Col} md={6} controlId="formGridRating">
                  <Form.Label>Rating (1 to 5)</Form.Label>
                  <Form.Control
                    required
                    as="select"
                    name="rating"
                    value={rating}
                    onChange={this.bookChange}
                    className="bg-secondary text-white border-0"
                  >
                    <option value="">Select Rating</option>
                    <option value="5">????? (5 - Excellent)</option>
                    <option value="4">????? (4 - Very Good)</option>
                    <option value="3">????? (3 - Good)</option>
                    <option value="2">????? (2 - Fair)</option>
                    <option value="1">????? (1 - Poor)</option>
                  </Form.Control>
                </Form.Group>
              </Form.Row>
            </Card.Body>
            <Card.Footer className="bg-dark border-secondary d-flex justify-content-between">
              <Button
                size="sm"
                variant="outline-secondary"
                type="button"
                onClick={this.bookList}
              >
                <FontAwesomeIcon icon={faList} className="mr-1" />
                Back to List
              </Button>
              <div>
                <Button size="sm" variant="outline-light" type="reset" className="mr-2">
                  <FontAwesomeIcon icon={faUndo} className="mr-1" />
                  Reset
                </Button>
                <Button size="sm" variant="primary" type="submit" disabled={saving}>
                  <FontAwesomeIcon icon={faSave} className="mr-1" />
                  {saving ? "Saving..." : this.state.id ? "Update Book" : "Save Book"}
                </Button>
              </div>
            </Card.Footer>
          </Form>
        </Card>
      </div>
    );
  }
}
