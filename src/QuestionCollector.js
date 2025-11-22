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
  const [showExport, setShowExport] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);

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

  function removeQuestion(i) {
    setQuestions((qs) => qs.filter((_, idx) => idx !== i));
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

      <div style={{ marginTop: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <h3 style={{ margin: 0 }}>Saved Questions ({questions.length})</h3>
          <button
            type="button"
            onClick={() => setShowQuestions(!showQuestions)}
          >
            {showQuestions ? "Hide" : "Show"}
          </button>
        </div>
        {showQuestions && (
          <>
            {questions.length === 0 && <div>No questions yet</div>}
            <ol>
              {questions.map((q, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <div>
                    <strong>{q.question}</strong>
                  </div>
                  <ul>
                    {q.answers.map((ans, ai) => (
                      <li
                        key={ai}
                        style={{
                          color:
                            ai === q.correctAnswerIndex ? "green" : "inherit",
                        }}
                      >
                        {ans} {ai === q.correctAnswerIndex ? "(correct)" : ""}
                      </li>
                    ))}
                  </ul>
                  <button type="button" onClick={() => removeQuestion(i)}>
                    Remove
                  </button>
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <button type="button" onClick={() => setShowExport((s) => !s)}>
          {showExport ? "Hide JSON" : "Show JSON"}
        </button>
        <button
          type="button"
          onClick={async () => {
            const payload = JSON.stringify(questions, null, 2);
            try {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(payload);
              } else {
                const ta = document.createElement("textarea");
                ta.value = payload;
                ta.style.position = "fixed";
                ta.style.left = "-9999px";
                document.body.appendChild(ta);
                ta.select();
                document.execCommand("copy");
                document.body.removeChild(ta);
              }
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch (err) {
              console.error("Copy failed", err);
              alert("Unable to copy JSON to clipboard");
            }
          }}
          disabled={questions.length === 0}
          style={{ marginLeft: 8 }}
        >
          Copy JSON
        </button>
        <button
          type="button"
          onClick={() => {
            const payload = JSON.stringify(questions, null, 2);
            const blob = new Blob([payload], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "questions.json";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }}
          disabled={questions.length === 0}
          style={{ marginLeft: 8 }}
        >
          Download JSON
        </button>
        <label style={{ marginLeft: 8 }}>
          <input
            type="file"
            accept=".json,application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const reader = new FileReader();
              reader.onload = (event) => {
                try {
                  const parsed = JSON.parse(event.target.result);
                  if (!Array.isArray(parsed)) {
                    alert("Invalid JSON: expected an array of questions");
                    return;
                  }

                  // Validate structure
                  const valid = parsed.every(
                    (q) =>
                      q.question &&
                      Array.isArray(q.answers) &&
                      q.answers.length >= 2 &&
                      typeof q.correctAnswerIndex === "number" &&
                      q.correctAnswerIndex >= 0 &&
                      q.correctAnswerIndex < q.answers.length
                  );

                  if (!valid) {
                    alert(
                      "Invalid JSON structure. Each question must have: question, answers (array), and correctAnswerIndex"
                    );
                    return;
                  }

                  setQuestions(parsed);
                  setShowQuestions(false);
                  alert(`Successfully imported ${parsed.length} question(s)`);
                } catch (err) {
                  console.error("Failed to parse JSON", err);
                  alert("Failed to parse JSON file. Please check the format.");
                }
              };
              reader.readAsText(file);
              e.target.value = ""; // Reset input
            }}
          />
          <button
            type="button"
            onClick={(e) => e.target.previousSibling.click()}
          >
            Upload JSON
          </button>
        </label>
        {copied && (
          <span style={{ marginLeft: 8, color: "green" }}>Copied!</span>
        )}
        {showExport && (
          <div style={{ marginTop: 8 }}>
            <h3>Exported JSON</h3>
            <pre
              style={{ background: "#f6f8fa", padding: 8, overflowX: "auto" }}
            >
              {JSON.stringify(questions, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
