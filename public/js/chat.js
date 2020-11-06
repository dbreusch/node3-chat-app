// client-side code for socket.io functionality

const socket = io()

const messageForm = document.querySelector('#message-form')
const locationButton = document.querySelector('#send-location')

socket.on('message', (message) => {
    console.log(message)
})

// send event to server when form button is clcked
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()  // stop form refresh after submit

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})

// send location event
locationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    // getCurrentPosition is async but does NOT support Promises
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        socket.emit('sendLocation', {
            latitude: lat,
            longitude: lon
        })
    })
})