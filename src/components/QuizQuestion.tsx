import { Card } from 'antd';
import { QuizQuestion as QuizQuestionType } from '../types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (questionIndex: number, answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
  questionIndex: number;
  selectedAnswer?: string;
}

const QuizQuestion = ({
  question,
  onAnswer,
  questionNumber,
  totalQuestions,
  questionIndex,
  selectedAnswer,
}: QuizQuestionProps) => {
  const handleSelectOption = (option: string) => {
    // Send selected answer to parent component
    onAnswer(questionIndex, option);
  };

  return (
    <div className="question mb-4">
      <Card className="shadow-sm rounded-lg">
        <p className="font-semibold mb-3">
          {questionNumber}. What is the meaning of "{question.questionWord}"?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, optIndex) => (
            <div key={optIndex}>
              <div
                className={`option-card ${selectedAnswer === option.meaning ? 'selected' : ''}`}
                onClick={() => handleSelectOption(option.meaning)}
              >
                <div className="card-body">
                  <div className="option-title">
                    {String.fromCharCode(65 + optIndex)}. <strong>{option.meaning}</strong>
                  </div>
                  <p className="option-family">
                    Family words: {option.family.join(', ') || 'None'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QuizQuestion;
