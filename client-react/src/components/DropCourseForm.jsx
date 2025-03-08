import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const DropCourseForm = ({ studentCourses, fetchStudentCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleDropCourseClick = () => {
    if (!selectedCourse) {
      setError('Please select a course to drop.');
      return;
    }
    setShowModal(true);
  };

  const handleConfirmDropCourse = async () => {
    try {
      const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];
      const token = cookieToken || localStorage.getItem('token');

      if (!token) {
        throw new Error('No authentication token found. Please sign in again.');
      }

      const response = await fetch('http://localhost:5001/api/student/courses', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          courseId: selectedCourse
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please sign in again.');
        }
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to drop course');
      }

      setSuccess('Course dropped successfully!');
      setSelectedCourse('');
      setShowModal(false);
      fetchStudentCourses();
    } catch (err) {
      setError(err.message || 'Failed to drop course');
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const selectedCourseDetails = studentCourses.find(course => course._id === selectedCourse);
  const selectedSection = selectedCourseDetails ? selectedCourseDetails.section : '';

  return (
    <div>
      <Form>
        <Form.Group controlId="formCourseSelect">
          <Form.Label>Select Course to Drop</Form.Label>
          <Form.Control as="select" value={selectedCourse} onChange={handleCourseChange}>
            <option value="">Select a course</option>
            {studentCourses.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="danger" className="submit-button" onClick={handleDropCourseClick}>
          Drop Course
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Drop Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourseDetails && (
            <div>
              <p><strong>Course Code:</strong> {selectedCourseDetails.courseCode}</p>
              <p><strong>Course Name:</strong> {selectedCourseDetails.courseName}</p>
              <p><strong>Section:</strong> {selectedSection}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDropCourse}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
    </div>
  );
};

DropCourseForm.propTypes = {
  studentCourses: PropTypes.array.isRequired,
  fetchStudentCourses: PropTypes.func.isRequired,
};

export default DropCourseForm;