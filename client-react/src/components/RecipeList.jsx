import React, { useEffect, useState, useContext } from 'react';
import { Container, Button, Table, Form, InputGroup, Spinner, Alert } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

const RecipeList = () => {
  const { user } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  

  // Load all recipes initially or handle search query if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    
    if (queryParam) {
      // If there's a search query, set it and perform search
      setSearchTerm(queryParam);
      performSearch(queryParam);
    } else {
      // Otherwise load all recipes
      fetchAllRecipes();
    }
  }, [location.search]);

  const fetchAllRecipes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/templates/withAuthor', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error('Failed to fetch recipes');
      }

      const data = await res.json();
      setRecipes(data);
      setSearching(false);
    } catch (err) {
      console.error(err);
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      fetchAllRecipes();
      return;
    }
    
    setLoading(true);
    setSearching(true);
    setError('');
    
    try {
      const response = await axios.get(`http://localhost:5001/search?q=${encodeURIComponent(query)}`);
      
      // Prioritize title matches
      const sortedResults = response.data.sort((a, b) => {
        const aHasTitle = a.title.toLowerCase().includes(query.toLowerCase());
        const bHasTitle = b.title.toLowerCase().includes(query.toLowerCase());
        
        if (aHasTitle && !bHasTitle) return -1;
        if (!aHasTitle && bHasTitle) return 1;
        return 0;
      });
      
      setRecipes(sortedResults);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(searchTerm)}`);
      performSearch(searchTerm);
    } else {
      navigate('/recipes');
      fetchAllRecipes();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    navigate('/recipes');
    fetchAllRecipes();
  };
  

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🍽 Recipes</h2>
          {user && <p className="text-muted mb-0">Welcome, {user.firstName || "Chef"}!</p>}
        </div>
        <Button variant="primary" onClick={() => navigate('/creator/create')}>
          + Create Recipe
        </Button>
      </div>

      <Form onSubmit={handleSearch} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for recipes by title, ingredients, or description..."
            aria-label="Search recipes"
          />
          <Button 
            variant="outline-secondary" 
            type="submit"
            disabled={loading}
          >
            {loading && searching ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Search'
            )}
          </Button>
          {searching && (
            <Button 
              variant="outline-secondary" 
              onClick={handleClearSearch}
            >
              Clear
            </Button>
          )}
        </InputGroup>
        
      </Form>

      {error && (
        <Alert variant="danger" className="text-center mb-4">
          {error}
        </Alert>
      )}

      {searching && recipes.length === 0 && !loading && !error && (
        <Alert variant="info" className="text-center mb-4">
          No recipes found matching "{searchTerm}"
        </Alert>
      )}

      {searching && recipes.length > 0 && (
        <div className="mb-3">
          <strong>Found {recipes.length} result(s) for "{searchTerm}"</strong>
        </div>
      )}

      {loading && !searching ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading recipes...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: "80px" }}>No</th>
            <th>Title</th>
            <th style={{ width: "150px" }}>Author</th>
            <th style={{ width: "100px" }}>Likes</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <tr
              key={recipe._id}
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/recipes/${recipe._id}`)}
            >
              <td>{index + 1}</td>
              <td>{recipe.title}</td>
              <td>  {recipe.createdBy?.firstName ?? 'Unknown'} {recipe.createdBy?.lastName ?? ''}
              </td>
              <td>{recipe.ratingCount ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default RecipeList;
