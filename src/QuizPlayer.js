import React, { useState } from "react";

export default function QuizPlayer({ questions = [], onFinish }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

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
    setShowAnswer(true);
  }

  function handleNext() {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
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
  }

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
