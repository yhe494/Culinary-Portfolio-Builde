import React from 'react';
import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const StudentCoursesTable = ({ studentCourses }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Course Code</th>
          <th>Course Name</th>
          <th>Section</th>
          <th>Semester</th>
        </tr>
      </thead>
      <tbody>
        {studentCourses.length > 0 ? (
          studentCourses.map(course => (
            <tr key={course._id}>
              <td>{course.courseCode}</td>
              <td>{course.courseName}</td>
              <td>{course.section}</td>
              <td>{course.semester}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4">No courses found</td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

StudentCoursesTable.propTypes = {
  studentCourses: PropTypes.array.isRequired,
};

export default StudentCoursesTable;