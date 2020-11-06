// client-side code for socket.io functionality

const socket = io()

const messageForm = document.querySelector('#message-form')

socket.on('message', (message) => {
    console.log(message)
})

// send event to server when form button is clcked
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()  // stop form refresh after submit

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})
