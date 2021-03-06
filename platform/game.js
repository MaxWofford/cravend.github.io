$(function(){$("#nav").load("../nav.html");});

var GRAVITY = 0.3;
var JUMP = -5;

var groundSprites;
var decorationSprites;
var GROUND_SPRITE_WIDTH = 50;
var GROUND_SPRITE_HEIGHT = 50;
var numGroundSprites;
var obstacleSprites;
var player;
var isGameOver;
var isGameStarted;
var score;
var screenWidth = document.getElementById('flex').getClientRects()[0].width;
var screenHeight = Math.round(screenWidth * .8);

function setup() {
    var canvas = createCanvas(screenWidth, screenHeight);
    canvas.parent('flex');
    isGameOver = false;
    score=0;
    background(150, 200, 250);
    groundSprites = new Group();
    numGroundSprites = width/GROUND_SPRITE_WIDTH + 1;
    for (var n = 0; n < numGroundSprites; n++) {
        var groundSprite = createSprite(n*50, height-25, GROUND_SPRITE_WIDTH, GROUND_SPRITE_HEIGHT);
    groundSprites.add(groundSprite);
    }
    player = createSprite(100, height-75, 50, 50);
    obstacleSprites = new Group();
    decorationSprites = new Group();
    var firstGroundSprite = groundSprites[0];
    if (firstGroundSprite.position.x <= camera.position.x - (width/2 + firstGroundSprite.width/2)) {
        groundSprites.remove(firstGroundSprite);
        firstGroundSprite.position.x = firstGroundSprite.position.x + numGroundSprites*firstGroundSprite.width;
        groundSprites.add(firstGroundSprite);
    }
    drawSprites();
}

function startGame() {
    $("#startButton").hide();
    isGameStarted = true;
}


function draw() {
    if (isGameStarted) {
        if (isGameOver) {
            background(0);
            fill(255);
            textAlign(CENTER);
            text("Your score was: " + score, camera.position.x, camera.position.y - 20);
            text("Game Over! Click anywhere to restart", camera.position.x, camera.position.y);
        } else {
            background(150, 200, 250);
            player.velocity.y = player.velocity.y + GRAVITY;
            player.position.x = player.position.x + 5;
            camera.position.x = camera.position.x + 5;
            var firstGroundSprite = groundSprites[0];
            if (firstGroundSprite.position.x <= camera.position.x - (width/2 + firstGroundSprite.width/2)) {
                groundSprites.remove(firstGroundSprite);
                firstGroundSprite.position.x = firstGroundSprite.position.x + numGroundSprites*firstGroundSprite.width;
                groundSprites.add(firstGroundSprite);
            }
            if (player.position.y <= 25) {
                player.position.y = 25;
                player.velocity.y = GRAVITY;
            }
            if (groundSprites.overlap(player)) {
                player.velocity.y = 0;
                player.position.y = (height-50) - (player.height/2);
            }
            if (random() > 0.95) {
                var decoration = createSprite(camera.position.x + width,  random(0, (height-50)-50), 5, 5);
                decorationSprites.add(decoration);
            }
            if (random() > 0.95) {
                var obstacle = createSprite(camera.position.x + width,  random(0, (height-50)-15), 30, 30);
                obstacleSprites.add(obstacle);
            }
            var firstDecoration = decorationSprites[0];
            if (decorationSprites.length > 0 && firstDecoration.position.x <= camera.position.x - (width/2 + firstDecoration.width/2)) {
                removeSprite(firstDecoration);
            }
            var firstObstacle = obstacleSprites[0];
            if (obstacleSprites.length > 0 && firstObstacle.position.x <= camera.position.x - (width/2 + firstObstacle.width/2)) {
                removeSprite(firstObstacle);
                score = score + 1;
            }
            obstacleSprites.overlap(player, endGame);
            drawSprites();
            textAlign(CENTER);
            text(score, camera.position.x, 10);
            if (keyDown(UP_ARROW)) {
                player.velocity.y = JUMP;
            }
        }
    }
}

function mouseClicked() {
    if (isGameOver) {
        for (var n = 0; n < numGroundSprites; n++) {
            var groundSprite = groundSprites[n];
            groundSprite.position.x = n*50;
        }
        player.position.x = 100;
        player.position.y = height-75;
        camera.position.x = (width/2);
        obstacleSprites.removeSprites();
        score = 0;
        isGameOver = false;
        
    }
}

function endGame() {
    console.log("Game Over!")
    isGameOver = true;
}