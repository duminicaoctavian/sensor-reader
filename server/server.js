let config = require('./config/config.js')
let express = require('express')
let http = require('http')
let bodyParser = require('body-parser')
let SerialPort = require('serialport')
let Readline = SerialPort.parsers.Readline

let port = process.env.PORT
//int 
//double
//int

function createPayload(toolID, sensorId, pressure, temp, humidity) {
	return JSON.stringify({
		toolID,
		sensorId,
		pressure,
		temp,
		humidity
	})
}

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

		let measurementsArray = data.split(',')
		
		let pressure = measurementsArray[0]
		let temp = measurementsArray[1]
		let humidity = measurementsArray[2]

		if (sensorId == 1) {
			let json = createPayload(toolId, sensorId, pressure, "", "")
			console.log(json)
		} else if (sensorId == 2) {
			let json = createPayload(toolId, sensorId, "", temp, "")
			console.log(json)
		} else if (sensorId == 3) {
			let json = createPayload(toolId, sensorId, "", "", humidity)
			console.log(json)
		}
	})
})

module.exports = {
	app
}
