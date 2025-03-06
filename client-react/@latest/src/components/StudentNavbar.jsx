import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const StudentNavbar = ({ signOut }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/student'); 
  };

  const handleProfileClick = () => {
    navigate('/student?function=Profile');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar">
      <Container className="d-flex justify-content-between">
        <Navbar.Brand
          href="#home"
          className="navbar-brand"
          onClick={handleDashboardClick}
          style={{ cursor: 'pointer' }}
        >
          Student Portal
        </Navbar.Brand>
        <Nav>
          <Nav.Link 
            onClick={handleProfileClick}  
            className="nav-link"
            style={{ cursor: 'pointer' }}
          >
            Profile
          </Nav.Link>
          <Nav.Link 
            onClick={signOut} 
            className="nav-link"
            style={{ cursor: 'pointer' }}
          >
            Logout
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

StudentNavbar.propTypes = {
  signOut: PropTypes.func.isRequired,
};

export default StudentNavbar;