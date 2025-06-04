import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Result({ answers }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mealIdeas, setMealIdeas] = useState([]);
  const [images, setImages] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  console.log('OpenAI Key:', process.env.REACT_APP_OPENAI_KEY);

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
        // Introduce a delay to reduce rate-limiting
        await new Promise((res) => setTimeout(res, 1000));

        // 1. OpenAI Meal Ideas
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

        // 2. Pexels Images (first meal only)
        const pexelsRes = await axios.get(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(
            meals[0]
          )}&per_page=3`,
          {
            headers: {
              Authorization: process.env.REACT_APP_PEXELS_KEY,
            },
          }
        );
        setImages(pexelsRes.data.photos);

        // 3. Yelp Restaurants (first meal)
        const yelpRes = await axios.get(
          `https://api.yelp.com/v3/businesses/search`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_YELP_KEY}`,
            },
            params: {
              term: meals[0],
              location: 'New York',
              limit: 5,
            },
          }
        );
        setRestaurants(yelpRes.data.businesses);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(
          'Something went wrong while fetching your meal recommendations. Please try again in a moment.'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [answers]);

  if (loading) {
    return <div className="p-6">Loading your meal suggestions...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Meal Ideas</h2>
      <ul className="mb-6">
        {mealIdeas.map((meal, idx) => (
          <li key={idx}>🍽️ {meal}</li>
        ))}
      </ul>

      <h2 className="text-2xl mb-4">Images from Pexels</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {images.map((img) => (
          <img
            key={img.id}
            src={img.src.medium}
            alt={img.alt}
            className="rounded shadow"
          />
        ))}
      </div>

      <h2 className="text-2xl mb-4">Nearby Restaurants</h2>
      <ul>
        {restaurants.map((res) => (
          <li key={res.id} className="mb-3">
            <strong>{res.name}</strong> – {res.location.address1} – ⭐ {res.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}
