import React, { useState } from 'react';

export default function QuizPlayer({ questions = [], onFinish }) {
	const [index, setIndex] = useState(0);
	const [selected, setSelected] = useState(null);
	const [score, setScore] = useState(0);
	const [showAnswer, setShowAnswer] = useState(false);

	if (!Array.isArray(questions) || questions.length === 0) {
		return <div style={{ marginTop: 12 }}>No questions to play.</div>;
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
		<div style={{ marginTop: 18, padding: 12, border: '1px solid #ddd', borderRadius: 6 }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
				<strong>Question {index + 1} / {questions.length}</strong>
				<span>Score: {score}</span>
			</div>

			<div style={{ marginBottom: 12 }}>
				<div style={{ fontWeight: 600 }}>{q.question}</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
				{q.answers.map((ans, i) => {
					const isSelected = i === selected;
					const isCorrect = i === q.correctAnswerIndex;
					const showCorrect = showAnswer && isCorrect;
					const showWrong = showAnswer && isSelected && !isCorrect;
					return (
						<button
							key={i}
							onClick={() => handleSelect(i)}
							style={{
								textAlign: 'left',
								padding: '8px 12px',
								borderRadius: 4,
								border: '1px solid #ccc',
								background: showCorrect ? '#dff0d8' : showWrong ? '#f8d7da' : isSelected ? '#eef' : '#fff',
								cursor: showAnswer ? 'default' : 'pointer'
							}}
							disabled={showAnswer}
						>
							{ans}
						</button>
					);
				})}
			</div>

			<div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
				{!showAnswer ? (
					<button onClick={handleSubmit} disabled={selected === null}>Submit</button>
				) : (
					<>
						<div style={{ alignSelf: 'center' }}>
							{selected === q.correctAnswerIndex ? (
								<span style={{ color: 'green' }}>Correct</span>
							) : (
								<span style={{ color: 'red' }}>Incorrect</span>
							)}
						</div>
						<button onClick={handleNext}>{index + 1 >= questions.length ? 'Finish' : 'Next'}</button>
					</>
				)}

				<button onClick={handleRestart}>Restart</button>
			</div>
		</div>
	);
}
