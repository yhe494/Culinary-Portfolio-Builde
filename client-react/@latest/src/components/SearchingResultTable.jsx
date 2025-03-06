import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SearchingResultTable = ({ student }) => {
  return (
    <Table striped bordered hover>
      <tbody>
        <tr>
          <td><strong>Student Number</strong></td>
          <td>{student.studentNumber}</td>
        </tr>
        <tr>
          <td><strong>First Name</strong></td>
          <td>{student.firstName}</td>
        </tr>
        <tr>
          <td><strong>Last Name</strong></td>
          <td>{student.lastName}</td>
        </tr>
        <tr>
          <td><strong>Address</strong></td>
          <td>{student.Address}</td>
        </tr>
        <tr>
          <td><strong>City</strong></td>
          <td>{student.City}</td>
        </tr>
        <tr>
          <td><strong>Phone Number</strong></td>
          <td>{student.phoneNumber}</td>
        </tr>
        <tr>
          <td><strong>Email</strong></td>
          <td>{student.email}</td>
        </tr>
        <tr>
          <td><strong>Program</strong></td>
          <td>{student.program}</td>
        </tr>
        <tr>
          <td><strong>Favorite Course</strong></td>
          <td>{student.favoriteCourse}</td>
        </tr>
        <tr>
          <td><strong>Technical Skills</strong></td>
          <td>{student.technicalSkills}</td>
        </tr>
        <tr>
          <td><strong>Is Admin</strong></td>
          <td>{student.isAdmin ? 'Yes' : 'No'}</td>
        </tr>
      </tbody>
    </Table>
  );
};

SearchingResultTable.propTypes = {
  student: PropTypes.shape({
    studentNumber: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    Address: PropTypes.string,
    City: PropTypes.string,
    phoneNumber: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    program: PropTypes.string,
    favoriteCourse: PropTypes.string,
    technicalSkills: PropTypes.string,
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
};

export default SearchingResultTable;