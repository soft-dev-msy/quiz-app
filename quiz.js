// Quiz questions
const questions = [
    {
        type: 'multiple',
        question: 'What is the capital of France?',
        answers: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris'
    },
    {
        type: 'truefalse',
        question: 'The Earth is flat.',
        answers: ['True', 'False'],
        correctAnswer: 'False'
    },
    {
        type: 'multiple',
        question: 'Which of these is not a programming language?',
        answers: ['Python', 'HTML', 'Java', 'C++'],
        correctAnswer: 'HTML'
    },
    {
        type: 'open',
        question: 'Name the largest planet in our solar system.',
        answers: [],
        correctAnswer: 'Jupiter'
    },
    {
        type: 'multiple',
        question: 'What year was JavaScript created?',
        answers: ['1990', '1995', '2000', '2005'],
        correctAnswer: '1995'
    }
];

// DOM elements
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const openEndedContainer = document.getElementById('open-ended-container');
const openEndedAnswer = document.getElementById('open-ended-answer');
const questionCountElement = document.getElementById('question-count');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const submitButton = document.getElementById('submit-btn');
const restartButton = document.getElementById('restart-btn');
const resultsContainer = document.getElementById('results-container');
const finalScoreElement = document.getElementById('final-score');
const feedbackElement = document.getElementById('feedback');
const viewAnswersButton = document.getElementById('view-answers-btn');
const answersReviewElement = document.getElementById('answers-review');

// Quiz state
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = Array(questions.length).fill(null);
let timer;
let timeLeft = 300; // 5 minutes in seconds

// Start the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = Array(questions.length).fill(null);
    scoreElement.textContent = `Score: ${score}`;
    startTimer();
    showQuestion();
}

// Show current question
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    const questionNo = currentQuestionIndex + 1;
    questionCountElement.textContent = `Question ${questionNo} of ${questions.length}`;
    questionElement.textContent = currentQuestion.question;
    
    // Show appropriate answer input based on question type
    if (currentQuestion.type === 'multiple' || currentQuestion.type === 'truefalse') {
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('answer-btn');
            button.addEventListener('click', () => selectAnswer(answer));
            answerButtonsElement.appendChild(button);
            
            // Highlight selected answer if already answered
            if (userAnswers[currentQuestionIndex] === answer) {
                button.classList.add('selected');
            }
        });
    } else if (currentQuestion.type === 'open') {
        openEndedContainer.classList.remove('hidden');
        if (userAnswers[currentQuestionIndex] !== null) {
            openEndedAnswer.value = userAnswers[currentQuestionIndex];
        }
    }
    
    // Update navigation buttons
    updateNavigationButtons();
}

// Reset question state
function resetState() {
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
    openEndedContainer.classList.add('hidden');
    openEndedAnswer.value = '';
}

// Select answer
function selectAnswer(answer) {
    // Remove selected class from all buttons
    const buttons = answerButtonsElement.querySelectorAll('.answer-btn');
    buttons.forEach(button => {
        button.classList.remove('selected');
    });
    
    // Add selected class to clicked button
    event.target.classList.add('selected');
    
    // Save answer
    userAnswers[currentQuestionIndex] = answer;
}

// Update navigation buttons
function updateNavigationButtons() {
    prevButton.disabled = currentQuestionIndex === 0;
    
    if (currentQuestionIndex === questions.length - 1) {
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');
    } else {
        nextButton.classList.remove('hidden');
        submitButton.classList.add('hidden');
    }
}

// Go to next question
function nextQuestion() {
    // Save open-ended answer if applicable
    if (questions[currentQuestionIndex].type === 'open' && openEndedAnswer.value.trim() !== '') {
        userAnswers[currentQuestionIndex] = openEndedAnswer.value.trim();
    }
    
    currentQuestionIndex++;
    showQuestion();
}

// Go to previous question
function prevQuestion() {
    currentQuestionIndex--;
    showQuestion();
}

// Submit quiz
function submitQuiz() {
    // Save open-ended answer if applicable
    if (questions[currentQuestionIndex].type === 'open' && openEndedAnswer.value.trim() !== '') {
        userAnswers[currentQuestionIndex] = openEndedAnswer.value.trim();
    }
    
    // Calculate score
    calculateScore();
    
    // Stop timer
    clearInterval(timer);
    
    // Show results
    showResults();
}

// Calculate score
function calculateScore() {
    score = 0;
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] !== null && userAnswers[i].toString().toLowerCase() === questions[i].correctAnswer.toString().toLowerCase()) {
            score++;
        }
    }
}

// Show results
function showResults() {
    document.querySelector('.quiz-body').classList.add('hidden');
    resultsContainer.classList.remove('hidden');
    finalScoreElement.textContent = `Your final score is: ${score}/${questions.length}`;
    
    // Provide feedback based on score
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) {
        feedbackElement.textContent = 'Excellent work! You really know your stuff!';
    } else if (percentage >= 60) {
        feedbackElement.textContent = 'Good job! You have a solid understanding.';
    } else if (percentage >= 40) {
        feedbackElement.textContent = 'Not bad! Consider reviewing the material.';
    } else {
        feedbackElement.textContent = 'Keep practicing! You\'ll get better with more study.';
    }
}

// Show answers review
function showAnswersReview() {
    answersReviewElement.innerHTML = '';
    questions.forEach((question, index) => {
        const answerItem = document.createElement('div');
        answerItem.classList.add('answer-item');
        
        const isCorrect = userAnswers[index] !== null && 
                         userAnswers[index].toString().toLowerCase() === question.correctAnswer.toString().toLowerCase();
        
        if (isCorrect) {
            answerItem.classList.add('correct');
        } else {
            answerItem.classList.add('incorrect');
        }
        
        answerItem.innerHTML = `
            <h3>Question ${index + 1}: ${question.question}</h3>
            <p>Your answer: ${userAnswers[index] !== null ? userAnswers[index] : 'No answer'}</p>
            <p>Correct answer: ${question.correctAnswer}</p>
        `;
        
        answersReviewElement.appendChild(answerItem);
    });
    
    answersReviewElement.classList.remove('hidden');
    viewAnswersButton.textContent = 'Hide Answers';
}

// Start timer
function startTimer() {
    timeLeft = 300; // Reset to 5 minutes
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color when time is running low
    if (timeLeft <= 60) {
        timerElement.style.color = '#e74c3c';
    } else {
        timerElement.style.color = '#7f8c8d';
    }
}

// Event listeners
nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', prevQuestion);
submitButton.addEventListener('click', submitQuiz);
restartButton.addEventListener('click', () => {
    resultsContainer.classList.add('hidden');
    document.querySelector('.quiz-body').classList.remove('hidden');
    startQuiz();
});
viewAnswersButton.addEventListener('click', () => {
    if (answersReviewElement.classList.contains('hidden')) {
        showAnswersReview();
    } else {
        answersReviewElement.classList.add('hidden');
        viewAnswersButton.textContent = 'View Answers';
    }
});

// Start the quiz when the page loads
startQuiz();
