import React, { useContext, useState, useEffect, useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import StudentNavbar from '../components/StudentNavbar';
import StudentSidebar from '../components/StudentSidebar';
import StudentProfile from '../components/StudentProfile';
import AddCourseForm from '../components/AddCourseForm';
import StudentCoursesTable from '../components/StudentCoursesTable';
import DropCourseForm from '../components/DropCourseForm';
import UpdateCourseForm from '../components/UpdateCourseForm';
import './StudentPage.css';

const StudentPage = () => {
  const { signOut } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFunction, setSelectedFunction] = useState('Profile');
  const [studentProfile, setStudentProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studentCourses, setStudentCourses] = useState([]);

  useEffect(() => {
    const functionParam = searchParams.get('function');
    if (functionParam) {
      setSelectedFunction(functionParam);
    } else {
      setSelectedFunction('Profile');
    }
  }, [searchParams]);

  const handleNavClick = (functionName) => {
    setSelectedFunction(functionName);
    setSearchParams({ function: functionName });
  };

  const fetchStudentProfile = async () => {
    try {
      const response = await fetch('http://localhost:5001/read_cookie', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched profile data:', data); 
        setStudentProfile(data.user);
      } else {
        console.error('Error fetching student profile:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
    }
  };

  const fetchCourses = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/courses', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Error fetching courses:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }, []);

  const fetchStudentCourses = useCallback(async () => {
    try {
        const cookieToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1];
        const token = cookieToken || localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        const response = await fetch('http://localhost:5001/api/student/courses', {
            credentials: 'include',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to fetch student courses');
        }

        const data = await response.json();
        console.log('Fetched student courses:', data);
        setStudentCourses(data);
    } catch (error) {
        console.error('Error fetching student courses:', error);
    }
}, []);

  useEffect(() => {
    if (selectedFunction === 'Profile') {
      fetchStudentProfile();
    }
    if (selectedFunction === 'Add a Course') {
      fetchCourses();
    }
    if (selectedFunction === 'Update a Course' || selectedFunction === 'List all courses taking' || selectedFunction === 'Drop a Course') {
      fetchStudentCourses();
    }
  }, [selectedFunction, fetchCourses, fetchStudentCourses]);

  return (
    <div className="student-page">
      <StudentNavbar signOut={signOut} />
      <div className="main-container">
        <Container fluid>
          <Row>
            <Col md={2} className="sidebar">
              <StudentSidebar handleNavClick={handleNavClick} />
            </Col>
            <Col md={10} className="dashboard">
              {selectedFunction !== 'Profile' && (
                <h2 className='dashboard-title'>{selectedFunction}</h2>
              )}
              {selectedFunction === 'Profile' && studentProfile && (
                <StudentProfile studentProfile={studentProfile} />
              )}
              {selectedFunction === 'Add a Course' && (
                <AddCourseForm courses={courses} fetchCourses={fetchCourses} />
              )}
              {selectedFunction === 'List all courses taking' && (
                <StudentCoursesTable studentCourses={studentCourses} />
              )}
              {selectedFunction === 'Drop a Course' && (
                <DropCourseForm studentCourses={studentCourses} fetchStudentCourses={fetchStudentCourses} />
              )}
              {selectedFunction === 'Update a Course' && (
                <UpdateCourseForm studentCourses={studentCourses} fetchStudentCourses={fetchStudentCourses} />
              )}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default StudentPage;