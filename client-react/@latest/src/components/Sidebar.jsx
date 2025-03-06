import React from 'react';
import { Nav } from 'react-bootstrap';
import PropTypes from 'prop-types';
const Sidebar = ({ handleNavClick }) => (
  <Nav defaultActiveKey="/home" className="flex-column">
    <Nav.Link href="#list-students" onClick={() => handleNavClick('List All Students')}>List All Students</Nav.Link>
    <Nav.Link href="#create-student" onClick={() => handleNavClick('Create a Student')}>Create a Student</Nav.Link>
    <Nav.Link href="#update-student" onClick={() => handleNavClick('Update a Student')}>Update a Student</Nav.Link>
    <Nav.Link href="#list-courses" onClick={() => handleNavClick('List All Courses')}>List All Courses</Nav.Link>
    <Nav.Link href="#students-by-course" onClick={() => handleNavClick('Students by Course')}>
  List all students Taking a Specific Course</Nav.Link>
  </Nav>
);
Sidebar.propTypes = {
  handleNavClick: PropTypes.func.isRequired,
};
export default Sidebar;