import React, { useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

function App() {
  const [questions] = useState([
    {
      question: "What is the capital of France?",
      answer: "Paris",
    },
    {
      question: "What is 2 + 2?",
      answer: "4",
    },
    {
      question: "What color is the sky on a clear day?",
      answer: "Blue",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowResult(true);

    if (
      userAnswer.trim().toLowerCase() ===
      questions[currentIndex].answer.toLowerCase()
    ) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswer("");
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  };

  const isCorrect =
    userAnswer.trim().toLowerCase() ===
    questions[currentIndex].answer.toLowerCase();

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Quiz Complete!
            </h2>
            <p className="text-gray-600">You've finished all the questions</p>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6 mb-6">
            <div className="text-5xl font-bold text-indigo-600 mb-2">
              {score}/{questions.length}
            </div>
            <p className="text-gray-700">
              {score === questions.length
                ? "Perfect score! 🌟"
                : score >= questions.length / 2
                ? "Great job! 👏"
                : "Keep practicing! 💪"}
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <RotateCcw size={20} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              Score: {score}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {questions[currentIndex].question}
          </h2>

          {!showResult ? (
            <div>
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && userAnswer.trim()) {
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your answer..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-lg mb-4"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
              >
                Submit Answer
              </button>
            </div>
          ) : (
            <div>
              <div
                className={`p-6 rounded-xl mb-4 ${
                  isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="text-green-600" size={28} />
                      <span className="text-xl font-bold text-green-800">
                        Correct!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="text-red-600" size={28} />
                      <span className="text-xl font-bold text-red-800">
                        Not quite
                      </span>
                    </>
                  )}
                </div>
                {!isCorrect && (
                  <p className="text-gray-700 mt-2">
                    The correct answer is:{" "}
                    <span className="font-bold">
                      {questions[currentIndex].answer}
                    </span>
                  </p>
                )}
              </div>

              <button
                onClick={handleNext}
                className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
              >
                {currentIndex < questions.length - 1
                  ? "Next Question"
                  : "See Results"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
