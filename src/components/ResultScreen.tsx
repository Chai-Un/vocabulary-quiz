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

  // Calculate how many sections have content to display
  const getVisibleSections = () => {
    let count = 0;
    if (result.totalCorrectAnswer > 0) count++;
    if (result.incorrectAnswers.length > 0) count++;
    if (result.unansweredQuestions.length > 0) count++;
    return count;
  };

  // Determine column widths based on visible sections
  const getColumnSpans = () => {
    const visibleSections = getVisibleSections();
    switch (visibleSections) {
      case 1:
        return { xs: 24, md: 24, xl: 24 }; // Full width
      case 2:
        return { xs: 24, md: 24, xl: 12 }; // Half width on xl, full on smaller
      default:
        return { xs: 24, md: 12, xl: 8 }; // Original widths
    }
  };

  const columnSpans = getColumnSpans();

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
        width="85vw"
        title={
          <Title level={4} className="m-0">
            Quiz Results
          </Title>
        }
        className="results-modal"
        centered={true}
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
                  <div className="score-number">{result.totalCorrectAnswer}</div>
                  <div className="score-label">Correct Answers</div>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Divider style={{ margin: '10px 0' }} />

        <Row gutter={16} className="lists-container">
          <Col
            xs={columnSpans.xs}
            md={columnSpans.md}
            xl={columnSpans.xl}
            className="correct-answers-col"
          >
            {result.totalCorrectAnswer > 0 && (
              <div className="answers-section">
                <Title level={5} className="section-title text-success">
                  Correct Answers
                </Title>
                <div className="answers-list" aria-label="Correct answers list">
                  {result.correctAnswers.map((item, index) => (
                    <div key={`correct-${index}`} className="answer-item">
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
          {result.incorrectAnswers.length > 0 && (
            <Col
              xs={columnSpans.xs}
              md={columnSpans.md}
              xl={columnSpans.xl}
              className="incorrect-answers-col"
            >
              <div className="answers-section">
                <Title level={5} className="section-title text-danger">
                  Incorrect Answers
                </Title>
                <div className="answers-list" aria-label="Incorrect answers list">
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
            </Col>
          )}

          {result.unansweredQuestions.length > 0 && (
            <Col
              xs={columnSpans.xs}
              md={columnSpans.md}
              xl={columnSpans.xl}
              className="unanswered-questions-col"
            >
              <div className="answers-section">
                <Title level={5} className="section-title text-warning">
                  Unanswered Questions
                </Title>
                <div className="answers-list" aria-label="Unanswered questions list">
                  {result.unansweredQuestions.map((item, index) => (
                    <div key={`unanswered-${index}`} className="answer-item">
                      <p>
                        <strong>{item.word}</strong> ({item.wordClass})
                      </p>
                      <p>Meaning: {item.meaning}</p>
                      <p>Meaning VN: {item.meaning_VN}</p>
                      <p>Family: {item.family.join(', ') || 'None'}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Modal>
    </>
  );
};

export default ResultScreen;
