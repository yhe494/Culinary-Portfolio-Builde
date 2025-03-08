import React, { useState } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CourseTable = ({ courses, setSelectedCourse, handleDeleteCourse, selectedCourse }) => {
  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (course) => {
    if (selectedCourse && selectedCourse._id === course._id) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(course);
    }
  };

  const handleDeleteClick = () => {
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteCourse();
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
            <th>Course Code</th>
            <th>Course Name</th>
            <th>Sections</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {courses.map(course => (
            <tr key={course._id}>
              <td>
                <Form.Check
                  type="checkbox"
                  checked={selectedCourse && selectedCourse._id === course._id}
                  onChange={() => handleCheckboxChange(course)}
                />
              </td>
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
              <td>{course.sections.join(', ')}</td>
              <td>{course.semester}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="danger"
        type="button"
        onClick={handleDeleteClick}
        disabled={!selectedCourse}
      >
        Delete Course
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete course:</p>
          <p><strong>Course Code:</strong> {selectedCourse?.courseCode}</p>
          <p><strong>Course Name:</strong> {selectedCourse?.courseName}</p>
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

CourseTable.propTypes = {
  courses: PropTypes.array.isRequired,
  setSelectedCourse: PropTypes.func.isRequired,
  handleDeleteCourse: PropTypes.func.isRequired,
  selectedCourse: PropTypes.object,
};

export default CourseTable;