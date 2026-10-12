import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import Welcome from "./components/Welcome";
import { Container, Row, Col } from "react-bootstrap";
import Footer from "./components/Footer";
import Book from "./components/Book";
import BookList from "./components/BookList";
import Loan from "./components/Loan";
import LoanList from "./components/LoanList";
import Member from "./components/Member";
import MemberList from "./components/MemberList";
function App() {
  const marginTop = { marginTop: "30px", minHeight: "75vh" };
  return (
    <Router>
      <NavigationBar />
      <Container>
        <Row>
          <Col lg={12} style={marginTop}>
            <Switch>
              <Route path="/" exact component={Welcome} />
              <Route path="/add" exact component={Book} />
              <Route path="/edit/:id" exact component={Book} />
              <Route path="/list" exact component={BookList} />
              <Route path="/loan/add" exact component={Loan} />
              <Route path="/loan/edit/:id" exact component={Loan} />
              <Route path="/loan/list" exact component={LoanList} />
              <Route path="/member/add" exact component={Member} />
              <Route path="/member/edit/:id" exact component={Member} />
              <Route path="/member/list" exact component={MemberList} />
            </Switch>
          </Col>
        </Row>
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
