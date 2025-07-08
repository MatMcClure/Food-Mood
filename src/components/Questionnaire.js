import React, { useState } from 'react';
import Result from './Result';
import '../style.css';

const questions = [
  {
    id: 1,
    question: "What are you in the mood for?",
    options: ["Savory", "Sweet", "Healthy", "Comfort Food"],
  },
  {
    id: 2,
    question: "What time of day is it?",
    options: ["Breakfast", "Lunch", "Dinner", "Snack"],
  },
  {
    id: 3,
    question: "Any dietary preferences?",
    options: ["None", "Vegetarian", "Vegan", "Gluten-Free"],
  }
];

export default function Questionnaire() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [location, setLocation] = useState('');
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (choice) => {
    const updated = [...answers, choice];
    setAnswers(updated);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setShowLocationInput(true); // Show location input after last question
    }
  };

  const handleLocationSubmit = () => {
    if (location.trim() !== '') {
      setShowResults(true);
    }
  };

  if (showResults) {
    return <Result answers={answers} location={location} />;
  }

  if (showLocationInput) {
    return (
      <div className="questionnaire-container">
        <div className="question-box">
          <h2 className="question-text">Enter your city or zip code to find nearby restaurants:</h2>
          <input
            type="text"
            placeholder="e.g. New York or 10001"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="location-input"
          />
          <button onClick={handleLocationSubmit} className="option-button">See Results</button>
        </div>
      </div>
    );
  }

  const current = questions[step];

  return (
    <div className="questionnaire-container">
      <div className="question-box">
        <h2 className="question-text">{current.question}</h2>
        <div className="options-grid">
          {current.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="option-button"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
