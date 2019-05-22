// JavaScript code for the Microbit Demo app.

/**
 * Object that holds application data and functions.
 */
var app = {};

/**
 * Timeout (ms) after which a message is shown if the Microbit wasn't found.
 */
app.CONNECT_TIMEOUT = 3000;

/**
 * Object that holds Microbit UUIDs.
 */
app.microbit = {};
app.microbit.UART_SERVICE = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
app.microbit.UART_TX_DATA = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
var BLE_NOTIFICATION_UUID = '00002902-0000-1000-8000-00805f9b34fb';

/**
 * Initialise the application.
 */
app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(app.onDeviceReady) },
		false);
}

function onConnect(context) {
  console.log("Client Connected");
  console.log(context);
}

app.onDeviceReady = function()
{
	app.showInfo("Este programa funcionará após o Microbit estiver conectado.");
}

app.showInfo = function(info)
{
	document.getElementById('Status').innerHTML = info;
}

app.onStartButton = function()
{
	app.onStopButton();
	app.startScan();
	app.showInfo('Status: Scanning...');
	app.startConnectTimer();
}

app.onStopButton = function()
{
	// Stop any ongoing scan and close devices.
	app.stopConnectTimer();
	evothings.easyble.stopScan();
	evothings.easyble.closeConnectedDevices();
	app.showInfo('Status: Stopped.');
}

app.startConnectTimer = function()
{
	// If connection is not made within the timeout
	// period, an error message is shown.
	app.connectTimer = setTimeout(
		function()
		{
			app.showInfo('Status: Scanning... ' +
				'Please start the Microbit.');
		},
		app.CONNECT_TIMEOUT)
}

app.stopConnectTimer = function()
{
	clearTimeout(app.connectTimer);
}

app.startScan = function()
{
	evothings.easyble.startScan(
		function(device)
		{
			// Connect if we have found an Microbit.
			if (app.deviceIsMicrobit(device))
			{
				app.showInfo('Status: Device found: ' + device.name + '.');
				evothings.easyble.stopScan();
				app.connectToDevice(device);
				app.stopConnectTimer();
			}
		},
		function(errorCode)
		{
			app.showInfo('Error: startScan: ' + errorCode + '.');
		});
}

app.deviceIsMicrobit = function(device)
{
	console.log('device name: ' + device.name);
	return (device != null) &&
		(device.name != null) &&
		((device.name.indexOf('MicroBit') > -1) ||
			(device.name.indexOf('micro:bit') > -1));
};

/**
 * Read services for a device.
 */
app.connectToDevice = function(device)
{
	app.showInfo('Connecting...');
	setTimeout(function(){
		//do what you need here
	}, 500);
	device.connect(
		function(device)
		{
			app.showInfo('Status: Connected - reading Microbit services...');
			app.readServices(device);
		
		},
		function(errorCode)
		{
			app.showInfo('Error: Connection failed: ' + errorCode + '.');
			evothings.ble.reset();
		});
}


app.readServices = function(device)
{
	device.readServices(
		[app.microbit.UART_SERVICE],
		app.startNotifications,
		function(errorCode)
		{
			console.log('Error: Failed to read services: ' + errorCode + '.');
		});
		
} 
app.writeNotificationDescriptor = function(device, characteristicUUID)
{
	device.writeDescriptor(
		characteristicUUID,
		BLE_NOTIFICATION_UUID,
		new Uint8Array([1,0]),
		function()
		{
			console.log('writeDescriptor '+characteristicUUID+' ok.');
		},
		function(errorCode)
		{
			// This error will happen on iOS, since this descriptor is not
			// listed when requesting descriptors. On iOS you are not allowed
			// to use the configuration descriptor explicitly. It should be
			// safe to ignore this error.
			console.log('Error: writeDescriptor: ' + errorCode + '.');
		});
}

