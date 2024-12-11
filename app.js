document.addEventListener("DOMContentLoaded", () => {
    let score = 0;
    let currentQuestionIndex = 0;
    const correctAnswers = [];
    const incorrectAnswers = [];
    let totalQuestions = 10;
    let shuffledQuestions = [];
    let correctAnswer = ""; // 현재 문제의 정답 저장

    const settingsContainer = document.getElementById('settings-container');
    const questionContainer = document.getElementById('question-container');
    const questionCountButtons = document.querySelectorAll('.question-count');
    const nextButton = document.getElementById('next-button');
    const countryNameElement = document.getElementById('country-name');
    const optionsContainer = document.getElementById('options-container');
    const feedbackElement = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');
    const correctAnswersList = document.getElementById('correct-answers');
    const incorrectAnswersList = document.getElementById('incorrect-answers');
    const resultsContainer = document.getElementById('results');

    questionCountButtons.forEach(button => {
        button.addEventListener('click', () => {
            totalQuestions = parseInt(button.getAttribute('data-count'));
            settingsContainer.style.display = 'none';
            questionContainer.style.display = 'block';
            startGame();
        });
    });

    function startGame() {
        currentQuestionIndex = 0;
        correctAnswers.length = 0;
        incorrectAnswers.length = 0;
        score = 0;
        updateScore();
        fetchQuestions();
    }

    function updateScore() {
        scoreElement.textContent = `점수: ${score}`;
    }

    function fetchQuestions() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                shuffledQuestions = shuffle(data).slice(0, totalQuestions);
                loadNextQuestion();
            })
            .catch(error => console.error("데이터 로딩 오류:", error));
    }

    function loadNextQuestion() {
        feedbackElement.textContent = '';
        optionsContainer.innerHTML = '';

        if (currentQuestionIndex < shuffledQuestions.length) {
            const question = shuffledQuestions[currentQuestionIndex];
            const countryName = question.country;
            correctAnswer = question.capital; // 현재 정답 저장

            const incorrectOptions = getRandomIncorrectAnswers(correctAnswer, shuffledQuestions);
            const options = shuffle([correctAnswer, ...incorrectOptions]);

            countryNameElement.textContent = countryName;

            options.forEach(option => {
                const button = document.createElement('button');
                button.classList.add('option');
                button.textContent = option;
                button.dataset.answer = option === correctAnswer ? 'true' : 'false';
                button.addEventListener('click', handleAnswerClick);
                optionsContainer.appendChild(button);
            });

            nextButton.style.visibility = 'hidden';
        } else {
            endGame();
        }
    }

    function handleAnswerClick(event) {
        const selectedAnswer = event.target;
        const isCorrect = selectedAnswer.dataset.answer === 'true';
        nextButton.style.visibility = 'visible';

        if (isCorrect) {
            selectedAnswer.style.backgroundColor = 'green';
            feedbackElement.textContent = "정답!";
            score++;
            correctAnswers.push({ country: countryNameElement.textContent, capital: correctAnswer });
        } else {
            selectedAnswer.style.backgroundColor = 'red';
            feedbackElement.textContent = "틀렸습니다.";

            const correctButton = [...optionsContainer.children].find(button => button.dataset.answer === 'true');
            if (correctButton) correctButton.style.backgroundColor = 'green';

            incorrectAnswers.push({ country: countryNameElement.textContent, capital: correctAnswer });
        }

        document.querySelectorAll('.option').forEach(btn => btn.disabled = true);
        updateScore();
    }

    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        loadNextQuestion();
    });

    function endGame() {
        questionContainer.style.display = 'none';
        resultsContainer.style.display = 'block';
        correctAnswersList.innerHTML = correctAnswers.map(ans => `<li><span class="countryList">${ans.country}</span> - <span class="capitalList">${ans.capital}</span></li>`).join('');
        incorrectAnswersList.innerHTML = incorrectAnswers.map(ans => `<li><span class="countryList">${ans.country}</span> - <span class="capitalList">${ans.capital}</span></li>`).join('');
    }

    function getRandomIncorrectAnswers(correctAnswer, allQuestions) {
        const capitals = allQuestions.map(q => q.capital).filter(capital => capital !== correctAnswer);
        return shuffle(capitals).slice(0, 3);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
