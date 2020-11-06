// client-side code for socket.io functionality

const socket = io()

const messageForm = document.querySelector('#message-form')
// const messageText = document.querySelector('#message')

socket.on('message', (message) => {
    console.log(message)
})

// send event to server when form button is clcked
messageForm.addEventListener('submit', (e) => {
    e.preventDefault()  // stop form refresh after submit

    // console.log('Form submitted')

    // const message = messageText.value
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message)
})

// -- count button app
// // receive event from server
// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated', count)
// })
//
// // send event to server when button is clcked
// document.querySelector('#increment').addEventListener('click', () => {
//     console.log('Clicked')
//     socket.emit('increment')
// })