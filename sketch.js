var ship, shipAnim, Wall, UFOAnim, Aliens, AliensAnim0, laserImage, AliensGroup, laserGroup, boss, bossAnim;
var fire, fireAnim;
var bossGroup;
var speed = 5;
var x = 400;
var score = 0;
var font;
var fuel = 100;
var fuelState = 0, bossState = 0, counter = 0;
var bossPos, bossHealth = 100, bossDir = 2, bossThing;
function preload() {
    shipAnim = loadAnimation("Sprites/SpaceShip/SpaceShip01.png", "Sprites/SpaceShip/SpaceShip01.png");
    UFOAnim = loadAnimation("Sprites/UFO/UFO_01.png", "Sprites/UFO/UFO_02.png", "Sprites/UFO/UFO_03.png");
    laserImage = loadImage("Sprites/Laser.png");
    font = loadFont("Fonts/alarm clock.ttf");
    fireAnim = loadAnimation("Sprites/Fire/Fire_01.png", "Sprites/Fire/Fire_02.png");
    bossAnim = loadAnimation("Sprites/Boss/Boss_01.png", "Sprites/Boss/Boss_01.png", "Sprites/Boss/Boss_02.png", "Sprites/Boss/Boss_02.png");
    
}

function setup() {
    createCanvas(800, 400);
    frameRate(30);
    ship = createSprite(180, height / 2, 64, 32);
    ship.addAnimation("ship", shipAnim);
    ship.depth = 3;
    for (let i = 0; i < 800; i+=50) {
        Wall = createSprite(30, 10 + i, 32, 16);
        Wall.addAnimation("Wall", UFOAnim);
        Wall.depth = 4;
    }
    AliensGroup = createGroup();
    laserGroup = createGroup();
    fire = createSprite(ship.x - 10, ship.y + 5, 8, 4);
    fire.addAnimation("fire", fireAnim);
    bossGroup = createGroup();
}

function draw() {
    background(0, 1, 13);
    fire.x = ship.x - 40;
    fire.y = mouseY + 2;
    ship.y = mouseY;
    bossShooting();
    spawnAliens();
    spawnBosses();
    if (frameCount % 5 === 0) {
        score+=100;
    }
    if (AliensGroup.isTouching(laserGroup)) {
        for (let i = 0; i < AliensGroup.length; i++) {
            for (let j = 0; j < laserGroup.length; j++) {
                if (laserGroup[j].isTouching(AliensGroup) && AliensGroup[i].isTouching(laserGroup)) {
                    laserGroup[j].destroy();
                    AliensGroup[i].destroy();
                }
            }
        }

        score += 100;
    }

    if (laserGroup.isTouching(bossGroup)) {
        for (let i = 0; i < laserGroup.length; i++) {
            bossHealth -= 10;
            if (laserGroup[i].isTouching(bossGroup)) {
            laserGroup[i].destroy();
            }
        }
    }
    if (bossHealth < 0) {
        bossGroup.destroyEach();
         
        bossState = 0;
         
        
        bossHealth = 100;
        bossPos = 800;

    }
    for (let i = 0; i < bossGroup.length; i++) {
        if (bossGroup[i].x < 600) {
            bossGroup[i].velocityX = 0;
        }
        if (bossHealth < 0) {
            bossGroup[i].lifetime = 1;
             
        }
        if (bossGroup[i].x <600) {
            if (bossGroup[i].velocityY === 0) {
                bossGroup[i].velocityY = bossDir;
            }
            if (bossGroup[i].y > 380) {
                bossGroup[i].velocityY = -bossDir;
            }
            else if (bossGroup[i].y < 20) {
                bossGroup[i].velocityY = bossDir;
            }
        }
        bossThing = bossGroup[i].y;
         
    }
    reFill();
    textFont(font);
    fill(255);
    textSize(20);
    textAlign(CENTER);    
    if (bossState === 1) {
        if (bossPos >= 600) {
            bossPos--;
             
        }
    }
    if (frameCount % 30 === 0 && counter === 1) {
        counter = 0;
    }
    drawSprites();
    text("SCORE: " + score, 200, 20);
    text("FUEL: " + fuel, 200, 380);
    text("Boss: " + bossHealth + " Other " + bossState, 200, 180);
}

function spawnAliens() {
    if (bossState === 0) {
        if (frameCount % 20 === 0) {
            Aliens = createSprite(width, random(10, 390), 64, 32);
            Aliens.addAnimation("Alien", UFOAnim);
            Aliens.scale = 1.2;
            Aliens.depth = 2;
            Aliens.setCollider("circle", 0, 0, 32);
            Aliens.debug = false;
            Aliens.lifetime = 350;
            Aliens.velocityX = random(-2, -6);
            AliensGroup.add(Aliens);
        }
    }
}

function keyPressed(score) {
    if (key === " " && fuel > 0 && fuelState === 0 ) {
        laser = createSprite(ship.x + 20, ship.y + 5, 15, 2);
        laser.velocityX = 6;
        laser.addImage(laserImage);
        laser.scale = 0.5;
        laser.depth = 2;
        laser.lifetime = 100;
        laserGroup.add(laser);
        fuel-= 5;
    }

    if (key === "r" || key === "R") {
        fuelState = 1;
    }
}

function reFill() {

    if (fuel <= 99 && fuelState === 1) {
        fuel+=5;
    }
    if (fuel === 100) {
        fuelState = 0;
    }
}

function spawnBosses() {
    if (score % 1000 === 0 && score > -1 && bossState === 0) {
        boss = createSprite(width + 30, height / 2, 96, 64);
        boss.velocityX = -1;
        boss.addAnimation("Boss", bossAnim);
        bossState = 1;
        boss.lifetime = -1;
        score += 100;
        bossPos = boss.x;
        bossHealth = 100;
        bossGroup.add(boss);
        bossPos = 800;
        console.log("hello World");
    }
}

function bossShooting() {
    let rand = Math.round(random(1, 2)) * 50;
    if (score % (50 + rand) === 0 && bossState === 1 && bossPos <= 600 && counter === 0) {

            bossLaser = createSprite(bossPos + 20,bossThing , 15, 2);
            bossLaser.velocityX = -6;
            bossLaser.addImage(laserImage);
            bossLaser.scale = 0.5;
            bossLaser.depth = 2;
        bossLaser.lifetime = 200;
        counter = 1;
            //score += 100;
        }
    
}
