// src/App.js
import React, { useState } from 'react';
import Questionnaire from './components/Questionnaire';
import RecommendationList from './components/RecommendationList';
import logo from './images/Logo/logo.png';
import './style.css';


function App() {
  const [recommendations, setRecommendations] = useState(null);

  const handleSubmit = async (answers) => {
    const prompt = `Suggest 3 meals and restaurants for someone who is ${answers.dietary}, wants ${answers.cuisine} cuisine, craves ${answers.craving}, and has a ${answers.budget} budget.`;

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json();
    setRecommendations(data.choices[0].message.content);
  };

  return (
    <div className="App">
      <img src={logo} alt="Food Mood Logo" className="Logo" />
      <Questionnaire onSubmit={handleSubmit} />
      {recommendations && <RecommendationList text={recommendations} />}
    </div>
  );
}

export default App;
