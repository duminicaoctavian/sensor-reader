let config = require('./config/config.js')
let express = require('express')
let http = require('http')
let bodyParser = require('body-parser')

let port = process.env.PORT

var app = express()
var server = http.createServer(app)

app.use(bodyParser.json())

server.listen(port, () => {
	console.log(`Sensor Reader started on port ${port}`)
})

var btSerial = new (require('bluetooth-serial-port')).BluetoothSerialPort()
btSerial.inquire()

btSerial.on('found', function (address, name) {

	console.log(`Address: ${address}, name: ${name}`)

	btSerial.findSerialPortChannel(address, function (channel) {
		btSerial.connect(address, channel, function () {
			console.log('connected')

			btSerial.write(Buffer.from('my data', 'utf-8'), function (err, bytesWritten) {
				if (err) console.log(err)
			})

			btSerial.on('data', function (buffer) {
				console.log(buffer.toString('utf-8'))
			});
		}, function () {
			console.log('cannot connect');
		});

		// close the connection when you're ready
		btSerial.close()
	}, function () {
		console.log('Found nothing')
	})
})


module.exports = {
	app
}
