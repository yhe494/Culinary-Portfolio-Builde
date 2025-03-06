import React from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SearchCourseForm = ({ courseCode, setCourseCode, handleSearchCourse }) => {
  return (
    <Form onSubmit={(e) => { e.preventDefault(); handleSearchCourse(); }}>
      <Form.Group controlId="formCourseCode">
        <Form.Label>Course Code</Form.Label>
        <Form.Control
          type="text"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" className='submit-button' type="submit">
        Search Course
      </Button>
    </Form>
  );
};

SearchCourseForm.propTypes = {
  courseCode: PropTypes.string.isRequired,
  setCourseCode: PropTypes.func.isRequired,
  handleSearchCourse: PropTypes.func.isRequired,
};

export default SearchCourseForm;