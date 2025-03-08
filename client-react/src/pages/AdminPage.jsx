import React, { useContext, useEffect, useState, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AdminNavbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import SearchStudentForm from '../components/SearchStudentForm';
import UpdateStudentForm from '../components/UpdateStudentForm';
import SearchingResultTable from '../components/SearchingResultTable';
import SearchCourseForm from '../components/SearchCourseForm';
import CourseStudentsTable from '../components/CourseStudentsTable';
import CourseTable from '../components/CourseTable';
import './AdminPage.css';

const AdminPage = () => {
  const { signOut } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedFunction, setSelectedFunction] = useState('Dashboard');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [studentNumber, setStudentNumber] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseStudents, setCourseStudents] = useState([]);
  const initialStudentState = {
    studentNumber: '',
    firstName: '',
    lastName: '',
    Address: '',
    City: '',
    phoneNumber: '',
    email: '',
    program: '',
    favoriteCourse: '',
    technicalSkills: '',
    password: '',
    isAdmin: false
  };
  const [newStudent, setNewStudent] = useState(initialStudentState);

  const sessionTimeoutRef = useRef(null);

  useEffect(() => {
    const functionFromUrl = searchParams.get('function') || 'Dashboard';
    setSelectedFunction(functionFromUrl);

    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:5001/students', {
          credentials: 'include',
        });
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/courses', {
          credentials: 'include',
        });
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchStudents();
    fetchCourses();
    startSessionTimer();

    return () => {
      clearSessionTimer();
    };
  }, [searchParams]);

  const startSessionTimer = () => {
    clearSessionTimer();
    const timeout = setTimeout(() => {
      signOut();
    }, 3600000);
    sessionTimeoutRef.current = timeout;
  };

  const clearSessionTimer = () => {
    const timeout = sessionTimeoutRef.current;
    if (timeout) {
      clearTimeout(timeout);
    }
  };

  const handleUserActivity = () => {
    startSessionTimer();
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearSessionTimer();
    };
  }, []);

  const handleNavClick = (functionName) => {
    setSelectedFunction(functionName);
    setSearchParams({ function: functionName });
    setStudentNumber('');
    setSelectedStudent(null);
    setCourseCode('');
    setCourseStudents([]);
    setSelectedCourse(null);
    if (functionName !== 'Create a Student') {
      setNewStudent(initialStudentState);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewStudent({ ...newStudent, [name]: type === 'checkbox' ? checked : value });
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent),
        credentials: 'include'
      });
      if (response.ok) {
        const createdStudent = await response.json();
        setStudents([...students, createdStudent]);
        setNewStudent(initialStudentState);
        handleNavClick('List All Students');
      } else {
        console.error('Error creating student');
      }
    } catch (error) {
      console.error('Error creating student:', error);
    }
  };

  const handleDeleteStudent = async () => {
    if (!selectedStudent) return;
    try {
      const response = await fetch(`http://localhost:5001/students/${selectedStudent._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setStudents(students.filter(student => student._id !== selectedStudent._id));
        setSelectedStudent(null);
      } else {
        console.error('Error deleting student');
      }
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      const response = await fetch(`http://localhost:5001/api/courses/${selectedCourse._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setCourses(courses.filter(course => course._id !== selectedCourse._id));
        setSelectedCourse(null);
      } else {
        console.error('Error deleting course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleSearchStudent = async () => {
    try {
      const response = await fetch(`http://localhost:5001/students/search/${studentNumber}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const student = await response.json();
        setSelectedStudent(student);
        setNewStudent(student);
      } else {
        console.error('Student not found');
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

  const handleSearchCourse = async () => {
    try {
        const response = await fetch(`http://localhost:5001/api/courses/${courseCode}/students`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Students in course:', data);
            setCourseStudents(data.students || []);
        } else {
            console.error('Error fetching students for course');
            setCourseStudents([]);
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        setCourseStudents([]);
    }
};
  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/students/${selectedStudent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStudent),
        credentials: 'include'
      });
      if (response.ok) {
        const updatedStudent = await response.json();
        setStudents(students.map(student => (student._id === updatedStudent._id ? updatedStudent : student)));
        setSelectedStudent(null);
        setNewStudent(initialStudentState);
        setStudentNumber('');
        setSelectedFunction('Dashboard');
        setSearchParams({ function: 'Dashboard' });
        console.log('Student updated successfully');
      } else {
        console.error('Error updating student');
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  return (
    <div>
      <AdminNavbar signOut={signOut} />
      <div className="main-container">
        <Container fluid>
          <Row>
            <Col md={2} className="sidebar">
              <Sidebar handleNavClick={handleNavClick} />
            </Col>
            <Col md={10} className="dashboard">
              <h2>{selectedFunction}</h2>
              {selectedFunction === 'List All Students' && (
                <StudentTable
                  students={students}
                  setSelectedStudent={setSelectedStudent}
                  handleDeleteStudent={handleDeleteStudent}
                  selectedStudent={selectedStudent}
                />
              )}
              {selectedFunction === 'Create a Student' && (
                <StudentForm
                  newStudent={newStudent}
                  handleInputChange={handleInputChange}
                  handleCreateStudent={handleCreateStudent}
                />
              )}
              {selectedFunction === 'Update a Student' && (
                <div>
                  <SearchStudentForm
                    studentNumber={studentNumber}
                    setStudentNumber={setStudentNumber}
                    handleSearchStudent={handleSearchStudent}
                  />
                  {selectedStudent && (
                    <div>
                      <h3>Student Information</h3>
                      <SearchingResultTable student={selectedStudent} />
                      <UpdateStudentForm
                        currentStudent={selectedStudent}
                        newStudent={newStudent}
                        handleInputChange={handleInputChange}
                        handleUpdateStudent={handleUpdateStudent}
                      />
                    </div>
                  )}
                </div>
              )}
              {selectedFunction === 'Students by Course' && (
                <div>
                  <SearchCourseForm
                    courseCode={courseCode}
                    setCourseCode={setCourseCode}
                    handleSearchCourse={handleSearchCourse}
                  />
                  {courseStudents.length > 0 && (
                    <div className="mt-4">
                      <h3>Students in Course</h3>
                      <CourseStudentsTable students={courseStudents} />
                    </div>
                  )}
                </div>
              )}
              {selectedFunction === 'List All Courses' && (
                <CourseTable
                  courses={courses}
                  setSelectedCourse={setSelectedCourse}
                  handleDeleteCourse={handleDeleteCourse}
                  selectedCourse={selectedCourse}
                />
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AdminPage;