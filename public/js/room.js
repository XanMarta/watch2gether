import { getSocket } from './singleton/init_socket.js'
import { addMessage, addJoinNotification } from './render/chat.js'
import { renderRoomMember } from './render/member.js'
import { renderOwnerView, renderClientView, renderMainMenu } from './render/perspective.js'
//import { removeLocalStream, removeRemoteStream } from './render/mainStream.js'
import { setHost, isHost, setRoomId } from './singleton/ownership.js'
import * as peerManager from "./singleton/init_peer.js";
import * as localStreamManager from "./singleton/init_localstream.js";

var roomIdInput = document.querySelector('#roomId');

export function roomCreated(data) {
    if (data.isSuccess) {
        console.log("Tạo phòng thành công!!")
        console.log("Id của phòng: ", data.roomid)
        console.log("Username của chủ phòng: ", data.hostUsername)
        console.log("Socketid của chủ phòng: ", data.hostSocketId)
        console.log("Các thành viên trong room:\n", data.member)

        //session store room id
        sessionStorage.setItem("create-room-id", data.roomid);

        roomIdInput.value = data.roomid;

        // TODO: Render các thông tin cần thiết cho người dùng

        setRoomId(data.roomid)
        addJoinNotification('You', 'create')
        setHost(data.hostSocketId)

        renderOwnerView()
        renderRoomMember(data.member)

    } else {
        console.log("Tạo phòng mới thất bại !!")
        console.log("Lý do: ", data.message)
        alert(data.message)
    }
}

export function roomJoined(data) {
    if (data.isSuccess) {
        console.log("Gia nhập phòng mới thành công!!")
        console.log("Id của phòng: ", data.roomid)
        console.log("Username của chủ phòng: ", data.hostUsername)
        console.log("Socketid của chủ phòng: ", data.hostSocketId)
        console.log("Các thành viên trong room:\n", data.member)

        // TODO: Render các thông tin cần thiết cho người dùng

        setRoomId(data.roomid)
        addJoinNotification('You have', 'join')
        setHost(data.hostSocketId)

        // Since a client who join cannot be owner
        renderClientView()
        renderRoomMember(data.member)

    } else {
        console.log("Gia nhập phòng mới thất bại!!")
        console.log("Lý do: ", data.message)
        alert(data.message)
    }
}

export function roomLeave(data) {
    if (data.isSuccess) {
        console.log("Rời khỏi phòng thành công !!")
        console.log("Id của phòng: ", data.roomid)

        // TODO: Render các thông tin cần thiết cho người dùng
        peerManager.deletePeerAll((id) => { })
        setHost(null)
        removeRemoteStream()
        removeLocalStream()
        localStreamManager.setLocalStream(null)

        // Since a client who join cannot be owner
        renderMainMenu()

    } else {
        console.log("Rời khỏi phòng thất bại !!")
        console.log("Lý do: ", data.message)
        alert(data.message)
    }
}

export function init_listener_room() {
    const socket = getSocket()

    socket.on("join-room", (information) => {
        console.log("** got join-room")
        console.log(`Get join-room information: `)
        console.log(information)

        // TODO: Add new member to room
        addJoinNotification(information['username'], 'join')
    })

    socket.on("room-message", (message) => {
        console.log("** got room-message")
        console.log(`Get broadcast message: ${message.content}`)

        addMessage(message)
    })

    socket.on("user-disconnected", message => {
        console.log("** got user-disconnected")
        console.log(`User ${message.socketid} disconnected`)

        addJoinNotification(message['username'], 'disconnect')

        removeRemoteStream(message.socketid)
        setHost(message.roomOwnerId)

        if (isHost()) {
            renderOwnerView()
        }
    })

    socket.on("stream-disconnected", (message) => {
        console.log("** get stream-disconnected")
        console.log(`User ${message.peerId} stream disconnected`)
        removeRemoteStream(message.peerId)
    })

    socket.on("leave-room-reject", message => {
        console.log("** get leave-room-reject")
        alert(message)
    })

    socket.on("leave-room", message => {
        console.log("** got leave-room")
        console.log(message)

        setHost(null)
        renderMainMenu()
    })

    socket.on("room-info", (room) => {
        console.log("** got room-info")
        console.log('All client id from same room: ')
        console.log(typeof (room))
        console.log(room)
    })

    socket.on("not-in-room", () => {
        console.log("** got not-in-room")
        alert("Client havent joined a room yet.")
    })

    socket.on("already-in-room", () => {
        console.log("** got already-in-room")
        alert("Client already in a room.")
    })
}
