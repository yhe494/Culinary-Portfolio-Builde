import React, { useEffect, useState } from 'react';
import { Container, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/templates', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch templates');
        }

        const data = await res.json();
        setRecipes(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTemplates();
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🍽 Recipes</h2>
        <Button variant="primary" onClick={() => navigate('/creator/create')}>
          + Create Recipe
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th style={{ width: "80px" }}>No</th>
            <th>Title</th>
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
              <td>{recipe.likesCount ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default RecipeList;
