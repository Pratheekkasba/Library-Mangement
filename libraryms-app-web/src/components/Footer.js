import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer-custom py-3 mt-5 bg-dark text-white border-top border-secondary">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-left text-muted small">
            <span>&copy; {currentYear} Library Management System. Powered by TiDB Cloud.</span>
          </Col>
          <Col md={6} className="text-center text-md-right text-muted small mt-2 mt-md-0">
            <span>Full Stack Spring Boot &bull; React</span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
