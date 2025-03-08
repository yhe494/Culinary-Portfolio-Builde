import React from 'react';
import { Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StudentSidebar = ({ handleNavClick }) => (
  <Nav defaultActiveKey="/home" className="flex-column">
    <Nav.Link href="#add-course" onClick={() => handleNavClick('Add a Course')}>Add a Course</Nav.Link>
    <Nav.Link href="#update-course" onClick={() => handleNavClick('Update a Course')}>Update a Course</Nav.Link>
    <Nav.Link href="#drop-course" onClick={() => handleNavClick('Drop a Course')}>Drop a Course</Nav.Link>
    <Nav.Link href="#list-courses" onClick={() => handleNavClick('List all courses taking')}>List All Courses Taking</Nav.Link>
  </Nav>
);

StudentSidebar.propTypes = {
  handleNavClick: PropTypes.func.isRequired,
};

export default StudentSidebar;