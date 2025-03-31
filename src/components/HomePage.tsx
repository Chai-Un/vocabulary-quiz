import { useState } from 'react';
import { Button, Card, Radio, Space, Typography, Row, Col } from 'antd';
import { BookOutlined, SwapOutlined, LinkOutlined } from '@ant-design/icons';
import Header from './Header';
// Import the background image directly
import backgroundImage from '../assets/images/background.png';

const { Title, Text } = Typography;

export interface QuizOptions {
  type: 'vocabulary' | 'phrasal-verb' | 'prepositional-phrase';
  source?: string;
}

interface HomePageProps {
  onStartQuiz: (options: QuizOptions) => void;
}

// Define source options for vocabulary
const sourceOptions = [
  { value: '600_Essential_Words_TOEIC', label: '600 Essential Words TOEIC' },
  { value: 'Collins', label: 'Collins' },
  { value: 'Destination_B1', label: 'Destination B1' },
  { value: 'Destination_B2', label: 'Destination B2' },
];

const HomePage = ({ onStartQuiz }: HomePageProps) => {
  const [quizType, setQuizType] = useState<QuizOptions['type']>('vocabulary');
  const [source, setSource] = useState<string>('Destination_B1');

  // No need for useState and useEffect for the background image anymore

  const handleStartQuiz = () => {
    onStartQuiz({
      type: quizType,
      source: quizType === 'vocabulary' ? source : undefined,
    });
  };

  // Home page container style with background
  const homeContainerStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative' as const,
  };

  return (
    <div className="container mx-auto px-4" style={homeContainerStyle}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        <div className="quiz-setup max-w-4xl">
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} md={8}>
              <Card
                hoverable
                className={`quiz-type-card ${quizType === 'vocabulary' ? 'selected-card' : ''}`}
                onClick={() => setQuizType('vocabulary')}
              >
                <div className="text-center">
                  <BookOutlined className="text-4xl mb-4 text-blue-500" />
                  <Title level={4}>Vocabulary</Title>
                  <Text>Learn and test regular vocabulary words</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                className={`quiz-type-card ${quizType === 'phrasal-verb' ? 'selected-card' : ''}`}
                onClick={() => setQuizType('phrasal-verb')}
              >
                <div className="text-center">
                  <SwapOutlined className="text-4xl mb-4 text-green-500" />
                  <Title level={4}>Phrasal Verbs</Title>
                  <Text>Practice verbs with prepositions</Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                className={`quiz-type-card ${quizType === 'prepositional-phrase' ? 'selected-card' : ''}`}
                onClick={() => setQuizType('prepositional-phrase')}
              >
                <div className="text-center">
                  <LinkOutlined className="text-4xl mb-4 text-purple-500" />
                  <Title level={4}>Prepositional Phrases</Title>
                  <Text>Learn common prepositional expressions</Text>
                </div>
              </Card>
            </Col>
          </Row>

          {quizType === 'vocabulary' && (
            <div className="vocabulary-sources mb-8">
              <Title level={4} className="mb-4">
                Select Vocabulary Source
              </Title>
              <Radio.Group value={source} onChange={e => setSource(e.target.value)}>
                <Space direction="vertical">
                  {sourceOptions.map(option => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          )}

          <div className="text-center mt-8">
            <Button
              type="primary"
              size="large"
              onClick={handleStartQuiz}
              className="start-quiz-btn"
            >
              Continue to Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
