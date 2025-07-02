// Types pour les quiz
export interface Choice {
  id: number;
  text: string;
  order?: number;
}

export interface ChoiceWithAnswer extends Choice {
  is_correct: boolean;
}

export interface Question {
  id: number;
  text: string;
  order?: number;
  choices: Choice[];
}

export interface QuestionWithAnswers extends Question {
  choices: ChoiceWithAnswer[];
}

export interface Quiz {
  id: number;
  title: string;
  module_id: number;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

// Types pour les créations
export interface ChoiceCreate {
  text: string;
  is_correct: boolean;
  order?: number;
}

export interface QuestionCreate {
  text: string;
  order?: number;
  choices: ChoiceCreate[];
}

export interface QuizCreate {
  title: string;
  questions: QuestionCreate[];
}

export interface QuizUpdate {
  title?: string;
  questions?: QuestionCreate[];
}

// Types pour les soumissions
export interface Answer {
  question_id: number;
  choice_id: number;
}

export interface QuizSubmission {
  answers: Answer[];
}

export interface QuestionResult {
  question_id: number;
  question_text: string;
  selected_choice_id: number;
  selected_choice_text: string;
  correct_choice_id: number;
  correct_choice_text: string;
  is_correct: boolean;
}

export interface QuizResult {
  total: number;
  correct: number;
  score_percentage: number;
  details: QuestionResult[];
}

// Types pour l'état du quiz dans le composant
export interface QuizState {
  currentQuestionIndex: number;
  answers: Answer[];
  isSubmitted: boolean;
  result: QuizResult | null;
  timeSpent: number;
}

// Types pour les props des composants
export interface QuizComponentProps {
  moduleId: number;
  onComplete?: (result: QuizResult) => void;
}

export interface QuestionComponentProps {
  question: Question;
  selectedChoiceId: number | null;
  onAnswerSelect: (questionId: number, choiceId: number) => void;
  isReviewMode?: boolean;
  questionResult?: QuestionResult;
}

export interface QuizResultsComponentProps {
  result: QuizResult;
  onRetry?: () => void;
  onClose?: () => void;
}

// Utilitaires pour les quiz
export declare function formatTime(seconds: number): string;
export declare function getScoreColor(percentage: number): string;
export declare function getScoreMessage(percentage: number): string; 