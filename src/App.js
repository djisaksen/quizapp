import React, { useState, useEffect } from "react";
import QuestionCollector from "./QuestionCollector";
import QuizPlayer from "./QuizPlayer";

function App() {
  const [collected, setCollected] = useState(() => {
    try {
      const saved = localStorage.getItem("quizapp:questions");
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Failed to load questions", err);
      return [];
    }
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [showSavedQuestions, setShowSavedQuestions] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleCopyJSON = async () => {
    const payload = JSON.stringify(collected, null, 2);
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
  };

  const handleDownloadJSON = () => {
    const payload = JSON.stringify(collected, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUploadJSON = (e) => {
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

        // Update collected questions directly
        setCollected(parsed);
        alert(`Successfully imported ${parsed.length} question(s)`);
      } catch (err) {
        console.error("Failed to parse JSON", err);
        alert("Failed to parse JSON file. Please check the format.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Navbar */}
      <nav className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Q & Ai</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                {collected.length}{" "}
                {collected.length === 1 ? "Question" : "Questions"}
              </span>

              <button
                onClick={() => setShowSavedQuestions(!showSavedQuestions)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Questions
              </button>

              <button
                onClick={handleCopyJSON}
                disabled={collected.length === 0}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? "✓ Copied!" : "Copy JSON"}
              </button>

              <button
                onClick={handleDownloadJSON}
                disabled={collected.length === 0}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Download JSON
              </button>

              <label>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleUploadJSON}
                />
                <span className="inline-block px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                  Upload JSON
                </span>
              </label>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? "☀️" : "🌙"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Saved Questions Display */}
      {showSavedQuestions && (
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h3 className="text-lg font-semibold mb-3">Question Collector</h3>
            <QuestionCollector onChange={setCollected} />

            {collected.length > 0 && (
              <>
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-3">
                    Saved Questions ({collected.length})
                  </h3>
                  <ol className="space-y-3">
                    {collected.map((q, i) => (
                      <li
                        key={i}
                        className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="font-semibold mb-2">
                          {i + 1}. {q.question}
                        </div>
                        <ul className="ml-4 space-y-1">
                          {q.answers.map((ans, ai) => (
                            <li
                              key={ai}
                              className={
                                ai === q.correctAnswerIndex
                                  ? "text-green-600 dark:text-green-400"
                                  : ""
                              }
                            >
                              {ans}{" "}
                              {ai === q.correctAnswerIndex ? "(correct)" : ""}
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-5">
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Play Quiz</h2>
          <QuizPlayer questions={collected} />
        </div>
      </div>
    </div>
  );
}

export default App;
