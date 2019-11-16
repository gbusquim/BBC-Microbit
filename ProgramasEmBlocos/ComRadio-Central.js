radio.onReceivedValue(function (name, value) {
    valores = "" + valores + name + "-" + value + "$"
    timeStampUltimaResposta = input.runningTime()
})
serial.onDataReceived(serial.delimiters(Delimiters.Fullstop), function () {
    timeStampUltimaResposta = 99999999
    inicioTransmissao = 1
    mensagem = serial.readUntil(serial.delimiters(Delimiters.Fullstop))
    radio.sendString(mensagem.charAt(0))
})
let mensagem = ""
let inicioTransmissao = 0
let timeStampUltimaResposta = 0
let valores = ""
radio.setGroup(1)
valores = ""
timeStampUltimaResposta = 99999999
inicioTransmissao = 0
basic.forever(function () {
    if (inicioTransmissao == 1) {
        if (input.runningTime() - timeStampUltimaResposta > 1000) {
            serial.writeString(valores)
            inicioTransmissao = 0
            valores = ""
        }
    }
})
