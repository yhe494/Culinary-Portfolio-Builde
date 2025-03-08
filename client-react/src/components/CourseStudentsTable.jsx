import { Table } from 'react-bootstrap';
import PropTypes from 'prop-types';

const CourseStudentsTable = ({ students }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Student Number</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student._id}>
            <td>{student.studentNumber}</td>
            <td>{`${student.firstName} ${student.lastName}`}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

CourseStudentsTable.propTypes = {
  students: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      studentNumber: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default CourseStudentsTable;