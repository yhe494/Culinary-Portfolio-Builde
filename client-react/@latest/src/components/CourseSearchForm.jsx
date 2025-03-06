import React from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CourseSearchForm = ({ courseCode, setCourseCode, handleSearchCourse }) => {
  return (
    <Form onSubmit={(e) => { e.preventDefault(); handleSearchCourse(); }}>
      <Form.Group controlId="formCourseCode">
        <Form.Label>Course Code</Form.Label>
        <Form.Control
          type="text"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          placeholder="Enter course code"
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="submit-button">
        Search Course
      </Button>
    </Form>
  );
};

CourseSearchForm.propTypes = {
  courseCode: PropTypes.string.isRequired,
  setCourseCode: PropTypes.func.isRequired,
  handleSearchCourse: PropTypes.func.isRequired,
};

export default CourseSearchForm;