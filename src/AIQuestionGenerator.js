import React, { useState } from "react";

export default function AIQuestionGenerator({ onQuestionsGenerated }) {
  const [file, setFile] = useState(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError(null);
    } else {
      setError("Please select a valid PDF file");
      setFile(null);
    }
  };

  const generateQuestions = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress("Reading PDF...");

    try {
      // Convert PDF to base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

      setProgress("Analyzing content with AI...");

      // Call Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "document",
                  source: {
                    type: "base64",
                    media_type: "application/pdf",
                    data: base64Data,
                  },
                },
                {
                  type: "text",
                  text: `Please analyze this PDF document and generate ${numQuestions} multiple-choice quiz questions to test comprehension of the material.

Difficulty level: ${difficulty}

For each question:
- Create a clear, specific question about key concepts from the document
- Provide 4 answer options (one correct, three plausible distractors)
- Ensure the correct answer is definitively supported by the document content
- Make distractors believable but clearly incorrect

Respond ONLY with a JSON array in this exact format, with no preamble or markdown:
[
  {
    "question": "Question text here?",
    "answers": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswerIndex": 0
  }
]`,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setProgress("Processing questions...");

      // Extract text content from response
      const textContent = data.content
        .filter((item) => item.type === "text")
        .map((item) => item.text)
        .join("\n");

      // Parse JSON from response
      const jsonMatch = textContent.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error("Could not find JSON array in response");
      }

      const questions = JSON.parse(jsonMatch[0]);

      // Validate questions
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Invalid questions format received");
      }

      const validQuestions = questions.every(
        (q) =>
          q.question &&
          Array.isArray(q.answers) &&
          q.answers.length >= 2 &&
          typeof q.correctAnswerIndex === "number" &&
          q.correctAnswerIndex >= 0 &&
          q.correctAnswerIndex < q.answers.length
      );

      if (!validQuestions) {
        throw new Error("Some questions have invalid format");
      }

      setProgress(`Successfully generated ${questions.length} questions!`);
      onQuestionsGenerated(questions);

      // Reset after success
      setTimeout(() => {
        setLoading(false);
        setProgress("");
        setFile(null);
      }, 2000);
    } catch (err) {
      console.error("Error generating questions:", err);
      setError(err.message || "Failed to generate questions");
      setLoading(false);
      setProgress("");
    }
  };

  return (
    <div className="p-6 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">AI Question Generator</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Upload PDF Document
          </label>
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer disabled:opacity-50"
          />
          {file && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Selected: {file.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Number of Questions: {numQuestions}
          </label>
          <input
            type="range"
            min="3"
            max="15"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            disabled={loading}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Difficulty</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button
          onClick={generateQuestions}
          disabled={!file || loading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? "Generating..." : "Generate Questions with AI"}
        </button>

        {progress && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded text-blue-700 dark:text-blue-300 text-sm">
            {progress}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900 rounded text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
