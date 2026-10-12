import React from "react";
import { Jumbotron, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getApiUrl } from "../apiConfig";

export default function Welcome() {
  const currentApi = getApiUrl();

  return (
    <div>
      <Jumbotron className="bg-dark text-white border border-secondary shadow p-4 p-md-5 mb-4 rounded">
        <h1 className="display-5 font-weight-bold">
          ?? Library Management System
        </h1>
        <p className="lead text-light mt-3">
          Manage your library books, registered members, and lending transactions seamlessly with high performance cloud persistence.
        </p>
        <hr className="my-4 border-secondary" />
        <div className="d-flex flex-wrap align-items-center">
          <Link to="/list" className="btn btn-primary mr-3 mb-2">
            Explore Catalog
          </Link>
          <Link to="/add" className="btn btn-outline-info mr-3 mb-2">
            + Add New Book
          </Link>
          <span className="text-muted small mb-2">
            Connected to <strong>TiDB Cloud</strong> via REST API (<code>{currentApi}</code>)
          </span>
        </div>
      </Jumbotron>

      <Row>
        <Col md={4} className="mb-4">
          <Card className="bg-dark text-white border-secondary h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <span style={{ fontSize: "2rem" }} className="mr-3">??</span>
                <div>
                  <Card.Title className="h5 mb-0">Book Inventory</Card.Title>
                  <small className="text-muted">Catalog & Details</small>
                </div>
              </div>
              <Card.Text className="text-muted flex-grow-1">
                Browse all available books, check ISBN codes, edit titles, update authors, and remove obsolete titles.
              </Card.Text>
              <div className="mt-3">
                <Link to="/list" className="btn btn-sm btn-outline-primary mr-2">
                  View Catalog
                </Link>
                <Link to="/add" className="btn btn-sm btn-primary">
                  + Add Book
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="bg-dark text-white border-secondary h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <span style={{ fontSize: "2rem" }} className="mr-3">??</span>
                <div>
                  <Card.Title className="h5 mb-0">Library Members</Card.Title>
                  <small className="text-muted">Membership Records</small>
                </div>
              </div>
              <Card.Text className="text-muted flex-grow-1">
                Track registered patrons, issue memberships, update member contact emails, and organize membership tiers.
              </Card.Text>
              <div className="mt-3">
                <Link to="/member/list" className="btn btn-sm btn-outline-info mr-2">
                  View Members
                </Link>
                <Link to="/member/add" className="btn btn-sm btn-info">
                  + Add Member
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-4">
          <Card className="bg-dark text-white border-secondary h-100 shadow-sm">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center mb-3">
                <span style={{ fontSize: "2rem" }} className="mr-3">??</span>
                <div>
                  <Card.Title className="h5 mb-0">Lending & Loans</Card.Title>
                  <small className="text-muted">Circulation Management</small>
                </div>
              </div>
              <Card.Text className="text-muted flex-grow-1">
                Issue books to members, configure checkout and return due dates, and track returned books.
              </Card.Text>
              <div className="mt-3">
                <Link to="/loan/list" className="btn btn-sm btn-outline-success mr-2">
                  View Loans
                </Link>
                <Link to="/loan/add" className="btn btn-sm btn-success">
                  + Issue Loan
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
