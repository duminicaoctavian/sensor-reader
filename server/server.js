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

module.exports = {
	app
}
