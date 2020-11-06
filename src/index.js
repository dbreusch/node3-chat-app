const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)   // create server
const io = socketio(server)             // connect server to socket.io

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// server function for client connections
io.on('connection', () => {
    console.log('New WebSocket connection')
})

// start express server on port
server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})