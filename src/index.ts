import QUESTIONS from './questions';
import { enableButton, disableButton } from './utils/disableButtonHelpers';

import './scss/index';

// DOM elements
const questionNumberHeadingElement =
  document.querySelector('.question__number')!;
const questionParagraphElement = document.querySelector('.question__text')!;

const answerParagraphElements = document.querySelectorAll(
  '.answers__answer__text'
);
const answerInputElements = document.querySelectorAll(
  '.answers__answer__input'
);

const [prevButtonElement, nextButtonElement, finishButtonElement] =
  document.querySelectorAll<HTMLButtonElement>('.navigation__buttons__button')!;

const endgameModal = document.querySelector('.endgame-modal')!;
const endgameModalButton = document.querySelector(
  '.endgame-modal__modal__buttons__button'
)!;
const engameModalBackdrop = document.querySelector('.endgame-modal__backdrop')!;
const scoredPointsElement = document.querySelector(
  '.endgame-modal__modal__score__points__scored'
)!;
const totalPointsElement = document.querySelector(
  '.endgame-modal__modal__score__points__total'
)!;

// Initial state
let currentQuestionIndex = 0;
let { equation, answers } = QUESTIONS[currentQuestionIndex];
updateUI();

// App
(function app() {
  answerInputElements.forEach((answerInputElement, _, answerInputElements) =>
    answerInputElement.addEventListener('change', () => {
      saveCheckedAnswer(answerInputElement as HTMLInputElement);
      displayFinishButton();
      styleCheckedAnswerOnly(answerInputElements);
    })
  );

  prevButtonElement.addEventListener('click', prevButtonClickHandler);
  nextButtonElement.addEventListener('click', nextButtonClickHandler);
  finishButtonElement.addEventListener('click', finishButtonClickHandler);
  endgameModalButton.addEventListener('click', () => location.reload());
  engameModalBackdrop.addEventListener('click', () => location.reload());
})();

// Navigation buttons click handlers
function prevButtonClickHandler() {
  prevButtonGuard();
  currentQuestionIndex--;
  enableButton(nextButtonElement);
  updateState();
  updateUI();
  updateCheckedAnswerStylesOnQuestionChange(answerInputElements);
}

function nextButtonClickHandler() {
  nextButtonGuard();
  currentQuestionIndex++;
  enableButton(prevButtonElement);
  updateState();
  updateUI();
  updateCheckedAnswerStylesOnQuestionChange(answerInputElements);
}

function finishButtonClickHandler() {
  const quizScoreData = getQuizScoreData();
  showQuizEndgameModal(quizScoreData);
}

function getQuizScoreData() {
  const questions = QUESTIONS;
  const quizScoreData = questions.map((question) => {
    const equationResult = eval(question.equation);
    return +question.answers[+question.checkedAnswerIndex!] === equationResult;
  });
  return quizScoreData;
}

function showQuizEndgameModal(quizScoreData: boolean[]) {
  endgameModal.classList.remove('endgame-modal--hidden');
  scoredPointsElement.textContent = quizScoreData
    .filter((x) => x)
    .length.toString();
  totalPointsElement.textContent = quizScoreData.length.toString();
}

// Button guards
function prevButtonGuard() {
  if (currentQuestionIndex === 1) {
    disableButton(prevButtonElement);
    return;
  }
}

function nextButtonGuard() {
  if (currentQuestionIndex + 2 === QUESTIONS.length) {
    disableButton(nextButtonElement);
    return;
  }
}

// DOM and state updates
function updateState() {
  equation = QUESTIONS[currentQuestionIndex].equation;
  answers = QUESTIONS[currentQuestionIndex].answers;
}

function updateUI() {
  updateCurrentQuestionAndAnswersText();
  updateCurrentQuestionHeading();
}

function updateCurrentQuestionAndAnswersText() {
  questionParagraphElement.innerHTML = `Solve the equation: <span class="question__text__equation">${equation}</span>`;
  answerParagraphElements.forEach((x, index) => {
    x.textContent = answers[index];
  });
}

function updateCurrentQuestionHeading() {
  questionNumberHeadingElement.textContent = `Question ${
    currentQuestionIndex + 1
  }/${QUESTIONS.length}`;
}

// Answers
function styleCheckedAnswerOnly(answerInputElements: NodeList) {
  answerInputElements.forEach((answerInputElement) =>
    toggleCheckedAnswerStyle(answerInputElement as HTMLInputElement)
  );
}

function toggleCheckedAnswerStyle(answerInputElement: HTMLInputElement) {
  answerInputElement.checked
    ? addCheckedAnswerClass(answerInputElement)
    : removeCheckedAnswerClass(answerInputElement);
}

function addCheckedAnswerClass(answerInputElement: HTMLInputElement) {
  answerInputElement.parentElement!.classList.add('answers__answer--checked');
}

function removeCheckedAnswerClass(answerInputElement: HTMLInputElement) {
  answerInputElement.parentElement!.classList.remove(
    'answers__answer--checked'
  );
}

function updateCheckedAnswerStylesOnQuestionChange(
  answerInputElements: NodeList
) {
  answerInputElements.forEach((answerInputElement, index) => {
    removeCheckedAnswerClass(answerInputElement as HTMLInputElement);
    (answerInputElement as HTMLInputElement).checked = false;
  });

  const { checkedAnswerIndex } = QUESTIONS[currentQuestionIndex];
  if (!!!checkedAnswerIndex) return;
  const answerInputElement = answerInputElements[
    +checkedAnswerIndex
  ] as HTMLInputElement;
  answerInputElement.checked = true;
  addCheckedAnswerClass(answerInputElement);
}

function displayFinishButton() {
  areAllAnswersChecked()
    ? finishButtonElement.parentElement!.classList.add(
        'navigation__buttons--finished'
      )
    : finishButtonElement.parentElement!.classList.remove(
        'navigation__buttons--finished'
      );
}

function areAllAnswersChecked() {
  return QUESTIONS.every((QUESTION) => !!QUESTION.checkedAnswerIndex);
}

function saveCheckedAnswer(answerInputElement: HTMLInputElement) {
  QUESTIONS[currentQuestionIndex].checkedAnswerIndex = (
    answerInputElement.id.charCodeAt(0) - 97
  ).toString();
}
