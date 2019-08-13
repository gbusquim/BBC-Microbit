function insertNewFood () {
    fStop = false
    while (fStop == false) {
        foodX = Math.randomRange(0, 4)
        foodY = Math.randomRange(0, 4)
        fStop = true
        for (let index = 0; index <= snakeX.length - 1; index++) {
            checkX = snakeX[index]
            checkY = snakeY[index]
            if (checkX == foodX && checkY == foodY) {
                fStop = false
            }
        }
    }
}
function hasEatenFood () {
    score = score + 1
    game.setScore(score)
    snakeX.insertAt(snakeX.length, foodX)
    snakeY.insertAt(snakeY.length, foodY)
}
function draw () {
    basic.clearScreen()
    for (let snakeBodyPartPixel = 0; snakeBodyPartPixel <= snakeX.length - 1; snakeBodyPartPixel++) {
        led.plot(snakeX[snakeBodyPartPixel], snakeY[snakeBodyPartPixel])
    }
    led.plotBrightness(foodX, foodY, 21)
}
function getButtonInput () {
    if (currentDirection == "Right") {
        dx = 1
        dy = 0
    } else if (currentDirection == "Up") {
        dx = 0
        dy = -1
    } else if (currentDirection == "Down") {
        dx = 0
        dy = 1
    } else if (currentDirection == "Left") {
        dx = -1
        dy = 0
    }
}
input.onButtonPressed(Button.AB, function () {
    snakeX.insertAt(0, 2)
    snakeY.insertAt(0, 4)
    foodX = Math.randomRange(0, 4)
    foodY = Math.randomRange(0, 4)
    led.plotBrightness(foodX, foodY, 21)
    gameOn = 1
})
input.onButtonPressed(Button.B, function () {
    if (gameOn == 1) {
        if (currentDirection == "Up") {
            currentDirection = "Right"
        } else if (currentDirection == "Right") {
            currentDirection = "Down"
        } else if (currentDirection == "Down") {
            currentDirection = "Right"
        } else {
            currentDirection = "Up"
        }
    }
})
input.onButtonPressed(Button.A, function () {
    if (gameOn == 1) {
        if (currentDirection == "Up") {
            currentDirection = "Left"
        } else if (currentDirection == "Left") {
            currentDirection = "Down"
        } else if (currentDirection == "Down") {
            currentDirection = "Left"
        } else {
            currentDirection = "Up"
        }
    }
})
function checkGameOver () {
    if (headX < 0 || headX > 4 || (headY < 0 || headY > 4)) {
        game.gameOver()
    }
    for (let index2 = 0; index2 <= snakeX.length - 2; index2++) {
        if (headX == snakeX[index2] && headY == snakeY[index2]) {
            game.gameOver()
        }
    }
}
function moveSnake () {
    for (let snakeBodyPart = 0; snakeBodyPart <= snakeX.length - 2; snakeBodyPart++) {
        nextValueX = snakeX[snakeBodyPart + 1]
        nextValueY = snakeY[snakeBodyPart + 1]
        snakeX[snakeBodyPart] = nextValueX
        snakeY[snakeBodyPart] = nextValueY
    }
    snakeX[snakeX.length - 1] = headX
    snakeY[snakeX.length - 1] = headY
}
let nextValueY = 0
let nextValueX = 0
let headY = 0
let headX = 0
let snakeY: number[] = []
let checkY = 0
let checkX = 0
let snakeX: number[] = []
let foodY = 0
let foodX = 0
let fStop = false
let currentDirection = ""
let gameOn = 0
let score = 0
let dy = 0
let dx = 0
dx = 0
dy = -1
score = 0
let timeDelayGame = 600
let levelGame = 1
gameOn = 0
currentDirection = "Up"
basic.showString("SNAKE")
basic.forever(function () {
    if (gameOn == 1) {
        if (snakeX.length == 13) {
            basic.pause(2000)
            basic.showString("Voce Venceu!")
            gameOn = 0
        }
        getButtonInput()
        headX = snakeX[snakeX.length - 1] + dx
        headY = snakeY[snakeY.length - 1] + dy
        if (headX == foodX && headY == foodY) {
            hasEatenFood()
            insertNewFood()
        } else {
            checkGameOver()
            moveSnake()
        }
        draw()
        basic.pause(timeDelayGame)
    }
})
