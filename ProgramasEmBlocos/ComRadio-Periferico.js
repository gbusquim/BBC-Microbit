radio.onReceivedString(function (receivedString) {
    if (receivedString == "t") {
        basic.showString("t")
        radio.sendValue(id, input.temperature())
    } else if (receivedString == "l") {
        basic.showString("l")
        radio.sendValue(id, input.lightLevel())
    }
})
let id = ""
radio.setGroup(1)
id = "1"
