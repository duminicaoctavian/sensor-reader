let config = require('./config/config.js')
let express = require('express')
let http = require('http')
let bodyParser = require('body-parser')
let SerialPort = require('serialport')
let Readline = SerialPort.parsers.Readline
let axios = require('axios')
let uuidv4 = require('uuid/v4')

let port = process.env.PORT

function createPayload(toolId, sensorId, pressure, temp, humidity) {
	return {
		toolId,
		sensorId,
		pressure,
		temp,
		humidity
	}
}

async function postTask(json) {
	console.log(json)

	await axios.post("http://192.168.43.61:8084/data", json)
		.then(() => {
			console.log(`Success`)
		})
		.catch((error) => {
			console.log(`Failure with error: ${error}`)
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
	parser.on('data', async (data) => {

		let toolId = Math.floor(1 + Math.random() * 3)
		let sensorId = toolId
		console.log(`ToolID: ${toolId}, SensorID: ${sensorId}`)

		let measurementsArray = data.split(',')

		let pressure = measurementsArray[0]
		let temp = measurementsArray[1]
		let humidity = measurementsArray[2]

		if (sensorId == 1) {
			let json = createPayload(toolId, sensorId, pressure, "", "")
			await postTask(json)
		} else if (sensorId == 2) {
			let json = createPayload(toolId, sensorId, "", temp, "")
			await postTask(json)
		} else if (sensorId == 3) {
			let json = createPayload(toolId, sensorId, "", "", humidity)
			await postTask(json)
		}
	})
})

module.exports = {
	app
}
