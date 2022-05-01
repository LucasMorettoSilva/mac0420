/*
    EP01 - Pescaria

    Primeiro exercício programa de MAC0420/MAC5744.

    Nome: Lucas Moretto da Silva
    NUSP: 9778602

*/

window.onload = main;

// =================================================================
const SEA_COLOR = 'rgba(145, 185, 255, 1.0)';

const BEACH_COLOR = 'rgba(200, 250, 20, 1.0)';

const HARPOON_COLOR = 'rgba(0, 0, 0, 1)';

const FISH_NUMBER = 16;

const BEACH_DIMENSION = 0.15;

const BUBBLE_DIMENSION = 0.003;

const SEA_DIMENSION = 0.8;

const SPEED_MULTIPLIER = 0.2;

const keyboard = {
    key_a: ['a', 'A'],
    key_s: ['s', 'S'],
    key_d: ['d', 'D'],
}

const interface = {
    playButton: HTMLElement,
    tickButton: HTMLElement,
    speedRange: HTMLElement
};

// 2D Objects
const harpoon = {};
const bubble = {};
const fishes = [];

// Game Vars
let isPaused = true;
let gameSpeed = 1;
let ctx;
let canvasWidth, canvasHeight;

//==================================================================

function initCanvas() {
    const canvas = document.getElementById('meucanvas');
    ctx = canvas.getContext('2d');

    if (!ctx) {
        alert("Não consegui abrir o contexto 2d :-(");
    }

    callbackWindowResize();

    window.onresize = callbackWindowResize;
    window.onkeydown = callbackKeyDown;
    
    canvas.onmousedown = onMouseDownCallback;
    canvas.onmousemove = onMouseMoveCallback;
}

function initInterface() {
    interface.playButton = document.getElementById('play-button');
    interface.tickButton = document.getElementById('tick-button');
    interface.speedRange = document.getElementById('velocity-range');

    interface.playButton.onclick = callbackPlayButtonPressed;
    interface.tickButton.onclick = callbackTickButtonPressed;
    interface.speedRange.onclick = callbackSpeedRangeChange;
}

function initHarpoon() {
    harpoon.posX = canvasWidth / 2;
    harpoon.posY = (1.03 - BEACH_DIMENSION) * canvasHeight;
}

function initBubble() {
    bubble.isActive = false;
    bubble.posX = harpoon.posX;
    bubble.posY = harpoon.posY;
}

function genRandColor() {
    return `rgba(${randInt(0, 255)}, ${randInt(0, 255)}, ${randInt(0, 255)}, 1.0)`;
}

function genRandFish() {
    const radius = randInt(10, 50);
    
    return {
        cor: genRandColor(),
        raio: radius,
        posX: randInt(0, canvasWidth - 2 * radius),
        posY: randInt(0, ((1 - BEACH_DIMENSION) * canvasHeight) - 2 * radius),
        nVertices: randInt(4, 20),
        velX: randInt(1, 10),
        velY: randInt(1, 10)
    };
}

function initFishes() {
    for (let i = 0; i < FISH_NUMBER; ++i) {
        fishes.push(genRandFish());
    }
}

function initGame() {
    initCanvas();
    initInterface();
    initHarpoon();
    initBubble();
    initFishes();
}

function drawGame() {
    drawCanvas();
    drawHarpoon();
    drawBubble();
}

function main() {
    initGame();
    drawGame();
    refreshGame();
}

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function isMouseInBeach(posY) {
    return (posY >= (1 - BEACH_DIMENSION) * canvasHeight);
}

function onMouseDownCallback(e) {
    const posY = e.offsetY;

    if (isMouseInBeach(posY)) {
        shootBubble();
    }
}

function onMouseMoveCallback(e) {
    const posX = e.offsetX;
    const posY = e.offsetY;

    if (isMouseInBeach(posY)) {
        harpoon.posX = posX;
    }
}

function callbackKeyDown(e) {
    const keyName = e.key;

    if (keyboard.key_d.includes(keyName)) {
        harpoon.posX += canvasWidth * SPEED_MULTIPLIER * 0.02 * gameSpeed;
        
        if (harpoon.posX > canvasWidth)  {
            harpoon.posX = canvasWidth
        }
    } else if (keyboard.key_a.includes(keyName)) {
        harpoon.posX -= canvasWidth * SPEED_MULTIPLIER * 0.02 * gameSpeed
        
        if (harpoon.posX < 0) {
            harpoon.posX = 0
        }
    } else if (keyboard.key_s.includes(keyName)) {
        shootBubble();
    }
    
    if (!bubble.isActive) {
        bubble.posX = harpoon.posX;
    }
}

function resizeFishes(widthRatio, heightRatio) {
    for (const fish of fishes) {
        fish.posX *= widthRatio / canvasWidth;
        fish.posY *= heightRatio / canvasHeight;
    }
}

function resizeHarpoon(widthRatio, heightRatio) {
    harpoon.posX *= widthRatio / canvasWidth;
    harpoon.posY = (1.03 - BEACH_DIMENSION) * heightRatio;
}

function resizeBubble(widthRatio, heightRatio) {
    bubble.posX *= widthRatio / canvasWidth;
    bubble.posY *= heightRatio / canvasHeight;
}

function resizeCanvas(widthRatio, heightRatio) {
    canvasWidth = widthRatio;
    canvasHeight = heightRatio;

    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
}

