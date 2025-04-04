import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Badge, Image, ListGroup } from 'react-bootstrap';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:5001/templates/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch recipe');
        const data = await res.json();
        setRecipe(data);
      } catch (err) {
        console.error('Error fetching recipe:', err);
      }
    };
    console.log("Fetching recipe with ID:", id);

    fetchRecipe();
  }, [id]);

  if (!recipe) return <Container className="mt-4">Loading...</Container>;

  return (
    <Container className="mt-4">
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>

      <div className="mb-3">
        {recipe.categories?.map((cat, idx) => (
          <Badge key={idx} bg="info" className="me-2">
            {cat}
          </Badge>
        ))}
        {!recipe.isPublic && (
          <Badge bg="secondary" className="ms-2">Private</Badge>
        )}
      </div>

      {recipe.image && (
        <Image
          src={recipe.image}
          alt={recipe.title}
          fluid
          rounded
          className="mb-4"
          style={{ maxHeight: '350px', objectFit: 'cover' }}
        />
      )}

      <h5>🥬 Ingredients</h5>
      <ListGroup className="mb-4">
        {recipe.ingredients?.map((ing, idx) => (
          <ListGroup.Item key={idx}>
            {ing.name} - {ing.quantity} {ing.unit}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h5>🧑‍🍳 Steps</h5>
      <ListGroup numbered className="mb-4">
        {recipe.steps?.map((step, idx) => (
          <ListGroup.Item key={idx}>{step}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RecipeDetail;
