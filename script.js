let score = 0;
let timer = 60;
let interval;
let correctAnswer;

const scoreDisplay = document.getElementById("score");
const startRulesDiv = document.getElementById("start-rules");
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const endScreen = document.getElementById("endScreen");
const timerDisplay = document.getElementById("timer");
const finalScoreDisplay = document.getElementById("finalScore");
const questionDisplay = document.getElementById("question");
const answerButtons = document.querySelectorAll(".answer");
const endMessage = document.getElementById("endMessage");

document.getElementById("startQuiz").addEventListener("click", function () {
  startRulesDiv.style.display = "none";
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  resetGame();
  startTimer();
  getQuestion();
});

document.getElementById("playAgain").addEventListener("click", function () {
  resetGame();
  endScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  startTimer();
  getQuestion();
});

async function getQuestion() {
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=1");
    const data = await response.json();
    const questionData = data.results[0];
    displayQuestion(questionData);
  } catch (error) {
    console.error("Error fetching question:", error);
    questionDisplay.innerHTML = "Failed to load question. Please try again.";
  }
}

function displayQuestion(questionData) {
  questionDisplay.innerHTML = questionData.question;
  const answers = [
    ...questionData.incorrect_answers,
    questionData.correct_answer,
  ];
  correctAnswer = questionData.correct_answer;
  shuffleArray(answers);
  answerButtons.forEach((button, index) => {
    button.innerHTML = answers[index];
    button.onclick = () => checkAnswer(answers[index]);
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function checkAnswer(selectedAnswer) {
  if (selectedAnswer === correctAnswer) {
    correctAnswerAction();
  } else {
    wrongAnswerAction();
  }
  getQuestion();
}

function correctAnswerAction() {
  score += 10;
  updateScore();
}

function wrongAnswerAction() {
  // Add any additional logic for wrong answer if needed
}

function updateScore() {
  scoreDisplay.innerHTML = score;
}

function startTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    timer--;
    timerDisplay.innerHTML = `Time left: ${timer} seconds`;
    if (timer <= 0) {
      clearInterval(interval);
      endGame();
    }
  }, 1000);
}

function resetGame() {
  score = 0;
  timer = 60;
  updateScore();
  timerDisplay.innerHTML = `Time left: ${timer} seconds`;
}

function endGame() {
  quizScreen.classList.add("hidden");
  endScreen.classList.remove("hidden");
  finalScoreDisplay.innerHTML = `Your score: ${score}`;
  endMessage.innerHTML = getEndMessage(score);
}

function getEndMessage(score) {
  if (score >= 50) {
    return "Great job! You really know your stuff!";
  } else if (score >= 20) {
    return "Not bad! Keep practicing!";
  } else {
    return "Better luck next time!";
  }
}
