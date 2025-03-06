import React from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StudentForm = ({ newStudent, handleInputChange, handleCreateStudent }) => (
  <Form onSubmit={handleCreateStudent}>
    <Form.Group controlId="formStudentNumber">
      <Form.Label>Student Number</Form.Label>
      <Form.Control
        type="text"
        name="studentNumber"
        value={newStudent.studentNumber}
        onChange={handleInputChange}
        required
      />
    </Form.Group>
    <Form.Group controlId="formFirstName">
      <Form.Label>First Name</Form.Label>
      <Form.Control
        type="text"
        name="firstName"
        value={newStudent.firstName}
        onChange={handleInputChange}
        required
      />
    </Form.Group>
    <Form.Group controlId="formLastName">
      <Form.Label>Last Name</Form.Label>
      <Form.Control
        type="text"
        name="lastName"
        value={newStudent.lastName}
        onChange={handleInputChange}
        required
      />
    </Form.Group>
    <Form.Group controlId="formAddress">
      <Form.Label>Address</Form.Label>
      <Form.Control
        type="text"
        name="Address"
        value={newStudent.Address}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formCity">
      <Form.Label>City</Form.Label>
      <Form.Control
        type="text"
        name="City"
        value={newStudent.City}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formPhoneNumber">
      <Form.Label>Phone Number</Form.Label>
      <Form.Control
        type="text"
        name="phoneNumber"
        value={newStudent.phoneNumber}
        onChange={handleInputChange}
        required
      />
    </Form.Group>
    <Form.Group controlId="formEmail">
      <Form.Label>Email</Form.Label>
      <Form.Control
        type="email"
        name="email"
        value={newStudent.email}
        onChange={handleInputChange}
        required
      />
    </Form.Group>
    <Form.Group controlId="formProgram">
      <Form.Label>Program</Form.Label>
      <Form.Control
        type="text"
        name="program"
        value={newStudent.program}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formFavoriteCourse">
      <Form.Label>Favorite Course</Form.Label>
      <Form.Control
        type="text"
        name="favoriteCourse"
        value={newStudent.favoriteCourse}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formTechnicalSkills">
      <Form.Label>Technical Skills</Form.Label>
      <Form.Control
        type="text"
        name="technicalSkills"
        value={newStudent.technicalSkills}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Form.Group controlId="formPassword">
      <Form.Label>Password</Form.Label>
      <Form.Control
        type="password"
        name="password"
        value={newStudent.password}
        onChange={handleInputChange}
        required
      />
    </Form.Group>
    <Form.Group controlId="formIsAdmin" className="checkbox-margin">
      <Form.Check
        type="checkbox"
        name="isAdmin"
        label="This Student Is An Admin"
        checked={newStudent.isAdmin}
        onChange={handleInputChange}
      />
    </Form.Group>
    <Button variant="primary" type="submit" className="submit-button">
      Create Student
    </Button>
  </Form>
);

StudentForm.propTypes = {
  newStudent: PropTypes.shape({
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
    password: PropTypes.string.isRequired,
    isAdmin: PropTypes.bool.isRequired,
  }).isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleCreateStudent: PropTypes.func.isRequired,
};

export default StudentForm;