import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style.css';

export default function Result({ answers, location }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mealIdeas, setMealIdeas] = useState([]);
  const [images, setImages] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const combinedPrompt = `
      You are a food assistant. Based on the following preferences:
      Mood: ${answers[0]}, Time of day: ${answers[1]}, Diet: ${answers[2]},
      suggest 3 meals a person might enjoy.
      Return only a simple list like:
        1. Chicken Burrito
        2. Avocado Toast
        3. Pad Thai
    `;

    async function fetchData() {
      try {
        await new Promise((res) => setTimeout(res, 1000)); // delay to reduce rate limiting

        const openaiRes = await axios.post(
          'https://api.openai.com/v1/chat/completions',
          {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: combinedPrompt }],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`,
            },
          }
        );

        const mealsRaw = openaiRes.data.choices[0].message.content;
        const meals = mealsRaw
          .split('\n')
          .filter((line) => line)
          .map((line) => line.replace(/^\d+\.\s*/, ''));
        setMealIdeas(meals);

        const pexelsRes = await axios.get(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            meals[0]
          )}&per_page=6`,
          {
            headers: {
              Authorization: process.env.REACT_APP_PEXELS_KEY,
            },
          }
        );
        setImages(pexelsRes.data.photos);

        const yelpRes = await axios.get(
          `https://api.yelp.com/v3/businesses/search`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_FORESQUARE_KEY}`,
            },
            params: {
              term: meals[0],
              location: location || 'New York',
              limit: 5,
            },
          }
        );
        setRestaurants(yelpRes.data.businesses);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Something went wrong while fetching your meal recommendations. Please try again in a moment.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [answers, location]);

  if (loading) {
    return <div className="result-loading">Loading your meal suggestions...</div>;
  }

  if (error) {
    return <div className="result-error">{error}</div>;
  }

  return (
    <div className="result-container">
      <div className="result-box">
        <h2 className="section-title">Meal Ideas</h2>
        <ul className="meal-list">
          {mealIdeas.map((meal, idx) => (
            <li key={idx}>🍽️ {meal}</li>
          ))}
        </ul>

        <h2 className="section-title">Images from Pexels</h2>
        <div className="image-grid">
          {images.map((img) => (
            <img
              key={img.id}
              src={img.src.medium}
              alt={img.alt}
              className="meal-image"
            />
          ))}
        </div>

        <h2 className="section-title">Nearby Restaurants</h2>
        <ul className="restaurant-list">
          {restaurants.map((res) => (
            <li key={res.id} className="restaurant-item">
              <strong>{res.name}</strong> – {res.location.address1} – ⭐ {res.rating}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
