import { useState, useEffect } from 'react';
import { Button, Input, Modal } from 'antd';
import { generateQuizQuestions, calculateScore } from '../utils/quizHelpers';
import { QuizQuestion as QuizQuestionType, QuizResult, Vocabulary } from '../types';
import Header from './Header';
import QuizQuestion from './QuizQuestion';
import ResultScreen from './ResultScreen';

interface QuizAppProps {
  vocabularyData: Vocabulary[];
}

const QuizApp = ({ vocabularyData }: QuizAppProps) => {
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [quizStarted, setQuizStarted] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult>({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    score: 0,
    incorrectAnswers: [],
    unansweredQuestions: [],
  });
  const [showValidationModal, setShowValidationModal] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string>('');

  // Function to generate new questions
  const generateNewQuestions = () => {
    try {
      const generatedQuestions = generateQuizQuestions(vocabularyData, questionCount);
      setQuestions(generatedQuestions);
      setAnswers({}); // Reset answers
    } catch (error) {
      if (error instanceof Error) {
        setValidationMessage(error.message);
        setShowValidationModal(true);
      }
    }
  };

  useEffect(() => {
    if (vocabularyData.length > 0 && quizStarted) {
      generateNewQuestions();
    }
  }, [quizStarted, questionCount, vocabularyData]);

  const handleGenerateQuiz = () => {
    // Validation
    if (questionCount <= 0) {
      setValidationMessage('Number of questions must be greater than 0');
      setShowValidationModal(true);
      return;
    }

    setQuizStarted(true);
    setShowResults(false);
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuiz = () => {
    const incorrectAnswers: Vocabulary[] = [];
    const unansweredQuestions: Vocabulary[] = [];
    let correctCount = 0;

    questions.forEach((question, index) => {
      const selectedAnswer = answers[index];

      if (!selectedAnswer) {
        unansweredQuestions.push(question.wordData);
        return;
      }

      if (selectedAnswer === question.correctAnswer) {
        correctCount++;
      } else {
        incorrectAnswers.push(question.wordData);
      }
    });

    const score = calculateScore(questions.length, correctCount);

    setQuizResult({
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: incorrectAnswers.length,
      score,
      incorrectAnswers,
      unansweredQuestions,
    });

    setShowResults(true);
  };

  const closeResultPopup = () => {
    setShowResults(false);
    setQuizStarted(false);
  };

  // Fixed retry function to properly generate new questions
  const handleRetry = () => {
    setShowResults(false);
    // Keep quiz started as true but force new questions generation
    generateNewQuestions();
  };

  return (
    <div className="container mx-auto px-4">
      <Header />

      {!quizStarted ? (
        <div className="mb-6 quiz-setup">
          <label htmlFor="questionCount" className="block font-medium mb-2 question-count-label">
            Number of questions:
          </label>
          <Input
            type="number"
            id="questionCount"
            className="mb-4 question-count-input"
            value={questionCount}
            min="1"
            max="50"
            onChange={e => setQuestionCount(parseInt(e.target.value) || 0)}
          />

          <Button
            type="primary"
            className="btn-success start-quiz-btn"
            onClick={() => handleGenerateQuiz()}
          >
            Start Quiz
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6">
            {questions.map((question, index) => (
              <QuizQuestion
                key={index}
                question={question}
                questionNumber={index + 1}
                totalQuestions={questions.length}
                questionIndex={index}
                selectedAnswer={answers[index]}
                onAnswer={handleAnswerSelect}
              />
            ))}
          </div>
          <Button type="primary" className="mb-6 px-6" onClick={handleSubmitQuiz}>
            Submit
          </Button>
        </>
      )}

      <ResultScreen
        result={quizResult}
        visible={showResults}
        onClose={closeResultPopup}
        onRetry={handleRetry}
      />

      {/* Validation Error Modal */}
      <Modal
        title="Validation Error"
        open={showValidationModal}
        onCancel={() => setShowValidationModal(false)}
        footer={[
          <Button key="close" type="primary" danger onClick={() => setShowValidationModal(false)}>
            Close
          </Button>,
        ]}
      >
        <p>{validationMessage}</p>
      </Modal>
    </div>
  );
};

export default QuizApp;
