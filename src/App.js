import React, { useState } from 'react';
import QuestionCollector from './QuestionCollector';
import QuizPlayer from './QuizPlayer';

function App() {
  const [collected, setCollected] = useState([]);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Quiz App — Question Collector</h1>
      <QuestionCollector onChange={setCollected} />

      <div style={{ marginTop: 18 }}>
        <h2>Collected Questions (preview)</h2>
        <pre style={{ background: '#f6f8fa', padding: 12, maxHeight: 300, overflow: 'auto' }}>{JSON.stringify(collected, null, 2)}</pre>
      </div>

      <div style={{ marginTop: 18 }}>
        <h2>Play Quiz</h2>
        <QuizPlayer questions={collected} />
      </div>
    </div>
  );
}

export default App;

