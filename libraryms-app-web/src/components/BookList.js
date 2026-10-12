import React, { Component } from "react";
import { Card, Table, ButtonGroup, Button, Spinner, Alert, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faList, faRedo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MyToast from "./MyToast";
import { Link } from "react-router-dom";
import { getApiUrl } from "../apiConfig";

export default class BookList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      loading: true,
      error: null,
      show: false,
    };
  }

  componentDidMount() {
    this.fetchBooks();
  }

  fetchBooks = () => {
    this.setState({ loading: true, error: null });
    const apiUrl = getApiUrl();
    axios
      .get(`${apiUrl}/books`)
      .then((response) => {
        this.setState({
          books: Array.isArray(response.data) ? response.data : [],
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        console.error("Fetch books error:", err);
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Could not reach backend API server.";
        this.setState({ loading: false, error: msg });
      });
  };

  deleteBook = (bookId) => {
    const apiUrl = getApiUrl();
    axios
      .delete(`${apiUrl}/book/${bookId}`)
      .then((response) => {
        this.setState({
          show: true,
          books: this.state.books.filter((book) => book.id !== bookId),
        });
        setTimeout(() => this.setState({ show: false }), 3000);
      })
      .catch((err) => {
        console.error("Delete book error:", err);
        alert("Failed to delete book: " + (err.message || "Unknown error"));
      });
  };

  renderRatingStars = (rating) => {
    const stars = Math.min(Math.max(parseInt(rating) || 0, 0), 5);
    return (
      <Badge variant="warning" className="text-dark font-weight-bold">
        {"?".repeat(stars) + "?".repeat(5 - stars)} ({rating}/5)
      </Badge>
    );
  };

  render() {
    const currentApi = getApiUrl();

    return (
      <div className="mb-5">
        <div style={{ display: this.state.show ? "block" : "none" }}>
          <MyToast
            show={this.state.show}
            message={"Book was deleted successfully."}
            type={"danger"}
          />
        </div>

        {this.state.error && (
          <Alert variant="danger" className="shadow-sm">
            <Alert.Heading className="h6 font-weight-bold">
              ?? Unable to fetch books from backend
            </Alert.Heading>
            <p className="mb-2 small">
              {this.state.error}
            </p>
            <p className="mb-2 small text-muted">
              <strong>Target URL:</strong> <code>{currentApi}/books</code>
              <br />
              <em>
                Tip: If your backend is hosted on Render free tier, it sleeps after inactivity and takes ~30-50 seconds to spin up.
                Also verify you entered your Render HTTPS URL in the top "Backend URL" button.
              </em>
            </p>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={this.fetchBooks}
              className="mr-2"
            >
              <FontAwesomeIcon icon={faRedo} className="mr-1" /> Retry Connection
            </Button>
          </Alert>
        )}

        <Card className="border-secondary bg-dark text-white shadow">
          <Card.Header className="d-flex justify-content-between align-items-center bg-dark border-secondary">
            <div className="font-weight-bold">
              <FontAwesomeIcon icon={faList} className="mr-2 text-info" /> Book Catalog
            </div>
            <div>
              <Link to="/add" className="btn btn-sm btn-primary mr-2">
                + Add Book
              </Link>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={this.fetchBooks}
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
                <p className="mt-3 text-muted small">
                  Connecting to TiDB Cloud database...
                </p>
              </div>
            ) : (
              <Table responsive hover variant="dark" className="mb-0 text-center">
                <thead style={{ backgroundColor: "#1f242d" }}>
                  <tr>
                    <th className="text-left pl-4">Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.books.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-5 text-muted">
                        <div style={{ fontSize: "2rem" }}>??</div>
                        <div className="font-weight-bold mt-2">No Books Found</div>
                        <p className="small text-muted mb-3">
                          There are currently no books in the database.
                        </p>
                        <Link to="/add" className="btn btn-sm btn-success">
                          + Add Your First Book
                        </Link>
                      </td>
                    </tr>
                  ) : (
                    this.state.books.map((book) => (
                      <tr key={book.id}>
                        <td className="text-left pl-4 font-weight-bold text-light">
                          {book.title}
                        </td>
                        <td>{book.author}</td>
                        <td>
                          <code>{book.isbn || "N/A"}</code>
                        </td>
                        <td>{this.renderRatingStars(book.rating)}</td>
                        <td>
                          <ButtonGroup size="sm">
                            <Link
                              to={"/edit/" + book.id}
                              className="btn btn-outline-info"
                              title="Edit Book"
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Link>
                            <Button
                              variant="outline-danger"
                              onClick={() => this.deleteBook(book.id)}
                              title="Delete Book"
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
            <span>Total Books: {this.state.books.length}</span>
            <span>Database: TiDB Serverless (sys/libraryms_db)</span>
          </Card.Footer>
        </Card>
      </div>
    );
  }
}
