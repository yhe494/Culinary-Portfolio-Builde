import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

const StudentProfile = ({ studentProfile }) => {
  // Helper function to display value or placeholder
  const displayValue = (value) => value || 'Not provided';

  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td><strong>Student Number</strong></td>
          <td>{displayValue(studentProfile.studentNumber)}</td>
        </tr>
        <tr>
          <td><strong>First Name</strong></td>
          <td>{displayValue(studentProfile.firstName)}</td>
        </tr>
        <tr>
          <td><strong>Last Name</strong></td>
          <td>{displayValue(studentProfile.lastName)}</td>
        </tr>
        <tr>
          <td><strong>Address</strong></td>
          <td>{displayValue(studentProfile.Address)}</td>
        </tr>
        <tr>
          <td><strong>City</strong></td>
          <td>{displayValue(studentProfile.City)}</td>
        </tr>
        <tr>
          <td><strong>Phone Number</strong></td>
          <td>{displayValue(studentProfile.phoneNumber)}</td>
        </tr>
        <tr>
          <td><strong>Email</strong></td>
          <td>{displayValue(studentProfile.email)}</td>
        </tr>
        <tr>
          <td><strong>Program</strong></td>
          <td>{displayValue(studentProfile.program)}</td>
        </tr>
        <tr>
          <td><strong>Favorite Course</strong></td>
          <td>{displayValue(studentProfile.favoriteCourse)}</td>
        </tr>
        <tr>
          <td><strong>Technical Skills</strong></td>
          <td>{displayValue(studentProfile.technicalSkills)}</td>
        </tr>
      </tbody>
    </Table>
  );
};

StudentProfile.propTypes = {
  studentProfile: PropTypes.shape({
    studentNumber: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    Address: PropTypes.string,
    City: PropTypes.string,
    phoneNumber: PropTypes.string,
    email: PropTypes.string,
    program: PropTypes.string,
    favoriteCourse: PropTypes.string,
    technicalSkills: PropTypes.string,
  }).isRequired,
};

export default StudentProfile;