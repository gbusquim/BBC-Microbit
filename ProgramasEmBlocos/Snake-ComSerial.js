input.onButtonPressed(Button.B, function () {
    serial.writeString("B")
})
serial.onDataReceived(serial.delimiters(Delimiters.Fullstop), function () {
    txt = serial.readUntil(serial.delimiters(Delimiters.Fullstop))
    if (txt == "inicioJogo") {
        pontuacao = 0
        basic.showNumber(pontuacao)
    } else if (txt == "aumentoPontuacao") {
        pontuacao += 1
        basic.showNumber(pontuacao)
    } else if (txt == "fimJogo") {
        basic.showIcon(IconNames.Skull)
    }
})
input.onButtonPressed(Button.A, function () {
    serial.writeString("A")
})
let txt = ""
let pontuacao = 0
pontuacao = 0
