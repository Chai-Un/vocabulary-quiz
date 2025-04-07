import { Card } from 'antd';
import { QuizQuestion as QuizQuestionType } from '../types';

interface QuizQuestionProps {
  question: QuizQuestionType;
  onAnswer: (questionIndex: number, answer: string) => void;
  questionNumber: number;
  questionIndex: number;
  selectedAnswer?: string;
}

const QuizQuestion = ({
  question,
  onAnswer,
  questionNumber,
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
          {question.wordData.wordClass && (
            <span className="text-gray-500 ml-1">({question.wordData.wordClass})</span>
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, optIndex) => (
            <div key={optIndex} className="h-full">
              <div
                className={`option-card ${selectedAnswer === option.meaning ? 'selected' : ''}`}
                onClick={() => handleSelectOption(option.meaning)}
              >
                <div className="card-body">
                  <div className="option-title">
                    {String.fromCharCode(65 + optIndex)}. <strong>{option.meaning}</strong>
                  </div>
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
