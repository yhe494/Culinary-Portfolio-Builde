import React, { useEffect, useState } from 'react';
import { Container, Button, Card, Row, Col } from 'react-bootstrap';
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
        <Button variant="primary" onClick={() => navigate('/recipes/create')}>
          + Create Recipe
        </Button>
      </div>

      <Row>
        {recipes.map((recipe) => (
          <Col md={4} key={recipe._id} className="mb-4">
            <Card
              onClick={() => navigate(`/recipes/${recipe._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Card.Img
                variant="top"
                src={recipe.image || 'https://via.placeholder.com/300x200'}
                alt={recipe.title}
              />
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text>
                  {recipe.description?.length > 100
                    ? recipe.description.slice(0, 100) + '...'
                    : recipe.description}
                </Card.Text>
                <p className="text-muted">
                  ❤️ {recipe.likesCount ?? 0} | ⭐ {recipe.averageRating ?? 0}/5
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RecipeList;
