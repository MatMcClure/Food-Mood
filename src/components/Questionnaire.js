import React, { useState } from 'react';
import Result from './Result';
import '../style.css'; // Ensure this path is correct

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
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (choice) => {
    const updated = [...answers, choice];
    setAnswers(updated);

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    return <Result answers={answers} />;
  }

  const current = questions[step];

  return (
    <div className="questionnaire-container">
      <div className="question-box">
        <h2 className="question-text">{current.question}</h2>
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
  );
}
