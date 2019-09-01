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
app.microbit.UART_RX_DATA = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';
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
				app.showInfo('Dispositivo encontrado, enviando comandos...');
				evothings.easyble.stopScan();
				app.connectToDevice(device);
				app.stopConnectTimer();
			}
		},
		function(errorCode)
		{
			app.showInfo('A conexão não foi estabelecida, por favor tente novamente.');
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
	//app.showInfo('Connecting...');
	setTimeout(function(){
	device.connect(
		function(device)
		{
			app.showInfo('Status: Connected - reading Microbit services...');
			app.readServices(device);
		
		},
		function(errorCode)
		{
			app.showInfo('A conexão não foi estabelecida, por favor tente novamente.');
			evothings.ble.reset();
		});
},1000);
}


app.readServices = function(device)
{
	device.readServices(
		[app.microbit.UART_SERVICE],
		function(device)
    {
		app.showInfo('Comandos enviados!');
			app.device = device;
			app.sendMessage();
    },
		function(errorCode)
		{
			console.log('A conexão não foi estabelecida, por favor tente novamente.');
		});
		
} 

app.sendMessage = function()
{

	console.log("printando a mensagem");
	//var a =[0x1,0x2,0,0x3,0x4];

	UARTluz = localStorage.getItem("UARTluz");
	UARTtemp = localStorage.getItem("UARTtemp");
	var UARTfinal = "";
	if(UARTluz==null && UARTtemp!=null)
		UARTfinal=UARTtemp;
	else if(UARTluz!=null && UARTtemp==null)
		UARTfinal=UARTluz;
	else if (UARTluz!=null && UARTtemp!=null)
		UARTfinal=UARTluz+UARTtemp;
	console.log(UARTfinal);
	app.writeCharacteristic(app.device, app.microbit.UART_RX_DATA,evothings.ble.toUtf8(UARTluz));
	app.writeCharacteristic(app.device, app.microbit.UART_RX_DATA,evothings.ble.toUtf8(UARTtemp));
	//app.onStopButton();
	
}

app.writeCharacteristic = function(device, characteristicUUID, value) {
	setTimeout(function(){
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
},1000);}


// Initialize the app.
app.initialize();
