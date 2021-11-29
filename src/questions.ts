interface Question {
  equation: string;
  answers: [string, string, string, string];
  checkedAnswerIndex?: string;
}

const QUESTIONS: Question[] = [
  {
    equation: '1 + 1',
    answers: ['1', '2', '3', '4'],
  },
  {
    equation: '2 + 2',
    answers: ['1', '2', '3', '4'],
  },
  {
    equation: '2 + 2 * 2',
    answers: ['6', '10', '8', '2'],
  },
  {
    equation: '2 - 2',
    answers: ['1', '0', '27', '420'],
  },
  {
    equation: '24 / 6',
    answers: ['4', '8', '6', '12'],
  },
];

export default QUESTIONS;
