bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Sad)
})
input.onButtonPressed(Button.A, function () {
    if (lightState == 0) {
        lightState = 1
        led.plot(2, 1)
    } else {
        lightState = 0
        led.unplot(2, 1)
    }
})
input.onButtonPressed(Button.B, function () {
    if (airConditionerState == 0) {
        airConditionerState = 1
        led.plot(2, 3)
    } else {
        airConditionerState = 0
        led.unplot(2, 3)
    }
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Dollar), function () {
    bluetoothMessage = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Dollar))
    firstLetter = bluetoothMessage.substr(0, 1)
    greaterlesser = bluetoothMessage.substr(1, 1)
    length_of_number = bluetoothMessage.length
    length_of_number += -2
    if (firstLetter == "T") {
        if (greaterlesser == "M") {
            currentTempMAX = parseFloat(bluetoothMessage.substr(2, length_of_number))
        } else if (greaterlesser == "m") {
            currentTempMIN = parseFloat(bluetoothMessage.substr(2, length_of_number))
        }
    } else if (firstLetter == "L") {
        if (greaterlesser == "M") {
            currentLightMAX = parseFloat(bluetoothMessage.substr(2, length_of_number))
        } else if (greaterlesser == "m") {
            currentLightMIN = parseFloat(bluetoothMessage.substr(2, length_of_number))
        }
    }
})
let length_of_number = 0
let greaterlesser = ""
let firstLetter = ""
let bluetoothMessage = ""
let airConditionerState = 0
let lightState = 0
let currentTempMIN = 0
let currentTempMAX = 0
let currentLightMIN = 0
let currentLightMAX = 0
bluetooth.startUartService()
currentLightMAX = 600
currentLightMIN = -10
currentTempMAX = 600
currentTempMIN = -10
lightState = 0
airConditionerState = 0
basic.forever(function () {
    if (input.lightLevel() < currentLightMIN) {
        led.plot(2, 1)
    } else if (input.lightLevel() > currentLightMAX) {
        led.unplot(2, 1)
    }
    if (input.temperature() < currentTempMIN) {
        led.unplot(2, 3)
    } else if (input.temperature() > currentTempMAX) {
        led.plot(2, 3)
    }
    basic.pause(500)
})
