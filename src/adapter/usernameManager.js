const { User } = require("../database")

async function getUsername(socketid) {
    return await User.getUsername(socketid)
}

async function setUsername(socketid, username) {
    await User.setUsername(socketid, username) 
}

async function getSocketId(username) {
    await User.getSocketId(username)
}

async function isUsernameExist(username) {
    return await User.isUsernameExist(username)
}

async function deleteUsername(socketid) {
    await User.deleteUsername(socketid)
}

async function getUsernameFromSocketId(socketid) {
    return await getUsername(socketid)
}

async function deleteUser(socketid) {
    console.log(`Xóa user ${socketid} khỏi cơ sở dữ liệu.`)
    await User.deleteUser(socketid)
}

module.exports = {
    getUsername,
    getSocketId,
    isUsernameExist,
    deleteUsername,
    setUsername,
    getUsernameFromSocketId,
    deleteUser
}