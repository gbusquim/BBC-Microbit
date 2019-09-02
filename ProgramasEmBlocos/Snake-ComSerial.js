let txt = ""
let pontuacao = 0
input.onButtonPressed(Button.B, function () {
    serial.writeString("B")
})
input.onButtonPressed(Button.A, function () {
    serial.writeString("A")
})
basic.forever(function () {
    txt = serial.readString()
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
