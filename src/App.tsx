import { useState, useEffect } from 'react';
import { ConfigProvider, Spin } from 'antd';
import QuizApp from './components/QuizApp';
import { Vocabulary } from './types';

// Try to import background image, but don't fail if it doesn't exist
// You can add your own background.png in the src/assets/images folder
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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadVocab() {
      try {
        const response = await fetch('/vocab.json');
        if (!response.ok) {
          throw new Error('Failed to load vocabulary data');
        }
        const data = await response.json();
        setVocabulary(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load vocabulary data. Please try again later.');
        setLoading(false);
      }
    }

    loadVocab();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading vocabulary data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
        },
      }}
    >
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
        <QuizApp vocabularyData={vocabulary} />
      </div>
    </ConfigProvider>
  );
}

export default App;
