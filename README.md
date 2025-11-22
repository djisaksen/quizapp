# Quiz App

A modern, feature-rich quiz application built with React that allows you to create, manage, and play custom quizzes with an intuitive interface.

## Features

### 🎯 Question Management
- **Create Questions**: Add multiple-choice questions with customizable answers
- **Mark Correct Answers**: Select the correct answer for each question using radio buttons
- **Dynamic Answers**: Add or remove answer options as needed
- **Auto-Save**: Questions are automatically saved to localStorage
- **Cross-Tab Sync**: Changes sync across multiple browser tabs

### 📦 Import/Export
- **JSON Export**: Download your questions as a JSON file
- **JSON Import**: Upload previously exported question sets
- **Copy to Clipboard**: Quick copy of questions in JSON format
- **View Saved Questions**: Display all saved questions in a formatted list

### 🎮 Quiz Player
- **Interactive Gameplay**: Click answers to select your choice
- **Instant Feedback**: See correct/incorrect answers highlighted after submission
- **Score Tracking**: Real-time score display throughout the quiz
- **Progress Indicator**: Know which question you're on and how many remain
- **Restart Option**: Reset and replay the quiz anytime

### 🎨 User Interface
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Navbar**: Quick access to all main features
- **Collapsible Sections**: Hide/show the question collector when not needed
- **Modern Design**: Clean, intuitive interface with Tailwind CSS
- **Question Counter**: See how many questions are loaded at a glance

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quiz-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Creating Questions

1. Enter your question text in the input field
2. Add answer options (minimum 2 required)
3. Select the correct answer using the radio button
4. Click "Save Question" to add it to your quiz
5. Repeat to create multiple questions

### Managing Questions

- **View Questions**: Click the "Show" button in the navbar to see all saved questions
- **Hide Collector**: When questions are loaded, click "Hide Question Collector" to focus on playing
- **Export**: Click "Download JSON" to save your questions
- **Import**: Click "Upload JSON" to load a question set from a file
- **Copy**: Click "Copy JSON" to copy questions to your clipboard

### Playing the Quiz

1. Navigate to the "Play Quiz" section
2. Read the question and select your answer
3. Click "Submit" to check if you're correct
4. Click "Next" to continue or "Finish" after the last question
5. Use "Restart" to play again from the beginning

## JSON Format

Questions are stored in the following JSON format:

```json
[
  {
    "question": "What is the capital of France?",
    "answers": ["London", "Berlin", "Paris", "Madrid"],
    "correctAnswerIndex": 2
  }
]
```

- `question`: The question text (string)
- `answers`: Array of answer options (minimum 2)
- `correctAnswerIndex`: Index of the correct answer (0-based)

## Technologies Used

- **React 19.2.0**: Core framework
- **Tailwind CSS**: Styling and responsive design
- **localStorage**: Data persistence
- **React Hooks**: State management (useState, useEffect, useRef)

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- localStorage API
- FileReader API
- Clipboard API

## Features in Detail

### localStorage Persistence
- Questions are automatically saved to localStorage
- Data persists across browser sessions
- Debounced saves prevent excessive writes
- Cross-tab synchronization keeps data consistent

### Dark Mode
- System-wide dark mode toggle
- Preference saved to localStorage
- Smooth transitions between themes
- Applies to all UI elements

### Collapsible UI
- Question collector can be hidden when quiz is loaded
- Saved questions view toggles on/off
- Keeps interface clean and focused

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

This project is open source and available under the MIT License.

## Future Enhancements

Potential features for future versions:
- Timer for timed quizzes
- Shuffle questions and answers
- Results history
- Share quiz links
- Detailed score analytics

---

Made with ❤️ using React