app.startNotifications = function(device)
{
	app.showInfo('Status: Starting notifications...');

	//app.readDeviceInfo(device);

	// Due to https://github.com/evothings/cordova-ble/issues/30
	// ... we have to do double work to make it function properly
	// on both Android and iOS. This first part is only needed for Android
	// and causes an error message on iOS that is safe to ignore.

	// Set notifications to ON.
	app.writeNotificationDescriptor(device, app.microbit.UART_TX_DATA);

	app.showInfo('Exercicio obtido!');
	// Set sensor period to 160 ms.
	//var periodDataBuffer = new ArrayBuffer(2);
	//new DataView(periodDataBuffer).setUint16(0, 160, true);
	//app.writeCharacteristic(device, app.microbit.ACCELEROMETER_PERIOD, periodDataBuffer);
	//app.writeCharacteristic(device, app.microbit.MAGNETOMETER_PERIOD, periodDataBuffer);



	//UART
	device.enableNotification(
		app.microbit.UART_TX_DATA,
		app.handleUART,
		function(errorCode)
		{
			console.log('Error: enableNotification: ' + errorCode + '.');
		});
	

	// Start magnetometer bearing notification.
	// device.enableNotification(
	// 	app.microbit.MAGNETOMETER_BEARING,
	// 	app.handleMagnetometerBearing,
	// 	function(errorCode)
	// 	{
	// 		console.log('Error: enableNotification: ' + errorCode + '.');
	// 	});

}


// app.sendMessage = function()
// {

// 	console.log("printando a mensagem");
// 	//var a =[0x1,0x2,0,0x3,0x4];

// 	minhaString = localStorage.getItem("UART");
// 	//minhaString = "Lm2$LM200$"
// 	console.log(minhaString);
// 	app.writeCharacteristic(app.device, app.microbit.UART_RX_DATA,evothings.ble.toUtf8(minhaString));
	
// }

// app.writeCharacteristic = function(device, characteristicUUID, value) {
// 	device.writeCharacteristic(
// 		characteristicUUID,
// 		new Uint8Array(value),
// 		function()
// 		{
// 			console.log('writeCharacteristic '+characteristicUUID+' ok.');
// 		},
// 		function(errorCode)
// 		{
// 			console.log('Error: writeCharacteristic: ' + errorCode + '.');
// 		});
// }


function utf8ArrayToStr(array, errorHandler) {
	var out, i, len, c;
	var char2, char3;
	array = new Uint8Array(array);
	out = "";
	len = array.length;
	i = 0;
	while(i < len) {
		c = array[i++];
		switch(c >> 4) {
		case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
			// 0xxxxxxx
			out += String.fromCharCode(c);
			break;
		case 12: case 13:
			// 110x xxxx 10xx xxxx
			char2 = array[i++];
			out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
			break;
		case 14:
			// 1110 xxxx 10xx xxxx 10xx xxxx
			char2 = array[i++];
			char3 = array[i++];
			out += String.fromCharCode(((c & 0x0F) << 12) |
			((char2 & 0x3F) << 6) |
			((char3 & 0x3F) << 0));
			break;
		default:
			if(errorHandler)
				out = errorHandler(out, c)
			else
				throw "Invalid UTF-8!";
		}
	}
	return out;
}

app.handleUART = function(data)
{
	var stringUART = utf8ArrayToStr(data);
	var stringUART = stringUART.split("$");
	var numPassos = stringUART[0];
	var distanciaPercorrida = stringUART[0]*0.82;
	var duracaoExercicio = stringUART[1];

	//pegando data atual
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	today = mm + '/' + dd + '/' + yyyy;

	app.value('NumPassos',numPassos);
	app.value('DistanciaPercorrida',distanciaPercorrida);
	app.value('DuracaoExercicio',duracaoExercicio);
	var novoExercicio = [today,numPassos,distanciaPercorrida,duracaoExercicio]
	var historico = localStorage.getItem("Historico");
	if(historico==null)
	{
		historico = [];
	}
	historico.push(novoExercicio);
	localStorage.setItem("Historico", historico);
}

app.value = function(elementId, value)
{
	document.getElementById(elementId).innerHTML = value;
}

// Initialize the app.


app.initialize();
