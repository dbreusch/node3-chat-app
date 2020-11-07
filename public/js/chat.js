// client-side code for socket.io functionality

const socket = io()

// Elements
//   Form
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
//   Location button
const $sendLocationButton = document.querySelector('#location-button')
//   Messages
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

// send event to server when form button is clcked
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()  // stop form refresh after submit

    //disable send button
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        // (re)enable send button, clear input, focus on input
        $messageFormButton.removeAttribute('disabled', 'disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('The message was delivered')
    })
})

// send location event
$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    //disable send button
    $sendLocationButton.setAttribute('disabled', 'disabled')

    // getCurrentPosition is async but does NOT support Promises
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        socket.emit('sendLocation', {
            latitude: lat,
            longitude: lon
        }, () => {
            // (re)enable send button
            $sendLocationButton.removeAttribute('disabled', 'disabled')
            console.log('Location shared!')
        })
    })
})