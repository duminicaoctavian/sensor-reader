let config = require('./config/config.js')
let express = require('express')
let http = require('http')
let bodyParser = require('body-parser')
let SerialPort = require('serialport')
let Readline = SerialPort.parsers.Readline

let port = process.env.PORT

var app = express()
var server = http.createServer(app)

app.use(bodyParser.json())

server.listen(port, () => {
	console.log(`PTH Sensor reader started on port ${port}`)

	// Read sensor data
	const serialport = new SerialPort('COM3')
	const parser = new Readline()
	serialport.pipe(parser)
	parser.on('data', (data) => {


		let toolId = Math.floor(1 + Math.random() * 3)
		let sensorId = toolId
		console.log(`ToolID: ${toolId}, SensorID: ${sensorId}`)
		console.log(data)
	})
})

module.exports = {
	app
}
