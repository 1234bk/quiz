
const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const logoimg = document.getElementById("logoimg");




// theme
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> LIGHT MODE';
    // logoimg.src = 'light-quizz.jpg'; 
}
themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    var logoimg = document.getElementById("logoimg");
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> LIGHT MODE';
        logoimg.src ='light-quizz.jpg'; 
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> DARK MODE';
        logoimg.src ='l-quiz.jpg'; 
    }
});




// alert
function confirmExit() {
    // let confirmLeave = confirm("Are you sure you want to exit the quiz and go to Home?");
    // if (confirmLeave) {
        window.location.href = "index.html";
    // }
}
function openModal() {
    document.getElementById("customAlert").style.display = "flex";
}

function closeModal() {
    document.getElementById("customAlert").style.display = "none";
}





let audio = document.getElementById("bgMusic");
let icon = document.getElementById("musicToggle");


if (audio && icon) {
    icon.addEventListener("click", function() {
        if (audio.paused) {
            audio.play();
            icon.classList.remove("fa-volume-mute");
            icon.classList.add("fa-volume-up"); // Change to speaker icon
        } else {
            audio.pause();
            icon.classList.remove("fa-volume-up");
            icon.classList.add("fa-volume-mute"); // Change to mute icon
        }
    });
} else {
    console.error("Audio or Icon elements not found!");
}





let totalquestions=10;
var correctAnswers = 0;








// mcq
const apiUrls = {
    gk: "https://opentdb.com/api.php?amount=15&category=9&type=multiple",
    sports: "https://opentdb.com/api.php?amount=15&category=21&type=multiple",
    entertainment: "https://opentdb.com/api.php?amount=15&category=11&type=multiple",
    tech: "https://opentdb.com/api.php?amount=15&category=18&type=multiple"
};

let questions = [];
// time shown on page
let counttime=9;
// time shown at backend
const timeout =11000;
let currentQuestionIndex = 0;

let timer;
let selectedCategory = localStorage.getItem("quizCategory");

async function fetchQuestions() {
    if (!selectedCategory || !apiUrls[selectedCategory]) {
        console.error("Invalid category selected.");
        return;
    }
    
    const response = await fetch(apiUrls[selectedCategory]);
    const data = await response.json();
    questions = data.results.slice(0, totalquestions);
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        localStorage.setItem("finalScore", correctAnswers);
        // localStorage.setItem("finalScore", correctAnswers);


        // updateCircularProgress(correctAnswers, totalquestions)
        console.log(correctAnswers);
        window.location.href = "result.html";
        return;
    }

    
    let timerValue = counttime;  // Assuming counttime is already set before this code (e.g., 8 seconds for the first question)
    const timeSpan = document.getElementById('time');
    const questionNumberSpan = document.getElementById('questionNumber');
    
    // Ensure that 'time' and 'questionNumber' elements exist
    if (!timeSpan || !questionNumberSpan) {
        console.error('Required elements "time" or "questionNumber" not found.');
        return; // Exit if elements are not found
    }
    
    const timerInterval = setInterval(() => {
        if (timerValue >= 0) {
            // Update timer text
            timeSpan.textContent = timerValue;
    
            // Change timer color when it's 5 or below
            if (timerValue <= 5) {
                timeSpan.classList.add('red');
            } else {
                timeSpan.classList.remove('red');
            }
    
            // Decrease timer value
            timerValue--;
    
            // Stop the timer when it reaches 0
            if (timerValue < 0) {
                clearInterval(timerInterval); // Clear the interval when the timer ends
            }
        }
    }, 1000);
    
    // Update the current question number (1/15, 2/15, etc.)
    questionNumberSpan.textContent = `${currentQuestionIndex + 1}/${totalquestions}`;  // Format as "1/15", "2/15", etc.
    
    // Display the question and its options
    let questionObj = questions[currentQuestionIndex];
    document.getElementById("question-text").innerHTML = questionObj.question;

    let options = [...questionObj.incorrect_answers, questionObj.correct_answer];
    options = options.sort(() => Math.random() - 0.5);

    document.querySelectorAll(".option").forEach((div, index) => {
        div.innerHTML = `${String.fromCharCode(65 + index)}) ${options[index]}`;
        div.style.backgroundColor = "";
        div.style.border = "2px solid transparent"; // Reset border
    });

    document.querySelectorAll('input[name="quiz"]').forEach(input => {
        input.checked = false;
        input.parentElement.classList.remove("selected");
    });

    timer = setTimeout(showCorrectAnswer, timeout); // 10 seconds timeout for the question
}

