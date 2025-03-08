import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AddCourseForm = ({ courses, fetchCourses }) => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (courses.length === 0) {
      fetchCourses();
    }
  }, [courses, fetchCourses]);

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

  const handleAddCourseClick = () => {
    setShowModal(true);
  };

  const handleConfirmAddCourse = async () => {
    try {
        // Get token from both cookie and localStorage
        const cookieToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        
        const token = cookieToken || localStorage.getItem('token');

        if (!token) {
            throw new Error('No authentication token found. Please sign in again.');
        }

        const response = await fetch('http://localhost:5001/api/student/courses', {
            method: 'POST',
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

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) {
                throw new Error('Session expired. Please sign in again.');
            }
            throw new Error(errorData.message || 'Failed to add course');
        }

        const data = await response.json();
        setSuccess('Course added successfully!');
        setSelectedCourse('');
        setSelectedSection('');
        setShowModal(false);
        
        fetchCourses();
    } catch (err) {
        setError(err.message || 'Failed to add course');
        setShowModal(false);
    }
};

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const selectedCourseDetails = courses.find(course => course._id === selectedCourse);

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form>
        <Form.Group controlId="formCourseCode">
          <Form.Label>Course Code</Form.Label>
          <Form.Control 
            as="select" 
            value={selectedCourse} 
            onChange={handleCourseChange} 
            required
          >
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.courseCode} - {course.courseName}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {selectedCourse && (
          <Form.Group controlId="formSection">
            <Form.Label>Section</Form.Label>
            <Form.Control 
              as="select" 
              value={selectedSection} 
              onChange={handleSectionChange} 
              required
            >
              <option value="">Select a section</option>
              {selectedCourseDetails.sections.map((section, index) => (
                <option key={index} value={section}>{section}</option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

        <Button 
          variant="primary" 
          className="submit-button mt-3" 
          onClick={handleAddCourseClick} 
          disabled={!selectedCourse || !selectedSection}
        >
          Add Course
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Add Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to add the following course?</p>
          {selectedCourseDetails && (
            <div>
              <p><strong>Course Code:</strong> {selectedCourseDetails.courseCode}</p>
              <p><strong>Course Name:</strong> {selectedCourseDetails.courseName}</p>
              <p><strong>Section:</strong> {selectedSection}</p>
              <p><strong>Semester:</strong> {selectedCourseDetails.semester}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmAddCourse}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

AddCourseForm.propTypes = {
  courses: PropTypes.array.isRequired,
  fetchCourses: PropTypes.func.isRequired,
};

export default AddCourseForm;