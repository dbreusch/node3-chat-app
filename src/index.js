const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)   // create server
const io = socketio(server)             // connect server to socket.io

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

// server (emit) -> client (receive) --acknowledgement-> server
// client (emit) -> server (receive) --acknowledgement-> client

// handle client connections
io.on('connection', (socket) => {
    // console.log('New WebSocket connection')

    // connection entry messages (deprecated)
    // socket.emit('message', generateMessage('Welcome!'))
    // socket.broadcast.emit('message', generateMessage('A new user has joined!'))

    // handler for join event
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
             return callback(error)
        }

        socket.join(user.room)            // create a group of connections (?)
        // io.to.emit                   send to all in a room
        // socket.broadcast.to.emit     send to everyone else in a room

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    // handler for sendMessage event
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        const user = getUser(socket.id)
        if (!user) {
            return callback(error)
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))

        callback()
    })

    // handler for sendLocation event
    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        if (!user) {
            return callback(error)
        }

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

        callback()
    })

    // handler for disconnect event
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })

})

// start express server on port
server.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})