function showCorrectAnswer() {
    let correctAnswer = questions[currentQuestionIndex].correct_answer;
    let selectedOption = document.querySelector('input[name="quiz"]:checked');
    let correctDiv;

    document.querySelectorAll(".option").forEach(option => {
        if (option.innerHTML.includes(correctAnswer)) {
            option.style.backgroundColor = "green";
            correctDiv = option;
        }
    });

    if (selectedOption) {
        let selectedDiv = selectedOption.nextElementSibling;
        if (selectedDiv.innerHTML.includes(correctAnswer)) {
            correctAnswers++;  // Increment correct answers count
        } else {
            selectedDiv.style.backgroundColor = "red";
        }
    }

    // After a small delay, move to the next question
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

// Ensure that submitBtn exists before adding the event listener
const submitButton = document.getElementById("submitBtn");

if (submitButton) {
    submitButton.addEventListener("click", () => {
        // Ensure that the 'timer' variable exists and is defined
        if (typeof timer !== 'undefined') {
            clearTimeout(timer);
        }

        // Ensure that showCorrectAnswer() function exists and is defined
        if (typeof showCorrectAnswer === 'function') {
            showCorrectAnswer();
        } else {
            console.error("showCorrectAnswer function is not defined.");
        }
    });
} else {
    console.error("submitBtn element not found in the HTML.");
}


// Highlight selected option with yellow border
document.querySelectorAll('input[name="quiz"]').forEach(input => {
    input.addEventListener("change", function() {
        document.querySelectorAll(".option").forEach(option => {
            option.style.border = "2px solid transparent"; // Reset borders
        });
        let selectedDiv = this.nextElementSibling;
        selectedDiv.style.border = "2px solid yellow"; // Highlight selected option
    });
});

fetchQuestions();





drawCircularProgress(correctAnswers, totalquestions);

console.log(correctAnswers);


// document.addEventListener("DOMContentLoaded", function () {
    
    drawCircularProgress(correctAnswers, totalQuestions);
// });


function drawCircularProgress(correctAnswers, totalQuestions) {
    let finalScore = localStorage.getItem("finalScore") ? parseInt(localStorage.getItem("finalScore")) : 0;
    let tq = localStorage.getItem("totalQuestions") ? parseInt(localStorage.getItem("totalQuestions")) : 10;

    const percentage = (finalScore / tq) * 100;
    console.log(percentage);
    console.log("bk")
    
    // Update percentage text in the center
    document.getElementById('percentageText').textContent = `${percentage}%`;

    // Canvas setup
    const canvas = document.getElementById('progressCanvas');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const lineWidth = 15; // Width of the progress circle

    // Draw the background circle (gray)
    ctx.beginPath();
    ctx.arc(radius, radius, radius - lineWidth, 0, Math.PI * 2, false);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = '#e6e6e6'; // Light gray for background
    ctx.stroke();

    // Draw the progress circle (gradient color)
    const startAngle = -Math.PI / 2; // Start the progress from top
    const endAngle = startAngle + (Math.PI * 2 * (percentage / 100));

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'green');  // Green for good progress
    gradient.addColorStop(1, 'skyblue');  // Orange for lower progress

    ctx.beginPath();
    ctx.arc(radius, radius, radius - lineWidth, startAngle, endAngle, false);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = gradient; // Use gradient for progress
    ctx.stroke();

    // Draw the percentage text in the center
    ctx.fillStyle = 'white';  // Color of the text
    ctx.font = 'bold 3rem Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${Math.round(percentage)}%`, radius, radius);

    // Motivational message based on performance
    const motivationalText = percentage === 100 ? "Excellent!" : percentage >= 70 ? "Keep up the great work!" : "You're doing well, keep going!";
    document.getElementById('motivationalText').textContent = motivationalText;
}


// Call the function to draw the graph with initial values















// result 
