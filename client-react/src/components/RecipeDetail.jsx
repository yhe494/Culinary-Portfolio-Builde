import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Badge, Image, ListGroup } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [creator, setCreator] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5001/templates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch recipe');
        const data = await res.json();
        setRecipe(data);
        
        // After getting recipe, fetch creator info if createdBy is available
        if (data.createdBy) {
          fetchCreatorInfo(data.createdBy);
        }
      } catch (err) {
        console.error('Error fetching recipe:', err);
      }
    };
    
    const fetchCreatorInfo = async (creatorId) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5001/users/${creatorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch creator info');
        const data = await res.json();
        setCreator(data);
      } catch (err) {
        console.error('Error fetching creator info:', err);
      }
    };
    
    console.log("Fetching recipe with ID:", id);
    fetchRecipe();
  }, [id]);

  if (!recipe) return <Container className="mt-4">Loading...</Container>;

  return (
    <Container className="mt-4">
      <div>
        <h2>{recipe.title}</h2>
        <div className="text-muted mb-3">
          {creator ? (
            <p>
              Created by: <Link to={`/user-profile/${recipe.createdBy}`} style={{ textDecoration: 'none' }}>
                {creator.firstName} {creator.lastName}
              </Link>
            </p>
          ) : (
            <p>Loading creator info...</p>
          )}
          
        
        </div>
      </div>
      
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