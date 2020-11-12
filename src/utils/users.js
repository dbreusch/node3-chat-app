const users = []

// addUser
const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //  Store user
    const user = { id, username, room }
    users.push(user)
    return { user }

}

addUser({
    id: 22,
    username: 'Dave',
    room: 'Office'
})
addUser({
    id: 23,
    username: 'Bob',
    room: 'Office'
})
addUser({
    id: 19,
    username: 'Sally',
    room: 'Kitchen'
})

// console.log(users)

// removeUser
const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id
    )

    if (index !== -1) {
        return users.splice(index, 1)[0]    // return user removed
    }
}

// getUser
const getUser = (id) => {
    return users.find((user) => user.id === id
    )
}

// const user = getUser(22)
// console.log(user)

// getUsersInRoom
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()    // no harm in being sure room is "clean"
    return users.filter((user) => {
        return user.room === room
    })
}

// const userList = getUsersInRoom('office')
// console.log(userList``)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}