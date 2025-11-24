import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "quizapp:questions";

function AnswerInput({
  answer,
  index,
  onChange,
  onRemove,
  isCorrect,
  onSetCorrect,
}) {
  return (
    <div
      style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}
    >
      <input
        type="text"
        placeholder={`Answer ${index + 1}`}
        value={answer}
        onChange={(e) => onChange(index, e.target.value)}
        style={{ flex: 1 }}
      />
      <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type="radio"
          name="correct"
          checked={isCorrect}
          onChange={() => onSetCorrect(index)}
        />
        Correct
      </label>
      <button type="button" onClick={() => onRemove(index)}>
        Remove
      </button>
    </div>
  );
}

export default function QuestionCollector({ onChange }) {
  const [questionText, setQuestionText] = useState("");
  const [answers, setAnswers] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const saveTimeout = useRef(null);

  // Load saved questions from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setQuestions(parsed);
      }
    } catch (err) {
      console.error("Failed to read saved questions from localStorage", err);
    }
  }, []);

  // Persist questions to localStorage (debounced)
  useEffect(() => {
    try {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
        } catch (err) {
          console.error("Failed to save questions to localStorage", err);
        }
      }, 300);
      return () => clearTimeout(saveTimeout.current);
    } catch (err) {
      console.error(err);
    }
  }, [questions]);

  // Cross-tab sync: listen for storage events
  useEffect(() => {
    function onStorage(e) {
      if (e.key === STORAGE_KEY) {
        try {
          const parsed = JSON.parse(e.newValue || "[]");
          setQuestions(Array.isArray(parsed) ? parsed : []);
        } catch (err) {
          console.error("Failed to parse storage event data", err);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (onChange) onChange(questions);
  }, [questions, onChange]);

  function updateAnswer(i, value) {
    setAnswers((a) => a.map((v, idx) => (idx === i ? value : v)));
  }

  function addAnswer() {
    setAnswers((a) => [...a, ""]);
  }

  function removeAnswer(i) {
    setAnswers((a) => a.filter((_, idx) => idx !== i));
    setCorrectIndex((ci) => (ci === i ? 0 : ci > i ? ci - 1 : ci));
  }

  function addQuestion() {
    const trimmedQ = questionText.trim();
    const cleanedAnswers = answers
      .map((a) => a.trim())
      .filter((a) => a.length > 0);
    if (!trimmedQ) {
      alert("Please enter a question");
      return;
    }
    if (cleanedAnswers.length < 2) {
      alert("Please provide at least two answers");
      return;
    }
    const correct = Math.min(correctIndex, cleanedAnswers.length - 1);
    const newQ = {
      question: trimmedQ,
      answers: cleanedAnswers,
      correctAnswerIndex: correct,
    };
    setQuestions((qs) => [...qs, newQ]);
    // reset form
    setQuestionText("");
    setAnswers(["", ""]);
    setCorrectIndex(0);
  }

  return (
    <div style={{ maxWidth: 800, margin: "16px 0" }}>
      <h2>Question Collector</h2>
      <div style={{ marginBottom: 8 }}>
        <input
          type="text"
          placeholder="Enter question text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 8 }}>
        <strong>Answers</strong>
        {answers.map((a, i) => (
          <AnswerInput
            key={i}
            index={i}
            answer={a}
            onChange={updateAnswer}
            onRemove={removeAnswer}
            isCorrect={i === correctIndex}
            onSetCorrect={setCorrectIndex}
          />
        ))}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={addAnswer}>
            Add Answer
          </button>
          <button type="button" onClick={addQuestion}>
            Save Question
          </button>
        </div>
      </div>
    </div>
  );
}
