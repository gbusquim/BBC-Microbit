input.onButtonPressed(Button.B, function () {
    if (modoExercicio == 1) {
        basic.showString("End")
        modoExercicio = 0
        tempoFinal = input.runningTime()
        duracaoExercicio = Math.round(tempoFinal / 1000 - tempoInicial / 1000)
    }
})
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
    basic.pause(3000)
    bluetooth.uartWriteString("" + numPassos + "$" + duracaoExercicio)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Asleep)
})
input.onButtonPressed(Button.A, function () {
    if (modoExercicio == 0) {
        basic.showString("Start")
        numPassos = 0
        modoExercicio = 1
        tempoInicial = input.runningTime()
    }
})
input.onGesture(Gesture.Shake, function () {
    if (modoExercicio == 1) {
        basic.showString("MOVE")
        numPassos += 1
    }
})
let duracaoExercicio = 0
let tempoInicial = 0
let tempoFinal = 0
let numPassos = 0
let modoExercicio = 0
bluetooth.startUartService()
modoExercicio = 0
numPassos = 0
tempoFinal = 0
tempoInicial = 0
duracaoExercicio = 0
