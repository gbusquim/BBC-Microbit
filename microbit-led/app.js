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

app.microbit.LED_SERVICE = 'e95dd91d-251d-470a-a062-fa1922dfa9a8';
app.microbit.LED_BITMAP = 'e95d7b77-251d-470a-a062-fa1922dfa9a8';
app.microbit.LED_TEXT =   'e95d93ee-251d-470a-a062-fa1922dfa9a8';
app.microbit.LED_TEXT_SPEED = 'e95d0d2d-251d-470a-a062-fa1922dfa9a8';
app.microbit.LED_MATRIX = 'e95d7b77-251d-470a-a062-fa1922dfa9a8';

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
		[app.microbit.LED_SERVICE],
		function(device)
    {app.device
		app.showInfo('Connection established. Ready for input.');
		document.getElementById("escreverMensagem").style.display="block";
	    app.device = device;
    },
		function(errorCode)
		{
			console.log('Error: Failed to read services: ' + errorCode + '.');
		});
} 

app.printPhoneModel = function()
{
	console.log("printando a mensagem");
	//var a =[0x1,0x2,0,0x3,0x4];

	minhaString = document.getElementById("myInput").value;
	console.log(minhaString);
	console.log(typeof(minhaString));
	app.writeCharacteristic(app.device, app.microbit.LED_TEXT,evothings.ble.toUtf8(minhaString));
}

app.writeCharacteristic = function(device, characteristicUUID, value) {
	device.writeCharacteristic(
		characteristicUUID,
		new Uint8Array(value),
		function()
		{
			console.log('writeCharacteristic '+characteristicUUID+' ok.');
		},
		function(errorCode)
		{
			console.log('Error: writeCharacteristic: ' + errorCode + '.');
		});
}

app.value = function(elementId, value)
{
	document.getElementById(elementId).innerHTML = value;
}

// Initialize the app.
app.initialize();
