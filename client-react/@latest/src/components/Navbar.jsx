import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = ({ signOut }) => {
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    navigate('/admin'); 
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
          Admin Dashboard
        </Navbar.Brand>
        <Nav>
          <Nav.Link 
            onClick={signOut} 
            className="nav-link"
            style={{ cursor: 'pointer' }}
          >
            Sign Out
          </Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

AdminNavbar.propTypes = {
  signOut: PropTypes.func.isRequired,
};

export default AdminNavbar;