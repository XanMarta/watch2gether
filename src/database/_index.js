const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))

/**
 * User db
 */
const userSchema = new mongoose.Schema({ 
});

const User = mongoose.model('User', userSchema);

async function user_add() {
    const user = new User({
    });

    const result = await user.save();
    console.log(result);
    console.log(user._id);
}

async function user_remove(id) {
    const result = await User.deleteOne({ user_id: id});
    console.log(result);
}

/**
 * Room db
 */
const roomSchema = new mongoose.Schema({
    host: Number,
    user_list: [Number]
});

const Room = mongoose.model('Room', roomSchema);

async function room_add() {
    const room = new Room({
        host: null,
        user_list: []
    });

    const result = await room.save();
    console.log(result);
}

async function room_remove(id) {
    const result = await Room.deleteOne({ room_id: id});
    console.log(result);
}

async function room_add_user(room_id, user_id) {
    const room = await Room.findById(room_id);
    if (!room) return;

    room.user_list.push(user_id);

    const result = await room.save();
    console.log(result);
}

async function room_remove_user(room_id, user_id) {
    const room = await Room.findById(room_id);
    if (!room) return;

    var index = room.user_list.indexOf(user_id);
    if (user_id !== -1) {
        room.user_list.splice(index, 1);
    }

    const result = await room.save();
    console.log(result);
}

async function room_set_host(room_id, host_id) {
    const room = await Room.findById(room_id);
    if (!room) return;

    room.host = host_id;

    const result = await room.save();
    console.log(result);
}

async function room_unset_host(room_id) {
    const room = await Room.findById(room_id);
    if (!room) return;

    room.host = null;

    const result = await room.save();
    console.log(result);
}
