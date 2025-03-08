import React, { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StudentTable = ({ students, setSelectedStudent, handleDeleteStudent, selectedStudent }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (student) => {
    if (selectedStudent && selectedStudent._id === student._id) {
      setSelectedStudent(null);
    } else {
      setSelectedStudent(student);
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteStudent();
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Student Number</th>
            <th>Full Name</th>
            <th>Program</th>
            <th>Email</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedStudent && selectedStudent._id === student._id}
                  onChange={() => handleCheckboxChange(student)}
                />
              </td>
              <td>{student.studentNumber}</td>
              <td>{student.firstName} {student.lastName}</td>
              <td>{student.program}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="danger"
        type="button"
        onClick={handleDeleteClick}
        disabled={!selectedStudent}
      >
        Delete Student
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete student:</p>
          <p><strong>Student Number:</strong> {selectedStudent?.studentNumber}</p>
          <p><strong>Student Name:</strong> {selectedStudent?.firstName} {selectedStudent?.lastName}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

StudentTable.propTypes = {
  students: PropTypes.array.isRequired,
  setSelectedStudent: PropTypes.func.isRequired,
  handleDeleteStudent: PropTypes.func.isRequired,
  selectedStudent: PropTypes.object,
};

export default StudentTable;