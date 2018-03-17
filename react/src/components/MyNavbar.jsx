import React, { Component } from 'react';
import { Navbar, NavItem, Nav, Image } from 'react-bootstrap';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './styles/MyNavbar.css';

class MyNavbar extends Component{
  render() {
    return (
      <Navbar inverse fluid>
        <Navbar.Header>
          <div className="brand-align">
          <Router>
          <Navbar.Brand>
              <a href="/"><Image src="https://i.imgur.com/g16hr23.png"/></a>
          </Navbar.Brand>
          </Router>
        </div>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem eventKey={2} href="/about" to="/about">
              About
            </NavItem>
            <NavItem eventKey={2} href="/courses" to="/courses">
              Courses
            </NavItem>
            <NavItem eventKey={2} href="/"subjects to="/subjects">
              Subjects
            </NavItem>
            <NavItem eventKey={2} href="/jobs" to="/jobs">
              Jobs
            </NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
export default MyNavbar;
