import React, { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const ViewPortfolio = () => {
  const { user } = useContext(AuthContext); // Get the logged-in user
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch(`http://localhost:5001/portfolio/${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setPortfolio(data);
        } else {
          console.error('Failed to fetch portfolio');
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      }
    };

    fetchPortfolio();
  }, [user.id]);

  if (!portfolio) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-5">
      <h2>{portfolio.firstName} {portfolio.lastName}'s Portfolio</h2>
      <p><strong>Bio:</strong> {portfolio.bio}</p>
      <p><strong>Website:</strong> <a href={portfolio.website} target="_blank" rel="noopener noreferrer">{portfolio.website}</a></p>
    </Container>
  );
};

export default ViewPortfolio;