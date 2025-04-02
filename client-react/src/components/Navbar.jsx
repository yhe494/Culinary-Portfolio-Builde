import React, { useContext } from 'react';
import { Navbar, Nav, Container, Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AppNavbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      //this response using backend domain to send request to backend directly,
      //check when the app needs to deploy, backend domain could be changed
      const response = await fetch('http://localhost:5001/signout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        setUser(null);
        localStorage.removeItem('token');
        navigate('/');
      }
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '24px' }}
        >
          Culinary Portfolio
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/portfolio')}>Portfolio</Nav.Link>
            <Nav.Link onClick={() => navigate('/recipes')}>Recipes</Nav.Link>
            <Nav.Link onClick={() => navigate('/community')}>Community</Nav.Link>
            {/* <Nav.Link onClick={() => navigate('/edit-portfolio')}>Edit Portfolio</Nav.Link> //edit portfolio page */}
           
          </Nav>

          {user && (
            <Stack direction="horizontal" gap={2}>
              <Button variant="outline-light" onClick={() => navigate('/edit-portfolio')}>
                My Profile
              </Button>
              <Button variant="outline-warning" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;