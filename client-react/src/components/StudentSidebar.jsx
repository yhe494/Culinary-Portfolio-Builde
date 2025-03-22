import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StudentSidebar = ({ handleNavClick }) => {
  return (
    <Nav className="flex-column">
      {/* <Nav.Link as={Link} to="/" onClick={() => handleNavClick('Profile')}>Profile</Nav.Link> */}
      {/* <Nav.Link as={Link} to="/edit-profile">Edit Profile</Nav.Link> */}
      <Nav.Link as={Link} to="/" onClick={() => handleNavClick('Add a Course')}>Add a Course</Nav.Link>
      <Nav.Link as={Link} to="/" onClick={() => handleNavClick('List all courses taking')}>List all courses taking</Nav.Link>
      <Nav.Link as={Link} to="/" onClick={() => handleNavClick('Drop a Course')}>Drop a Course</Nav.Link>
      <Nav.Link as={Link} to="/" onClick={() => handleNavClick('Update a Course')}>Update a Course</Nav.Link>
    </Nav>
  );
};

export default StudentSidebar;