let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let bullets;
let aliens;
let score = 0;
let scoreText;
let gameOver = false;

let game = new Phaser.Game(config);

function preload() {
    this.load.image('ship', 'assets/ship.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('alien', 'assets/alien.png');
}

function create() {
    player = this.physics.add.sprite(400, 500, 'ship').setCollideWorldBounds(true);

    bullets = this.physics.add.group();
    aliens = this.physics.add.group();

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', shootBullet, this);

    this.time.addEvent({
        delay: 1000,
        callback: spawnAlien,
        callbackScope: this,
        loop: true
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

    bullets.children.iterate(function (bullet) {
        if (bullet.y < 0) bullet.destroy();
    });
}

function shootBullet() {
    let bullet = bullets.create(player.x, player.y - 20, 'bullet');
    bullet.setVelocityY(-400);
}

function spawnAlien() {
    let x = Phaser.Math.Between(50, 750);
    let alien = aliens.create(x, 0, 'alien');
    alien.setVelocityY(100);
    alien.setCollideWorldBounds(true);
    alien.checkWorldBounds = true;
    alien.outOfBoundsKill = true;
}

// Collision handling
this.physics.add.collider(bullets, aliens, function (bullet, alien) {
    bullet.destroy();
    alien.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
});
