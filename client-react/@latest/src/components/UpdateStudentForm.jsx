import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const UpdateStudentForm = ({ currentStudent, newStudent, handleInputChange, handleUpdateStudent }) => {
  const [showModal, setShowModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleConfirmUpdate = (e) => {
    handleUpdateStudent(e);
    handleCloseModal();
  };

  const getChangedFields = () => {
    const changedFields = {};
    for (const key in newStudent) {
      if (newStudent[key] !== currentStudent[key]) {
        changedFields[key] = newStudent[key];
      }
    }
    return changedFields;
  };

  const changedFields = getChangedFields();

  useEffect(() => {
    setHasChanges(Object.keys(changedFields).length > 0);
  }, [newStudent, currentStudent]);

  return (
    <>
      <Form onSubmit={(e) => { e.preventDefault(); handleShowModal(); }}>
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
        <Button variant="primary" type="submit" className="submit-button" disabled={!hasChanges}>
          Update Student
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to update the student with the following information?</p>
          {Object.keys(changedFields).map((key) => (
            <p key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {changedFields[key]}</p>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmUpdate}>
            Confirm Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

UpdateStudentForm.propTypes = {
  currentStudent: PropTypes.shape({
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
  handleUpdateStudent: PropTypes.func.isRequired,
};

export default UpdateStudentForm;