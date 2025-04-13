import { useContext } from 'react';
import { Navbar, Nav, Container, Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signout } from '../api/api';

const AppNavbar = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  console.log(localStorage.getItem('token')); 

  const handleLogout = async () => {
    try {
      await signout();
      setUser(null);
      localStorage.removeItem('token');
      navigate('/');
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
