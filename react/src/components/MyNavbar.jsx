import React, { Component } from 'react';
import { Navbar, NavItem, Nav, Image } from 'react-bootstrap';
import './styles/MyNavbar.css';
import Search from './GlobalSearch.jsx';

var navbar_style = {
    'borderRadius': 0,
    'marginBottom': 0
};

class MyNavbar extends Component{
  render() {
    return (
    <Navbar inverse fluid style={navbar_style}>
        <Navbar.Header>
          <div className="brand-align">
          <Navbar.Brand>
              <a href="/"><Image src="https://i.imgur.com/g16hr23.png"/></a>
          </Navbar.Brand>
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
            <NavItem eventKey={2} href="/subjects" to="/subjects">
              Subjects
            </NavItem>
            <NavItem eventKey={2} href="/jobs" to="/jobs">
              Jobs
            </NavItem>
            <Search />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
export default MyNavbar;