function callbackWindowResize(e) {
    const widthRatio = SEA_DIMENSION * window.innerWidth
    const heightRatio = SEA_DIMENSION * window.innerHeight

    resizeFishes(widthRatio, heightRatio);
    
    resizeHarpoon(widthRatio, heightRatio);

    resizeBubble(widthRatio, heightRatio);

    resizeCanvas(widthRatio, heightRatio);
}

function callbackPlayButtonPressed(e) {
    isPaused = !isPaused;

    interface.tickButton.disabled = !isPaused;

    if (isPaused) {
        interface.playButton.value = 'Jogar';
    } else {
        interface.playButton.value = 'Pausar';
    }
}

function callbackTickButtonPressed(e) {
    drawGame();
}

function callbackSpeedRangeChange(e) {
    gameSpeed = interface.speedRange.value;
}

function shootBubble() {
    if (bubble.isActive) {
        return;
    }
    bubble.isActive = true;
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

function refreshGame() {
    if (!isPaused) {
        clearCanvas();
        drawGame();
    }
    
    requestAnimationFrame(refreshGame);
}

function drawSea() {
    ctx.fillStyle = SEA_COLOR;
    ctx.fillRect(0, 0, canvasWidth, (1 - BEACH_DIMENSION) * canvasHeight);
}

function drawBeach() {
    ctx.fillStyle = BEACH_COLOR;
    ctx.fillRect(0, (1 - (BEACH_DIMENSION)) * canvasHeight, canvasWidth, BEACH_DIMENSION * canvasHeight);
}

function checkFishCollision(fish) {
    return bubble.isActive
        && fish.posX <= bubble.posX 
        && fish.posX + 2 * fish.raio >= bubble.posX 
        && fish.posY <= bubble.posY 
        && fish.posY + 2 * fish.raio >= bubble.posY;
}

function drawCanvas() {
    drawSea();
    
    for (let i = fishes.length - 1; i >= 0; i--) {
        if (checkFishCollision(fishes[i])) {
            fishes.splice(i, 1);
            bubble.isActive = false;
        } else {
            drawFish(fishes[i]);
        }
    }

    drawBeach();
}

function drawBubble() {
    if (bubble.isActive) {
        if (bubble.posY < 0) {
            bubble.isActive = false;
            return;
        }
        bubble.posY -= SPEED_MULTIPLIER * 20 * gameSpeed;
        
        let bubbleFrame = new Path2D();

        bubbleFrame.moveTo(
            bubble.posX - BUBBLE_DIMENSION * canvasWidth,
            bubble.posY - (BUBBLE_DIMENSION * 1.05) * canvasHeight
        );
        
        bubbleFrame.lineTo(
            bubble.posX + BUBBLE_DIMENSION * canvasWidth,
            bubble.posY - (BUBBLE_DIMENSION * 1.05) * canvasHeight
        );
        
        bubbleFrame.lineTo(
            bubble.posX + BUBBLE_DIMENSION * canvasWidth,
            bubble.posY + (BUBBLE_DIMENSION * 1.05) * canvasHeight
        );
        
        bubbleFrame.lineTo(
            bubble.posX - BUBBLE_DIMENSION * canvasWidth,
            bubble.posY + (BUBBLE_DIMENSION * 1.05) * canvasHeight
        );
        
        bubbleFrame.closePath();
        ctx.fill(bubbleFrame);
    }
}

function drawHarpoon() {
    if (!bubble.isActive) {
        bubble.posX = harpoon.posX
        bubble.posY = harpoon.posY
    }
    
    ctx.fillStyle = HARPOON_COLOR;
    
    let harpoonFrame = new Path2D();
    harpoonFrame.moveTo(
        harpoon.posX,
        harpoon.posY
    );

    harpoonFrame.lineTo(
        harpoon.posX + 0.01 * canvasWidth,
        harpoon.posY + 0.1 * canvasHeight
    );

    harpoonFrame.lineTo(
        harpoon.posX - 0.01 * canvasWidth,
        harpoon.posY + 0.1 * canvasHeight
    );

    harpoonFrame.closePath();
    
    ctx.fill(harpoonFrame);
}

function drawFish(fish) {
    fish.posX = fish.posX + 0.2 * fish.velX * gameSpeed;
    fish.posY = fish.posY + 0.2 * fish.velY * gameSpeed;

    if (fish.posX < 0) {
        fish.velX *= -1;
    }
    if (fish.posX + 2 * fish.raio >= canvasWidth) {
        fish.velX *= -1;
    }
    if (fish.posY < 0) {
        fish.velY *= -1;
    }
    if (fish.posY + 2 * fish.raio >= (1 - BEACH_DIMENSION) * canvasHeight) {
        fish.velY *= -1;
    }

    drawCircle(fish);
}

function drawCircle(circle) {
    const posX = circle.posX + circle.raio;
    const posY = circle.posY + circle.raio;
    
    const angle = 360 / circle.nVertices;

    ctx.fillStyle = circle.cor;
    let frame = new Path2D();
    
    frame.moveTo(posX, posY + circle.raio)
    for (let i = 1; i < circle.nVertices; i++) {
        frame.lineTo(
            posX + Math.sin(i * (angle * (Math.PI / 180))) * circle.raio,
            posY + Math.cos(i * (angle * (Math.PI / 180))) * circle.raio
        );
    }
    frame.closePath();
    ctx.fill(frame);
}
