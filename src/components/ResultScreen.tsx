import { useEffect, useRef } from 'react';
import { Modal, Button, Progress, Typography, Row, Col, Divider } from 'antd';
import { QuizResult } from '../types';

const { Title, Text } = Typography;

interface ResultScreenProps {
  result: QuizResult;
  visible: boolean;
  onClose: () => void;
  onRetry: () => void;
}

const ResultScreen = ({ result, visible, onClose, onRetry }: ResultScreenProps) => {
  const fireworksRef = useRef<HTMLDivElement>(null);

  const getFeedback = (score: number) => {
    if (score >= 90) return 'Excellent! Your vocabulary is outstanding!';
    if (score >= 70) return 'Great job! You have a good vocabulary knowledge.';
    if (score >= 50) return 'Good effort! Keep practicing to improve.';
    return "Keep studying! You'll improve with practice.";
  };

  // Handle fireworks display
  useEffect(() => {
    // Show fireworks animation for perfect scores
    if (
      visible &&
      fireworksRef.current &&
      result.score === 100 &&
      result.unansweredQuestions.length === 0
    ) {
      fireworksRef.current.style.display = 'block';

      // Hide fireworks after 6 seconds
      const timeout = setTimeout(() => {
        if (fireworksRef.current) {
          fireworksRef.current.style.display = 'none';
        }
      }, 6000);

      return () => clearTimeout(timeout);
    }
  }, [visible, result.score, result.unansweredQuestions.length]);

  // Hide fireworks when modal closes
  const handleModalClose = () => {
    if (fireworksRef.current) {
      fireworksRef.current.style.display = 'none';
    }
    onClose();
  };

  return (
    <>
      {/* Fireworks container */}
      <div className="pyro" ref={fireworksRef}>
        <div className="before"></div>
        <div className="after"></div>
      </div>

      <Modal
        open={visible}
        onCancel={handleModalClose}
        footer={[
          <Button key="retry" type="primary" onClick={onRetry} className="btn-retry">
            Retry with New Words
          </Button>,
          <Button key="close" onClick={handleModalClose} className="btn-close">
            Close
          </Button>,
        ]}
        width={1000} // Keep width large
        title={
          <Title level={4} className="m-0">
            Quiz Results
          </Title>
        }
        className="results-modal"
      >
        {/* Compact top section with results */}
        <Row gutter={16} className="results-container">
          {/* Left side - Quiz results and circle */}
          <Col xs={24} md={10} className="results-left-col">
            <div className="results-circle-container">
              {result.score === 100 && result.unansweredQuestions.length === 0 && (
                <div className="congratulations">Perfect Score! 🎉</div>
              )}
              <Progress
                type="circle"
                percent={result.score}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': result.score > 70 ? '#87d068' : result.score > 40 ? '#faad14' : '#f5222d',
                }}
                className="result-circle"
                width={150} // Smaller circle
              />
            </div>
          </Col>

          {/* Right side - Feedback and score details */}
          <Col xs={24} md={14} className="results-right-col">
            <div className="feedback-container">
              <Text className="feedback-text">{getFeedback(result.score)}</Text>

              <div className="score-boxes">
                <div className="score-box total-questions">
                  <div className="score-number">{result.totalQuestions}</div>
                  <div className="score-label">Total Questions</div>
                </div>
                <div className="score-box correct-answers">
                  <div className="score-number">{result.correctAnswers}</div>
                  <div className="score-label">Correct Answers</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: '10px 0' }} />

        {/* Increased height for lists */}
        <Row gutter={16} className="lists-container">
          <Col xs={24} md={12} className="incorrect-answers-col">
            {result.incorrectAnswers.length > 0 && (
              <div className="answers-section">
                <Title level={5} className="section-title text-danger">
                  Incorrect Answers
                </Title>
                <div
                  className="answers-list"
                  aria-label="Incorrect answers list"
                  tabIndex={0} // Make it focusable for better accessibility
                >
                  {result.incorrectAnswers.map((item, index) => (
                    <div key={`incorrect-${index}`} className="answer-item">
                      <p>
                        <strong>{item.word}</strong> ({item.wordClass})
                      </p>
                      <p>Meaning: {item.meaning}</p>
                      <p>Meaning VN: {item.meaning_VN}</p>
                      <p>Family: {item.family.join(', ') || 'None'}</p>
                      <Divider style={{ margin: '5px 0' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Col>

          <Col xs={24} md={12} className="unanswered-questions-col">
            {result.unansweredQuestions.length > 0 && (
              <div className="answers-section">
                <Title level={5} className="section-title text-warning">
                  Unanswered Questions
                </Title>
                <div
                  className="answers-list"
                  aria-label="Unanswered questions list"
                  tabIndex={0} // Make it focusable for better accessibility
                >
                  {result.unansweredQuestions.map((item, index) => (
                    <div key={`unanswered-${index}`} className="answer-item">
                      <p>
                        <strong>{item.word}</strong> ({item.wordClass})
                      </p>
                      <p>Meaning: {item.meaning}</p>
                      <p>Meaning VN: {item.meaning_VN}</p>
                      <p>Family: {item.family.join(', ') || 'None'}</p>
                      <Divider style={{ margin: '5px 0' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ResultScreen;
