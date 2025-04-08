import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Badge,
  Image,
  ListGroup,
  Button,
} from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [hasLiked, setHasLiked] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://localhost:5001/templates/${id}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch recipe');
        const data = await res.json();
        setRecipe(data);

        const liked = data.ratings?.some(
          (r) => r.user === user?.id
        );
        setHasLiked(liked);
      } catch (err) {
        console.error('Error fetching recipe:', err);
      }
    };

    fetchRecipe();
  }, [id, user?.id]);

  const handleLike = async () => {
    if (!user || hasLiked) return;
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`http://localhost:5001/templates/${id}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ score: 5 }),
      });

      if (res.ok) {
        const updated = await res.json();
        setRecipe(updated);
        setHasLiked(true);
      } else {
        const error = await res.json();
        console.error('Rating failed:', error.message);
      }
    } catch (err) {
      console.error('Error during rating:', err);
    }
  };

  if (!recipe) return <Container className="mt-4">Loading...</Container>;

  return (
    <Container className="mt-4">
      <h2>{recipe.title}</h2>
      <p>{recipe.description}</p>

      <div className="mb-3">
        {recipe.categories?.map((cat, index) => (
          <Badge key={index} bg="info" className="me-2">
            {cat}
          </Badge>
        ))}
        {!recipe.isPublic && (
          <Badge bg="secondary" className="ms-2">
            Private
          </Badge>
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

      <div className="mb-4">
        <strong>❤️ Likes: </strong> 
        {recipe.ratingCount ?? 0}
        <div className="mt-2">
          <Button
            variant={hasLiked ? 'secondary' : 'danger'}
            onClick={handleLike}
            disabled={hasLiked}
          >
            {hasLiked ? 'You already liked this' : '❤️ Like'}
          </Button>
        </div>
      </div>

      <h5>🥬 Ingredients</h5>
      <ListGroup className="mb-4">
        {recipe.ingredients?.map((ing, index) => (
          <ListGroup.Item key={index}>
            {ing.name} - {ing.quantity} {ing.unit}
          </ListGroup.Item>
        ))}
      </ListGroup>

      <h5>🧑‍🍳 Steps</h5>
      <ListGroup numbered className="mb-4">
        {recipe.steps?.map((step, index) => (
          <ListGroup.Item key={index}>{step}</ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RecipeDetail;
