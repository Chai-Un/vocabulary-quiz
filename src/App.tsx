/* eslint-disable no-case-declarations */
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
      let vocabData: Vocabulary[] = [];

      switch (options.type) {
        case 'vocabulary':
          // For vocabulary, select the appropriate source
          if (options.source) {
            // Get unit files from source folders
            const unitFiles = await fetchSourceUnitList(options.source);

            if (unitFiles && unitFiles.length > 0) {
              // Load and combine all unit files data
              try {
                const allData = await Promise.all(
                  unitFiles.map(async unit => {
                    const unitPath = `${import.meta.env.BASE_URL}${options.source}/${unit}`;
                    console.info(`Loading data from unit file: ${unitPath}`);
                    const response = await fetch(unitPath);

                    if (!response.ok) {
                      console.warn(`Failed to load unit file: ${unit}`);
                      return [];
                    }

                    // Check if the response is JSON before trying to parse it
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                      console.error('Received non-JSON response:', contentType);
                      const text = await response.text();
                      console.error('Response preview:', text.substring(0, 100));
                      return [];
                    }

                    return await response.json();
                  })
                );

                // Flatten all unit data into one array
                vocabData = allData.flat().filter(item => item);
                console.info(
                  `Combined data from ${unitFiles.length} unit files, total items: ${vocabData.length}`
                );
              } catch (error) {
                console.error('Error combining unit files:', error);
                throw new Error('Failed to combine vocabulary data from units');
              }
            } else {
              // Fallback to the main source file
              dataPath = `${import.meta.env.BASE_URL}${options.source}.json`;
              const response = await fetch(dataPath);

              if (!response.ok) {
                throw new Error(`Failed to load data (status: ${response.status})`);
              }

              // Check content type
              const contentType = response.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                console.error('Received non-JSON response:', contentType);
                const text = await response.text();
                console.error('Response preview:', text.substring(0, 100));
                throw new Error(`Server returned non-JSON response (${contentType})`);
              }

              vocabData = await response.json();
            }
          } else {
            // Fallback to main vocab file
            dataPath = `${import.meta.env.BASE_URL}vocab.json`;
            const response = await fetch(dataPath);

            if (!response.ok) {
              throw new Error(`Failed to load data (status: ${response.status})`);
            }

            // Check content type
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              console.error('Received non-JSON response:', contentType);
              const text = await response.text();
              console.error('Response preview:', text.substring(0, 100));
              throw new Error(`Server returned non-JSON response (${contentType})`);
            }

            vocabData = await response.json();
          }
          break;
        case 'phrasal-verb':
          dataPath = `${import.meta.env.BASE_URL}phrasal_verb.json`;
          const responsePhrasalVerb = await fetch(dataPath);

          if (!responsePhrasalVerb.ok) {
            throw new Error(`Failed to load data (status: ${responsePhrasalVerb.status})`);
          }

          // Check content type
          const contentTypePhrasalVerb = responsePhrasalVerb.headers.get('content-type');
          if (!contentTypePhrasalVerb || !contentTypePhrasalVerb.includes('application/json')) {
            console.error('Received non-JSON response:', contentTypePhrasalVerb);
            const text = await responsePhrasalVerb.text();
            console.error('Response preview:', text.substring(0, 100));
            throw new Error(`Server returned non-JSON response (${contentTypePhrasalVerb})`);
          }

          vocabData = await responsePhrasalVerb.json();
          break;
        case 'prepositional-phrase':
          dataPath = `${import.meta.env.BASE_URL}prepositional_phrase.json`;
          const responsePrepositionalPhrase = await fetch(dataPath);

          if (!responsePrepositionalPhrase.ok) {
            throw new Error(`Failed to load data (status: ${responsePrepositionalPhrase.status})`);
          }

          // Check content type
          const contentTypePrepositionalPhrase =
            responsePrepositionalPhrase.headers.get('content-type');
          if (
            !contentTypePrepositionalPhrase ||
            !contentTypePrepositionalPhrase.includes('application/json')
          ) {
            console.error('Received non-JSON response:', contentTypePrepositionalPhrase);
            const text = await responsePrepositionalPhrase.text();
            console.error('Response preview:', text.substring(0, 100));
            throw new Error(
              `Server returned non-JSON response (${contentTypePrepositionalPhrase})`
            );
          }

          vocabData = await responsePrepositionalPhrase.json();
          break;
        default:
          dataPath = `${import.meta.env.BASE_URL}vocab.json`;
          const responseDefault = await fetch(dataPath);

          if (!responseDefault.ok) {
            throw new Error(`Failed to load data (status: ${responseDefault.status})`);
          }

          // Check content type
          const contentTypeDefault = responseDefault.headers.get('content-type');
          if (!contentTypeDefault || !contentTypeDefault.includes('application/json')) {
            console.error('Received non-JSON response:', contentTypeDefault);
            const text = await responseDefault.text();
            console.error('Response preview:', text.substring(0, 100));
            throw new Error(`Server returned non-JSON response (${contentTypeDefault})`);
          }

          vocabData = await responseDefault.json();
      }

      if (!Array.isArray(vocabData) || vocabData.length === 0) {
        throw new Error('Data is empty or in incorrect format');
      }

      console.info(`Successfully loaded ${vocabData.length} items`);
      setVocabulary(vocabData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(`Failed to load data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch available unit files within a source folder
  const fetchSourceUnitList = async (source: string): Promise<string[]> => {
    try {
      // Directly look for unit files since we don't have manifest.json
      const unitFiles = [];

      // Use common unit file pattern detection
      const maxUnitsToCheck = 20; // Reasonable maximum to check

      console.info(`Scanning for unit files in ${source}...`);

      // Batch requests in groups to improve performance
      const batchSize = 5;
      for (let batch = 0; batch < Math.ceil(maxUnitsToCheck / batchSize); batch++) {
        const batchPromises = [];

        for (
          let i = 1 + batch * batchSize;
          i <= Math.min(maxUnitsToCheck, (batch + 1) * batchSize);
          i++
        ) {
          const unitFileName = `unit${i}.json`;
          const unitPath = `${import.meta.env.BASE_URL}${source}/${unitFileName}`;

          batchPromises.push(
            fetch(unitPath, { method: 'HEAD' })
              .then(response => {
                if (response.ok) {
                  console.info(`Found unit file: ${unitFileName}`);
                  unitFiles.push(unitFileName);
                }
                return null;
              })
              .catch(() => null) // Silently ignore 404s or other errors
          );
        }

        await Promise.all(batchPromises);
      }

      if (unitFiles.length === 0) {
        console.warn(`No unit files found in ${source} folder`);
      } else {
        console.info(`Found ${unitFiles.length} unit files in ${source}`);
      }

      return unitFiles;
    } catch (error) {
      console.warn(`Error scanning for unit files in ${source}:`, error);
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
