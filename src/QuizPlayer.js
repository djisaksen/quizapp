import React, { useState } from "react";

export default function QuizPlayer({ questions = [], onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [copied, setCopied] = useState(false);

  if (!Array.isArray(questions) || questions.length === 0) {
    return (
      <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-3">
        No questions to play.
      </div>
    );
  }

  const q = questions[index];

  function handleSelect(i) {
    if (showAnswer) return;
    setSelected(i);
  }

  function handleSubmit() {
    if (selected === null) return;
    const correct = selected === q.correctAnswerIndex;
    if (correct) setScore((s) => s + 1);
    
    // Store user's answer
    setUserAnswers((prev) => [
      ...prev,
      {
        question: q.question,
        userAnswer: q.answers[selected],
        correctAnswer: q.answers[q.correctAnswerIndex],
        isCorrect: correct,
      },
    ]);
    
    setShowAnswer(true);
  }

  function handleNext() {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      setQuizComplete(true);
      if (onFinish) onFinish({ score, total: questions.length });
    } else {
      setIndex(nextIndex);
      setSelected(null);
      setShowAnswer(false);
    }
  }

  function handleRestart() {
    setIndex(0);
    setSelected(null);
    setShowAnswer(false);
    setScore(0);
    setQuizComplete(false);
    setUserAnswers([]);
  }

  async function handleCopyResults() {
    const resultsData = {
      score: score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      answers: userAnswers,
      completedAt: new Date().toISOString(),
    };
    
    const jsonString = JSON.stringify(resultsData, null, 2);
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(jsonString);
      } else {
        const ta = document.createElement("textarea");
        ta.value = jsonString;
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
      alert("Unable to copy results to clipboard");
    }
  }

  function handleDownloadResults() {
    const resultsData = {
      score: score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      answers: userAnswers,
      completedAt: new Date().toISOString(),
    };
    
    const jsonString = JSON.stringify(resultsData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Results Screen
  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="mt-3 sm:mt-4 p-4 sm:p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Quiz Complete! 🎉</h2>
          <div className="text-4xl sm:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {score} / {questions.length}
          </div>
          <div className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400">
            {percentage}%
          </div>
        </div>

        {/* Performance Message */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
          <p className="text-center text-lg">
            {percentage >= 90 && "🌟 Excellent work! You have a strong understanding of AI!"}
            {percentage >= 75 && percentage < 90 && "👏 Great job! You have a solid grasp of AI concepts!"}
            {percentage >= 60 && percentage < 75 && "👍 Good effort! Review the topics below to improve."}
            {percentage < 60 && "📚 Keep learning! Focus on the areas where you struggled."}
          </p>
        </div>

        {/* Detailed Results */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Detailed Results</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userAnswers.map((answer, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  answer.isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                    : "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
                }`}
              >
                <div className="font-semibold mb-2 flex items-start gap-2">
                  <span className={answer.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                    {answer.isCorrect ? "✓" : "✗"}
                  </span>
                  <span>{i + 1}. {answer.question}</span>
                </div>
                <div className="ml-6 text-sm">
                  <div>
                    <span className="font-medium">Your answer: </span>
                    <span className={answer.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {answer.userAnswer}
                    </span>
                  </div>
                  {!answer.isCorrect && (
                    <div className="mt-1">
                      <span className="font-medium">Correct answer: </span>
                      <span className="text-green-600 dark:text-green-400">
                        {answer.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRestart}
            className="flex-1 min-w-[140px] px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Take Quiz Again
          </button>
          <button
            onClick={handleCopyResults}
            className="flex-1 min-w-[140px] px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            {copied ? "✓ Copied!" : "Copy Results JSON"}
          </button>
          <button
            onClick={handleDownloadResults}
            className="flex-1 min-w-[140px] px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            Download Results JSON
          </button>
        </div>
      </div>
    );
  }

  // Quiz Playing Screen
  return (
    <div className="mt-3 sm:mt-4 p-3 sm:p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-3 sm:mb-4 text-sm sm:text-base">
        <strong>
          Question {index + 1} / {questions.length}
        </strong>
        <span>Score: {score}</span>
      </div>

      <div className="mb-3 sm:mb-4">
        <div className="font-semibold text-sm sm:text-base">{q.question}</div>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        {q.answers.map((ans, i) => {
          const isSelected = i === selected;
          const isCorrect = i === q.correctAnswerIndex;
          const showCorrect = showAnswer && isCorrect;
          const showWrong = showAnswer && isSelected && !isCorrect;
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`text-left px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded border transition-colors ${
                showCorrect
                  ? "bg-green-100 dark:bg-green-900 border-green-500 dark:border-green-400"
                  : showWrong
                  ? "bg-red-100 dark:bg-red-900 border-red-500 dark:border-red-400"
                  : isSelected
                  ? "bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-400"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              } ${showAnswer ? "cursor-default" : "cursor-pointer"}`}
              disabled={showAnswer}
            >
              {ans}
            </button>
          );
        })}
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
        {!showAnswer ? (
          <button
            onClick={handleSubmit}
            disabled={selected === null}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        ) : (
          <>
            <div className="flex items-center text-sm sm:text-base">
              {selected === q.correctAnswerIndex ? (
                <span className="text-green-600 dark:text-green-400 font-semibold">
                  ✓ Correct
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400 font-semibold">
                  ✗ Incorrect
                </span>
              )}
            </div>
            <button
              onClick={handleNext}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {index + 1 >= questions.length ? "Finish" : "Next"}
            </button>
          </>
        )}

        <button
          onClick={handleRestart}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Restart
        </button>
      </div>
    </div>
  );
}