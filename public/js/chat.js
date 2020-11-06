// client-side code for socket.io functionality

const socket = io()

// receive event from server
socket.on('countUpdated', (count) => {
    console.log('The count has been updated', count)
})

// send event to server when button is clcked
document.querySelector('#increment').addEventListener('click', () => {
    console.log('Clicked')
    socket.emit('increment')
})