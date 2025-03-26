import { QuizQuestion, Vocabulary } from '../types';

export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const generateQuizQuestions = (
  vocabularyList: Vocabulary[],
  numberOfQuestions: number = 10
): QuizQuestion[] => {
  if (numberOfQuestions <= 0) {
    throw new Error('Number of questions must be greater than 0');
  }

  const shuffledList = shuffleArray(vocabularyList);
  const selectedWords = shuffledList.slice(0, Math.min(numberOfQuestions, shuffledList.length));

  return selectedWords.map(word => {
    // Get 4 random options (including the correct one)
    const options = getRandomItems(vocabularyList, 4);

    // Make sure the correct answer is included in the options
    if (!options.some(v => v.meaning === word.meaning)) {
      options[Math.floor(Math.random() * 4)] = word;
    }

    return {
      questionWord: word.word,
      options: options.map(opt => ({
        meaning: opt.meaning,
        family: opt.family,
      })),
      correctAnswer: word.meaning,
      wordData: word,
    };
  });
};

export const getRandomItems = <T>(arr: T[], num: number): T[] => {
  const shuffled = shuffleArray([...arr]);
  return shuffled.slice(0, num);
};

export const calculateScore = (totalQuestions: number, correctAnswers: number): number => {
  return Math.round((correctAnswers / totalQuestions) * 100);
};
