
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
	//app.showInfo("Este programa funcionará após o Microbit estiver conectado.");
}

app.showInfo = function(info)
{
	document.getElementById('Status').innerHTML = info;
}

app.onStartButton = function()
{
	app.onStopButton();
	app.startScan();
	//app.showInfo('Status: Scanning...');
	app.startConnectTimer();
}

app.onStopButton = function()
{
	// Stop any ongoing scan and close devices.
	app.stopConnectTimer();
	evothings.easyble.stopScan();
	evothings.easyble.closeConnectedDevices();
	//app.showInfo('Status: Stopped.');
}

app.startConnectTimer = function()
{
	// If connection is not made within the timeout
	// period, an error message is shown.
	app.connectTimer = setTimeout(
		function()
		{
			//app.showInfo('Status: Scanning... ' +
			//	'Please start the Microbit.');
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
	app.showInfo('Connecting...');
	setTimeout(function(){	
	device.connect(
		function(device)
		{
			//app.showInfo('Status: Connected - reading Microbit services...');
			app.readServices(device);
		
		},
		function(errorCode)
		{
			app.showInfo('A conexão não foi estabelecida, por favor tente novamente.');
			evothings.ble.reset();
		});
	}, 1000);
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

			console.log('Error: writeDescriptor: ' + errorCode + '.');
		});
}

app.startNotifications = function(device)
{
	//app.showInfo('Status: Starting notifications...');


	app.writeNotificationDescriptor(device, app.microbit.UART_TX_DATA);

	app.showInfo('Exercícios obtidos!');




	//UART
	setTimeout(function(){
	device.enableNotification(
		app.microbit.UART_TX_DATA,
		app.handleUART,
		function(errorCode)
		{
			console.log('Error: enableNotification: ' + errorCode + '.');
		});},1000);
	
}




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
	//pegando data atual
	var hoje = new Date();
	var dia = hoje.getDate();
	var mes = hoje.getMonth() + 1;
	var ano = hoje.getFullYear();
	
	var dataAtual = dia + '/' + mes + '/' + ano;

	//pegando dados enviados por bluetooth
	var stringUART = utf8ArrayToStr(data);
	stringUART = stringUART.split(",");
	stringUART = stringUART.slice(0,stringUART.length-1);
	

	stringUART.forEach
	(
		function (element)
		{
			console.log(element)
			var exercicioCorr = element.split("$");
			var distanciaPercorrida = exercicioCorr[0]*0.82;
			var duracaoSegundosExercicio = parseInt(exercicioCorr[1]);
			var duracaoMinutosExercicio = Math.floor(duracaoSegundosExercicio / 60);
			var duracaoExercicio = duracaoMinutosExercicio.toString() + "m " + duracaoSegundosExercicio.toString() + "s";
			
			var novoExercicio = [dataAtual,distanciaPercorrida,duracaoExercicio]
			var historico = JSON.parse(localStorage.getItem("Historico"));
			if(historico==null)
			{
				historico = [];
			}
			historico.push(novoExercicio);
			localStorage.setItem("Historico", JSON.stringify(historico));
		}
	)

}



// Initialize the app.


app.initialize();
