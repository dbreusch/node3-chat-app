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

// server (emit) -> client (receive) - countUpdated
// client (emit) -> server (receive) - increment

// handle client connections
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message) => {
        console.log(message)
        io.emit('message', message)          // send to ALL connections
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })

})

// start express server on port
server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})