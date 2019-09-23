serial.onDataReceived(serial.delimiters(Delimiters.Dollar), function () {
    txt = serial.readUntil(serial.delimiters(Delimiters.Dollar))
    if (txt == "start") {
        basic.showNumber(pontuacao)
    } else if (txt == "comeu") {
        pontuacao += 1
        basic.showNumber(pontuacao)
    } else if (txt == "gameOver") {
        basic.showIcon(IconNames.Skull)
        pontuacao = 0
    }
})
input.onButtonPressed(Button.B, function () {
    serial.writeString("B")
})
input.onButtonPressed(Button.A, function () {
    serial.writeString("A")
})
let txt = ""
let pontuacao = 0
pontuacao = 0
basic.showNumber(pontuacao)
