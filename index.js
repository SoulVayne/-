const pairsInput = document.getElementById('pairs-input');
const difficultySelect = document.getElementById('difficulty-select');
const startBtn = document.getElementById('start-btn');
const gameBoard = document.getElementById('game-board');
const restartBtn = document.getElementById('restart-btn');
const timerDisplay = document.getElementById('timer');

const images = [
    'https://i.pinimg.com/736x/6b/4b/80/6b4b80aafdeab312fcfe061d3863a2ab.jpg',
    'https://i.pinimg.com/474x/af/60/73/af60739e32e19caa512c6441d46f54f6.jpg',
    'https://i.pinimg.com/474x/9d/a7/f1/9da7f1eeba9dea9d5c37ed2beb0a1270.jpg',
    'https://i.pinimg.com/474x/91/33/00/9133001751668065d194caee73d95b6e.jpg',
    'https://i.pinimg.com/736x/6f/5f/3b/6f5f3bce8dc7d2bb8cecf93b9bc20124.jpg',
    'https://i.pinimg.com/474x/6f/ee/b4/6feeb438a69c8a16f3ed24af963332f3.jpg',
    'https://i.pinimg.com/474x/60/52/6e/60526e521df88b4a032830ff752b5678.jpg',
    'https://i.pinimg.com/474x/8b/de/9f/8bde9f38bf744aaec7b77bc443adf1cc.jpg',
    'https://i.pinimg.com/474x/69/06/74/690674e51d148d0b88fc1d0eafa58472.jpg',
    'https://i.pinimg.com/736x/6f/ae/9f/6fae9f966428a2100c36193c968f84d4.jpg',
    'https://i.pinimg.com/736x/55/4b/3d/554b3dd75c583ee646fab1f5b8772680.jpg'
];

let selectedCards = [];
let cardValues = [];
let timer;
let timeRemaining;

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

function startGame() {
    const numPairs = parseInt(pairsInput.value);
    if (isNaN(numPairs) || numPairs <= 0 || numPairs > images.length) {
        alert('Введите корректное количество пар.');
        return;
    }
    cardValues = generateCardValues(numPairs);
    shuffleArray(cardValues);
    renderCards(cardValues);
    timeRemaining = parseInt(difficultySelect.value);
    startTimer(timeRemaining);
}

function generateCardValues(numPairs) {
    const values = [];
    for (let i = 0; i < numPairs; i++) {
        values.push(i, i);
    }
    return values;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderCards(values) {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(values.length)}, 1fr)`;
    values.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = value;
        card.dataset.index = index;
        const img = document.createElement('img');
        img.src = images[value];
        card.appendChild(img);
        card.addEventListener('click', onCardClick);
        gameBoard.appendChild(card);
    });
}

function onCardClick(e) {
    const clickedCard = e.target.closest('.card');
    if (selectedCards.length < 2 && !clickedCard.classList.contains('open')) {
        clickedCard.classList.add('open');
        selectedCards.push(clickedCard);
        if (selectedCards.length === 2) {
            checkForMatch();
        }
    }
}

function checkForMatch() {
    const [card1, card2] = selectedCards;
    if (card1.dataset.value === card2.dataset.value) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        selectedCards = [];
        checkGameOver();
    } else {
        setTimeout(() => {
            card1.classList.remove('open');
            card2.classList.remove('open');
            selectedCards = [];
        }, 1000);
    }
}

function checkGameOver() {
    const allMatched = document.querySelectorAll('.card.matched').length === cardValues.length;
    if (allMatched) {
        clearInterval(timer);
        alert('Поздравляем! Вы выиграли!');
        restartBtn.style.display = 'block';
    }
}

function restartGame() {
    selectedCards = [];
    cardValues = [];
    clearInterval(timer);
    timerDisplay.textContent = '';
    restartBtn.style.display = 'none';
    startGame();
}

function startTimer(seconds) {
    timeRemaining = seconds;
    timerDisplay.textContent = `Осталось времени: ${timeRemaining} секунд`;
    timer = setInterval(() => {
        timeRemaining--;
        timerDisplay.textContent = `Осталось времени: ${timeRemaining} секунд`;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            alert('Время вышло! Игра окончена.');
            restartBtn.style.display = 'block';
        }
    }, 1000);
}

