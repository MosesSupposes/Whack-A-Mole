const game = (function() {
    let timeUp = false;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('highScore')) || 0;
    
    const board = {
        startButton: document.querySelector('#startButton'),
        gameWrapper: document.querySelector('.game'),
        highScoreDisplay: document.querySelector('#highScore'),
        holes: document.querySelectorAll('.hole'),
        moles: document.querySelectorAll('.mole'),
        scoreBoard: document.querySelector('.score'),
        highScore: document.querySelector('#highScore'),
        lastOccupiedHole: null,
    };
    
    const mole = {
        peep: function peep() {
            const time = randomTime(200, 2000);
            const hole = randomHole(board.holes);
            hole.classList.contains('down') ? 
                hole.classList.replace('down', 'up') :
                hole.classList.add('up');
            setTimeout(() => {
                hole.classList.replace('up', 'down')
                // make it run indefinitely (as long as the game isn't over)
                !timeUp && peep(); 
            }, time);
        },
        
        bonk(mole, hole) {
            if (hole.classList.contains('up')) {
                hole.classList.replace('up', 'down');
                score++
                board.scoreBoard.textContent = score;
                checkForNewHighScore(score);
            }
        }
    };

    function checkForNewHighScore(score) {
        if (score > highScore) updateHighScore(score);
    }

    function updateHighScore(score) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        board.highScoreDisplay.textContent = highScore;
        console.log('High Score updated! New high score: ', score);
    }

    function startGame() {
        score = 0;
        board.scoreBoard.textContent = 0; 
        timeUp = false;
        mole.peep();
        setTimeout(endGame, 10000);
    }

    function endGame() {
        timeUp = true;
        return 'Game Over';
    }

    function randomTime(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    
    function randomHole(holes) {
        const idx = Math.floor(Math.random() * holes.length);
        const hole = holes[idx];
        if (hole === board.lastOccupiedHole) return randomHole(holes);
        board.lastOccupiedHole = hole;
        return hole;
    }

    return {
        startGame,
        endGame,
        score,
        highScore,
        scoreBoard: board.scoreBoard,
        highScoreDisplay: board.highScoreDisplay,
        startButton: board.startButton,
        gameWrapper: board.gameWrapper,
        holes: board.holes,
        moles: board.moles,
        bonkMole: mole.bonk,
    }
})();
    
game.startButton.addEventListener('click', e => {
    e.stopPropagation();
    game.startGame();
});

game.gameWrapper.addEventListener('click', e => {
    if (!e.isTrusted) return;   // cheater!
    game.bonkMole(e.target, e.target.parentElement);
});

game.highScoreDisplay.textContent = localStorage.getItem('highScore');