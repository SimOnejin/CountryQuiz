document.addEventListener("DOMContentLoaded", () => {
    let score = 0;
    let currentQuestionIndex = 0;
    const correctAnswers = [];
    const incorrectAnswers = [];
    let totalQuestions = 10; // 기본값

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

    // 문제 갯수 선택
    questionCountButtons.forEach(button => {
        button.addEventListener('click', () => {
            totalQuestions = parseInt(button.getAttribute('data-count'));
            settingsContainer.style.display = 'none'; // 문제 설정 숨기기
            questionContainer.style.display = 'block'; // 문제 컨테이너 보이기
            startGame();
        });
    });

    function startGame() {
        currentQuestionIndex = 0;
        correctAnswers.length = 0; // 배열 초기화
        incorrectAnswers.length = 0; // 배열 초기화
        score = 0;
        updateScore();
        loadNextQuestion();
    }

    function updateScore() {
        scoreElement.textContent = `점수: ${score}`;
    }

    // 데이터 로드
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const questions = data;

            // 다음 문제 로드
            function loadNextQuestion() {
                feedbackElement.textContent = ''; // 피드백 초기화
                optionsContainer.innerHTML = ''; // 보기 초기화

                if (currentQuestionIndex < totalQuestions) {
                    const question = questions[currentQuestionIndex];
                    const countryName = question.country;
                    const correctAnswer = question.capital;

                    // 틀린 답 선택
                    const incorrectOptions = getRandomIncorrectAnswers(correctAnswer, questions);

                    // 정답과 섞기
                    const options = [correctAnswer, ...incorrectOptions];
                    shuffle(options);

                    // 문제 표시
                    countryNameElement.textContent = countryName;

                    // 보기 버튼 생성
                    options.forEach(option => {
                        const button = document.createElement('button');
                        button.classList.add('option');
                        button.textContent = option;
                        button.dataset.answer = option === correctAnswer ? 'true' : 'false';
                        button.addEventListener('click', handleAnswerClick);
                        optionsContainer.appendChild(button);
                    });

                    nextButton.style.visibility = 'hidden'; // 다음 버튼 숨기기
                } else {
                    endGame();
                }
            }

            function handleAnswerClick(event) {
                const selectedAnswer = event.target;
                const isCorrect = selectedAnswer.dataset.answer === 'true';

                if (isCorrect) {
                    selectedAnswer.style.backgroundColor = 'green';
                    feedbackElement.textContent = "정답!";
                    score++;
                    correctAnswers.push(countryNameElement.textContent);
                } else {
                    selectedAnswer.style.backgroundColor = 'red';
                    feedbackElement.textContent = "틀렸습니다.";
                    incorrectAnswers.push(countryNameElement.textContent);
                }

                // 보기 버튼 비활성화
                document.querySelectorAll('.option').forEach(btn => btn.disabled = true);

                // 다음 버튼 보이기
                nextButton.style.visibility = 'visible';
                updateScore();
            }

            nextButton.addEventListener('click', () => {
                currentQuestionIndex++;
                loadNextQuestion();
            });

            function endGame() {
                questionContainer.style.display = 'none';
                resultsContainer.style.display = 'block';
                correctAnswersList.innerHTML = correctAnswers.map(ans => `<li>${ans}</li>`).join('');
                incorrectAnswersList.innerHTML = incorrectAnswers.map(ans => `<li>${ans}</li>`).join('');
            }

            // 틀린 답 랜덤 선택
            function getRandomIncorrectAnswers(correctAnswer, allQuestions) {
                const incorrectOptions = [];
                while (incorrectOptions.length < 3) {
                    const randomIndex = Math.floor(Math.random() * allQuestions.length);
                    const randomQuestion = allQuestions[randomIndex];
                    if (!incorrectOptions.includes(randomQuestion.capital) && randomQuestion.capital !== correctAnswer) {
                        incorrectOptions.push(randomQuestion.capital);
                    }
                }
                return incorrectOptions;
            }

            // 보기 섞기
            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            loadNextQuestion(); // 첫 문제 로드
        })
        .catch(error => console.error("데이터 로딩 오류:", error));
});
