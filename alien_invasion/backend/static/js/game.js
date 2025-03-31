let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

let player, cursors, bullets, aliens, score = 0, scoreText, gameOver = false;

let game = new Phaser.Game(config);

function preload() {
    this.load.image("ship", "assets/ship.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("alien", "assets/alien.png");
}

function create() {
    player = this.physics.add.sprite(400, 500, "ship").setCollideWorldBounds(true);

    bullets = this.physics.add.group();
    aliens = this.physics.add.group();

    scoreText = this.add.text(10, 10, "Score: 0", {
        fontSize: "20px",
        fill: "#fff",
    });

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on("keydown-SPACE", shootBullet, this);

    this.time.addEvent({
        delay: 1000,
        callback: spawnAlien,
        callbackScope: this,
        loop: true,
    });
}

function update() {
    if (gameOver) return;

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    bullets.children.iterate((bullet) => {
        if (bullet.y < 0) bullet.destroy();
    });
}

function shootBullet() {
    let bullet = bullets.create(player.x, player.y - 20, "bullet");
    bullet.setVelocityY(-400);
}

function spawnAlien() {
    let x = Phaser.Math.Between(50, 750);
    let alien = aliens.create(x, 0, "alien");
    alien.setVelocityY(100);
    alien.checkWorldBounds = true;
    alien.outOfBoundsKill = true;

    this.physics.add.collider(bullets, aliens, (bullet, alien) => {
        bullet.destroy();
        alien.destroy();
        score += 10;
        scoreText.setText("Score: " + score);
    });

    this.physics.add.collider(player, aliens, () => {
        endGame();
    });
}

// Handle game over
function endGame() {
    gameOver = true;
    document.getElementById("final-score").innerText = score;
    document.getElementById("game-over-modal").classList.remove("hidden");
}

// Submit high score to API
function submitScore() {
    const name = document.getElementById("player-name").value || "Player";
    fetch("/api/highscore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, score }),
    }).then(() => {
        loadHighScores();
        restartGame();
    });
}

// Reload high scores from API
function loadHighScores() {
    fetch("/api/highscore")
        .then((response) => response.json())
        .then((data) => {
            const list = document.getElementById("highscore-list");
            list.innerHTML = "";
            data.high_scores.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = `${item.name}: ${item.score}`;
                list.appendChild(li);
            });
        });
}

// Restart game
function restartGame() {
    document.getElementById("game-over-modal").classList.add("hidden");
    score = 0;
    gameOver = false;
    scoreText.setText("Score: 0");
    aliens.clear(true, true);
    bullets.clear(true, true);
}

// Load high scores when page loads
window.onload = loadHighScores;
