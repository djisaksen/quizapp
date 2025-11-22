import React, { useState } from 'react';
import QuestionCollector from './QuestionCollector';
import QuizPlayer from './QuizPlayer';

function App() {
  const [collected, setCollected] = useState([]);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Quiz App
      </h1>
      <QuestionCollector onChange={setCollected} />

      

      <div style={{ marginTop: 18 }}>
        <h2>Play Quiz</h2>
        <QuizPlayer questions={collected} />
      </div>
    </div>
  );
}

export default App;
