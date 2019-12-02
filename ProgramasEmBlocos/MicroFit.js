input.onButtonPressed(Button.B, function () {
    if (modoExercicio == 1) {
        basic.showString("Fim")
        modoExercicio = 0
        tempoFinal = input.runningTime()
        quantPassos.push(numPassos)
        temposDecorridos.push(Math.round(tempoFinal / 1000 - tempoInicial / 1000))
    }
})
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
    basic.pause(3000)
    numeroExercicios = quantPassos.length
    mensagemFinal = ""
    for (let index = 0; index <= numeroExercicios; index++) {
        mensagemFinal = "" + mensagemFinal + convertToText(quantPassos[index]) + "$" + convertToText(temposDecorridos[index]) + ","
    }
    bluetooth.uartWriteString(mensagemFinal)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Asleep)
})
input.onButtonPressed(Button.A, function () {
    if (modoExercicio == 0) {
        basic.showString("Inicio")
        numPassos = 0
        modoExercicio = 1
        tempoInicial = input.runningTime()
    }
})
input.onGesture(Gesture.Shake, function () {
    if (modoExercicio == 1) {
        basic.showString("Andou")
        numPassos += 1
    }
})
let mensagemFinal = ""
let numeroExercicios = 0
let temposDecorridos: number[] = []
let quantPassos: number[] = []
let tempoInicial = 0
let tempoFinal = 0
let numPassos = 0
let modoExercicio = 0
basic.clearScreen()
bluetooth.startUartService()
modoExercicio = 0
numPassos = 0
tempoFinal = 0
tempoInicial = 0
quantPassos = []
temposDecorridos = []
