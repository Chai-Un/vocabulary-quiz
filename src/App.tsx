import { useState, useEffect } from 'react';
import { ConfigProvider, Spin, Button } from 'antd';
import QuizApp from './components/QuizApp';
import HomePage, { QuizOptions } from './components/HomePage';
import { Vocabulary } from './types';
import themeConfig from './theme/themeConfig';

// Try to import background image, but don't fail if it doesn't exist
let backgroundImage: string | undefined;
(async () => {
  try {
    const image = await import('./assets/images/background.png');
    backgroundImage = image.default;
  } catch (error) {
    // Background image not found, will use fallback styling
    console.info('Background image not found. Using default background.');
  }
})();

function App() {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentView, setCurrentView] = useState<'home' | 'quiz'>('home');
  const [quizOptions, setQuizOptions] = useState<QuizOptions | null>(null);

  // Function to start the quiz
  const handleStartQuiz = (options: QuizOptions) => {
    setQuizOptions(options);
    setLoading(true);
    setCurrentView('quiz');
    loadVocabularyData(options);
  };

  // Function to return to home
  const handleReturnHome = () => {
    setCurrentView('home');
    setVocabulary([]);
  };

  // Load vocabulary data based on selected options
  const loadVocabularyData = async (options: QuizOptions) => {
    try {
      setLoading(true);
      setError('');

      let dataPath = '';

      switch (options.type) {
        case 'vocabulary':
          // For vocabulary, select the appropriate source
          if (options.source) {
            // Check for specific unit files within source folders
            const unitFiles = await fetchSourceUnitList(options.source);
            if (unitFiles && unitFiles.length > 0) {
              // Select a random unit file from the source
              const randomUnit = unitFiles[Math.floor(Math.random() * unitFiles.length)];
              dataPath = `${import.meta.env.BASE_URL}${options.source}/${randomUnit}`;
            } else {
              // Fallback to the main source file
              dataPath = `${import.meta.env.BASE_URL}${options.source}.json`;
            }
          } else {
            // Fallback to main vocab file
            dataPath = `${import.meta.env.BASE_URL}vocab.json`;
          }
          break;
        case 'phrasal-verb':
          dataPath = `${import.meta.env.BASE_URL}phrasal_verb.json`;
          break;
        case 'prepositional-phrase':
          dataPath = `${import.meta.env.BASE_URL}prepositional_phrase.json`;
          break;
        default:
          dataPath = `${import.meta.env.BASE_URL}vocab.json`;
      }

      console.info('Loading vocabulary data from:', dataPath);
      const response = await fetch(dataPath);

      if (!response.ok) {
        throw new Error(`Failed to load data (status: ${response.status})`);
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Data is empty or in incorrect format');
      }

      console.info(`Successfully loaded ${data.length} items`);
      setVocabulary(data);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch available unit files within a source folder
  const fetchSourceUnitList = async (source: string): Promise<string[]> => {
    try {
      // Try to fetch a manifest file listing all available units
      const manifestPath = `${import.meta.env.BASE_URL}${source}/manifest.json`;
      const response = await fetch(manifestPath);

      if (response.ok) {
        const manifest = await response.json();
        return manifest.units || [];
      }

      // If no manifest, return empty array (will fallback to source.json)
      return [];
    } catch (error) {
      console.warn(`No manifest found for ${source}, will use default file`);
      return [];
    }
  };

  // Render appropriate view
  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Spin size="large" tip="Loading data..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center text-red-600">
            <h2 className="text-xl font-bold">Error</h2>
            <p>{error}</p>
            <Button type="primary" onClick={handleReturnHome} className="mt-4">
              Return to Home
            </Button>
          </div>
        </div>
      );
    }

    if (currentView === 'home') {
      return <HomePage onStartQuiz={handleStartQuiz} />;
    }

    return <QuizApp vocabularyData={vocabulary} onReturnHome={handleReturnHome} />;
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div
        className="min-h-screen p-5 bg-app"
        style={
          backgroundImage
            ? {
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundAttachment: 'fixed',
              }
            : {
                backgroundColor: '#f5f5f5', // Fallback background color
              }
        }
      >
        {renderContent()}
      </div>
    </ConfigProvider>
  );
}

export default App;
