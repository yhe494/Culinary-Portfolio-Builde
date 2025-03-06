import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const UpdateCourseForm = ({ studentCourses, fetchStudentCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setSelectedSection('');
    setError('');
    setSuccess('');
  };

  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
    setError('');
    setSuccess('');
  };

  const handleUpdateCourseClick = () => {
    if (!selectedCourse || !selectedSection) {
      setError('Please select a course and section to update.');
      return;
    }
    setShowModal(true);
  };

  const handleConfirmUpdateCourse = async () => {
    try {
        const cookieToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        const token = cookieToken || localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found. Please sign in again.');
        }

        console.log('Sending update request with:', {
            courseId: selectedCourse,
            section: selectedSection
        });

        const response = await fetch('http://localhost:5001/api/student/courses', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include',
            body: JSON.stringify({
                courseId: selectedCourse,
                section: selectedSection
            })
        });

        const responseData = await response.json();
        console.log('Update response:', responseData);

        if (!response.ok) {
            throw new Error(responseData.message || 'Failed to update course');
        }

        setSuccess('Course updated successfully!');
        setSelectedCourse('');
        setSelectedSection('');
        setShowModal(false);
        await fetchStudentCourses(); // Added await here
    } catch (err) {
        console.error('Error in updateCourse:', err);
        setError(err.message || 'Failed to update course');
        setShowModal(false);
    }
};

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const selectedCourseDetails = studentCourses.find(course => course._id === selectedCourse);
  console.log('Selected Course:', selectedCourse);
  console.log('Selected Course Details:', selectedCourseDetails);


  return (
    <div>
      <Form>
        <Form.Group controlId="formCourseSelect">
          <Form.Label>Select Course to Update</Form.Label>
          <Form.Control as="select" value={selectedCourse} onChange={handleCourseChange}>
            <option value="">Select a course</option>
            {studentCourses.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        {selectedCourseDetails && selectedCourseDetails.sections && (
  <Form.Group controlId="formSectionSelect">
    <Form.Label>Select Section</Form.Label>
    <Form.Control as="select" value={selectedSection} onChange={handleSectionChange}>
      <option value="">Select a section</option>
      {selectedCourseDetails.sections.map((section, index) => (
        <option key={index} value={section}>
          {section}
        </option>
      ))}
    </Form.Control>
  </Form.Group>
)}
        <Button variant="primary" className="submit-button" onClick={handleUpdateCourseClick}>
          Update Course
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Update Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourseDetails && (
            <div>
              <p><strong>Course Code:</strong> {selectedCourseDetails.courseCode}</p>
              <p><strong>Course Name:</strong> {selectedCourseDetails.courseName}</p>
              <p><strong>Selected Section:</strong> {selectedSection}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmUpdateCourse}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}
    </div>
  );
};

UpdateCourseForm.propTypes = {
  studentCourses: PropTypes.array.isRequired,
  fetchStudentCourses: PropTypes.func.isRequired,
};

export default UpdateCourseForm;