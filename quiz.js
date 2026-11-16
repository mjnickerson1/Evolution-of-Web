
/* Evolution of the Web - Quiz JavaScript */

// Correct answers for all 10 questions
const correctAnswers = {
    q1: "tim berners-lee",
    q2: "hypertext markup language",
    q3: "b",
    q4: "a",
    q5: "c",
    q6: ["a", "b", "c"],
    q7: "b",
    q8: "c",
    q9: "a",
    q10: "b"
};

// Quiz settings
const totalQuestions = 10;
const timeLimit = 600; // 10 minutes in seconds
const passingScore = 70;

let timeLeft = timeLimit;
let timerInterval;
let startTime;
let quizFinished = false;

// Start the timer when the page loads
function startQuiz() {
    startTime = Date.now();
    updateTimer();

    timerInterval = setInterval(function () {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            submitQuiz();
        }
    }, 1000);
}

// Display remaining time
function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("timer").textContent =
        "Time Remaining: " +
        minutes + ":" +
        String(seconds).padStart(2, "0");
}

// Grade the quiz
function submitQuiz() {
    if (quizFinished) {
        return;
    }

    quizFinished = true;
    clearInterval(timerInterval);

    let score = 0;
    let feedback = "";

    const form = document.getElementById("quizForm");
    const formData = new FormData(form);

    for (let i = 1; i <= totalQuestions; i++) {
        const question = "q" + i;
        let userAnswer;
        let correctAnswer = correctAnswers[question];
        let isCorrect = false;

        if (question === "q6") {
            userAnswer = formData.getAll(question);

            isCorrect =
                userAnswer.length === correctAnswer.length &&
                correctAnswer.every(function (answer) {
                    return userAnswer.includes(answer);
                });

        } else {
            userAnswer = formData.get(question) || "";

            if (i <= 2) {
                userAnswer = userAnswer
                    .trim()
                    .toLowerCase()
                    .replace(/\s+/g, " ");
            }

            isCorrect = userAnswer === correctAnswer;
        }

        if (isCorrect) {
            score++;
        }

        const correctText = Array.isArray(correctAnswer)
            ? correctAnswer.join(", ")
            : correctAnswer;

       
// Display green for correct and red for incorrect
const resultClass = isCorrect ? "correct" : "incorrect";

feedback +=
    '<div class="answer-result ' + resultClass + '">' +
    '<p><strong>Question ' + i + ': ' +
    (isCorrect ? "Correct" : "Incorrect") +
    '</strong> (' + (isCorrect ? 1 : 0) + '/1 point)</p>' +
    '<p>Correct Answer: ' + correctText + '</p>' +
    '</div>';

    }

    // Calculate score and time spent
    const percentage = (score / totalQuestions) * 100;
    const passed = percentage >= passingScore;

    const elapsedSeconds = Math.min(
        timeLimit,
        Math.floor((Date.now() - startTime) / 1000)
    );

    const minutesSpent = Math.floor(elapsedSeconds / 60);
    const secondsSpent = elapsedSeconds % 60;

    // Display results
    const results = document.getElementById("results");

    results.innerHTML =
        "<h2>Quiz Results</h2>" +
        "<h3>" + (passed ? "PASS" : "FAIL") + "</h3>" +
        "<p>Total Score: " + score + "/10 (" +
        percentage + "%)</p>" +
        "<p>Time Spent: " + minutesSpent + " minutes " +
        secondsSpent + " seconds</p>" +
        feedback;

    results.className = passed ? "passed" : "failed";

    // Disable answers after submission
    form.querySelectorAll("input").forEach(function (input) {
        input.disabled = true;
    });

    document.getElementById("submitBtn").disabled = true;
    document.getElementById("resetBtn").hidden = false;
}

// Reset quiz for another attempt
function resetQuiz() {
    clearInterval(timerInterval);

    const form = document.getElementById("quizForm");
    form.reset();

    form.querySelectorAll("input").forEach(function (input) {
        input.disabled = false;
    });

    document.getElementById("results").innerHTML = "";
    document.getElementById("results").className = "";

    document.getElementById("submitBtn").disabled = false;
    document.getElementById("resetBtn").hidden = true;

    timeLeft = timeLimit;
    quizFinished = false;

    startQuiz();
}

// Start quiz when the page finishes loading
document.addEventListener("DOMContentLoaded", startQuiz);

