document.addEventListener("DOMContentLoaded", () => {
    let score = 0;
    let currentQuestionIndex = 0;
    const correctAnswers = [];
    const incorrectAnswers = [];
    let totalQuestions = 10; // 기본값
    let shuffledQuestions = []; // 랜덤으로 섞인 문제 리스트

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
        fetchQuestions(); // 문제를 로드하고 섞기
    }

    function updateScore() {
        scoreElement.textContent = `점수: ${score}`;
    }

    // 데이터 로드 및 문제 섞기
    function fetchQuestions() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error("문제 데이터가 유효하지 않습니다.");
                }
                shuffledQuestions = shuffle(data).slice(0, totalQuestions); // 랜덤으로 섞고 필요한 만큼만 선택
                loadNextQuestion();
            })
            .catch(error => {
                console.error("데이터 로딩 오류:", error);
                feedbackElement.textContent = "문제 데이터를 불러오는 데 오류가 발생했습니다.";
            });
    }

    function loadNextQuestion() {
        feedbackElement.textContent = ''; // 피드백 초기화
        optionsContainer.innerHTML = ''; // 보기 초기화

        if (currentQuestionIndex < shuffledQuestions.length) {
            const question = shuffledQuestions[currentQuestionIndex];
            const countryName = question.country;
            const correctAnswer = question.capital;

            // 틀린 답 선택
            const incorrectOptions = getRandomIncorrectAnswers(correctAnswer, shuffledQuestions);

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
        const question = shuffledQuestions[currentQuestionIndex];
        const correctAnswer = question.capital;
        // 다음 버튼 보이기
        nextButton.style.visibility = 'visible';

        if (isCorrect) {
            selectedAnswer.style.backgroundColor = 'green';
            feedbackElement.textContent = "정답!";
            score++;
            correctAnswers.push({ country: question.country, capital: correctAnswer });
        } else {
            selectedAnswer.style.backgroundColor = 'red';
            feedbackElement.textContent = "틀렸습니다.";

            // 정답 버튼을 찾아 초록색으로 표시
            const correctButton = [...optionsContainer.children].find(
                button => button.dataset.answer === 'true'
            );
            if (correctButton) {
                correctButton.style.backgroundColor = 'green';
            }

            incorrectAnswers.push({ country: question.country, capital: correctAnswer });
        }

        // 보기 버튼 비활성화
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
        correctAnswersList.innerHTML = correctAnswers.length > 0 
            ? correctAnswers.map(ans => `<li>${ans.country} - ${ans.capital}</li>`).join('')
            : '<li>없음</li>';
        incorrectAnswersList.innerHTML = incorrectAnswers.length > 0
            ? incorrectAnswers.map(ans => `<li>${ans.country} - ${ans.capital}</li>`).join('')
            : '<li>없음</li>';
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

    // 배열 랜덤 섞기
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
