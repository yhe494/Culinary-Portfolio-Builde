import React from 'react';
import { Form, Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const SearchStudentForm = ({ studentNumber, setStudentNumber, handleSearchStudent }) => {
  return (
    <Form onSubmit={(e) => { e.preventDefault(); handleSearchStudent(); }}>
      <Form.Group controlId="formStudentNumber">
        <Form.Label>Student Number</Form.Label>
        <Form.Control
          type="text"
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className='submit-button'>
        Search Student
      </Button>
    </Form>
  );
};

SearchStudentForm.propTypes = {
  studentNumber: PropTypes.string.isRequired,
  setStudentNumber: PropTypes.func.isRequired,
  handleSearchStudent: PropTypes.func.isRequired,
};

export default SearchStudentForm;