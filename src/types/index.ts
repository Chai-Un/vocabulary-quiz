export interface Vocabulary {
  word: string;
  meaning: string;
  meaning_VN: string;
  wordClass: string;
  family: string[];
}

export interface QuizQuestion {
  questionWord: string;
  options: {
    meaning: string;
    family: string[];
  }[];
  correctAnswer: string;
  wordData: Vocabulary;
}

export interface QuizResult {
  totalQuestions: number;
  totalCorrectAnswer: number;
  wrongAnswers: number;
  score: number;
  correctAnswers: Vocabulary[];
  incorrectAnswers: Vocabulary[];
  unansweredQuestions: Vocabulary[];
}
