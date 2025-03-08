import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const AddCourseModal = ({ showModal, handleCloseModal, handleConfirmAddCourse, selectedCourseDetails, selectedSection }) => {
  return (
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
  );
};

AddCourseModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleCloseModal: PropTypes.func.isRequired,
  handleConfirmAddCourse: PropTypes.func.isRequired,
  selectedCourseDetails: PropTypes.object,
  selectedSection: PropTypes.string.isRequired,
};

export default AddCourseModal;