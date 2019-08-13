bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Happy)
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.Sad)
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Dollar), function () {
    bluetoothMessage = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Dollar))
    firstLetter = bluetoothMessage.substr(0, 1)
    greaterlesser = bluetoothMessage.substr(1, 1)
    length_of_number = bluetoothMessage.length
    length_of_number += -2
    if (firstLetter == "t") {
        basic.showString("Temp")
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
let currentLightMIN = 0
let currentLightMAX = 0
bluetooth.startUartService()
currentLightMAX = 600
currentLightMIN = -10
basic.forever(function () {
    if (input.lightLevel() < currentLightMIN) {
        basic.showIcon(IconNames.House)
    } else if (input.lightLevel() > currentLightMAX) {
        basic.showIcon(IconNames.Skull)
    } else {
        basic.showIcon(IconNames.TShirt)
    }
    basic.pause(500)
})
