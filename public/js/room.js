import { getSocket } from './singleton/init_socket.js'
import { addMessage, addJoinNotification } from './render/chat.js'
import { initRoomMember, removeRoomMember, resetRoomMember } from './render/member.js'
import { renderOwnerView, renderClientView, renderMainMenu } from './render/perspective.js'
import { removeLocalStream, removeRemoteStream } from './render/mainStream.js'
import { setHost, isHost, setRoomIdOffline, isRemoteHost } from './singleton/ownership.js'
import * as peerManager from "./singleton/init_peer.js";
import * as localStreamManager from "./singleton/init_localstream.js";
import { addRoomMember } from './render/member.js'

const navbarContent = document.getElementById("navbar-content")
const homePagePerspective = document.getElementById("home-page-perspective");
const roomPagePerspective = document.getElementById("room-page-perspective")

export async function roomCreated(data) {
    if (data.isSuccess) {
        sessionStorage.setItem("failed", null);
        navbarContent.hidden = true;
        homePagePerspective.hidden = true;
        roomPagePerspective.hidden = false;
        console.log("Tạo phòng thành công!!")
        console.log("Id của phòng: ", data.roomid)
        console.log("Username của chủ phòng: ", data.hostUsername)
        console.log("Socketid của chủ phòng: ", data.hostSocketId)
        console.log("Các thành viên trong room:\n", data.member)

        // TODO: Render các thông tin cần thiết cho người dùng

        setRoomIdOffline(data.roomid)
        addJoinNotification('You', 'create')
        setHost(data.hostSocketId)

        await renderOwnerView()

        console.log("Ví dụ về một data.member: ")
        console.log(data.member)

        initRoomMember(data.member)

    } else {
        sessionStorage.setItem("failed", true);
        console.log("Tạo phòng mới thất bại !!")
        console.log("Lý do: ", data.message)
        alert(data.message)
    }
}

export function roomJoined(data) {
    if (data.isSuccess) {
        sessionStorage.setItem("failed", null);
        navbarContent.hidden = true;
        homePagePerspective.hidden = true;
        roomPagePerspective.hidden = false;
        console.log("Gia nhập phòng mới thành công!!")
        console.log("Id của phòng: ", data.roomid)
        console.log("Username của chủ phòng: ", data.hostUsername)
        console.log("Socketid của chủ phòng: ", data.hostSocketId)
        console.log("Các thành viên trong room:\n", data.member)

        // TODO: Render các thông tin cần thiết cho người dùng

        setRoomIdOffline(data.roomid)
        addJoinNotification('You have', 'join')
        setHost(data.hostSocketId)

        // Since a client who join cannot be owner
        console.log("Ví dụ về một data.member: ")
        console.log(data.member)

        renderClientView()
        initRoomMember(data.member)

    } else {
        sessionStorage.setItem("failed", true);
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
        // BUG
        if (isHost()) {
            // là host thì được xóa stream đi.
            removeLocalStream()
        }
        else {
            // không là host thì chỉ xóa khi stream là remote.
            removeRemoteStream()
        }
        
        localStreamManager.setLocalStream(null)

        // Since a client who join cannot be owner
        renderMainMenu()
        resetRoomMember()

    } else {
        console.log("Rời khỏi phòng thất bại !!")
        console.log("Lý do: ", data.message)
        alert(data.message)
    }
}


// export function roomKicked(data, container) {
//     if (data.isSuccess) {
//         console.log(`Đã kick người dùng ${data.socketid} thành công.`)

//         addJoinNotification(data.username, "kick");

//         // TODO: thay đổi div tương ứng với 
//         container.remove();
//     } else {
//         console.log("Kick người dùng thất bại !!")
//         console.log("Lý do: ", data.message)
//     }
// }


// export function initKickRoomButton(button, container, socketid) {
//     button.addEventListener('click', () => {
//         const socket = getSocket();

//         socket.emit('kick', {
//             socketid: socketid
//         }, (data) => callback(data, container))
//     })
// }


export function init_listener_room() {
    const socket = getSocket()

    socket.on("join-room", (information) => {
        console.log("** got join-room")
        console.log(`Get join-room information: `)
        console.log(information)

        // TODO: Add new member to room
        addJoinNotification(information['username'], 'join')
        addRoomMember(information)

        // TODO: từ cái information này, trích thông tin của ng dùng mới vào và render
    })

    socket.on("room-message", (message) => {
        console.log("** got room-message")
        console.log(`Get broadcast message: ${message.content}`)

        addMessage(message)
    })

    socket.on("user-disconnected", async (message) => {
        console.log("** got user-disconnected")
        console.log(`User ${message.socketid} disconnected`)

        addJoinNotification(message['username'], 'disconnect')

        removeRemoteStream(message.socketid)
        removeRoomMember(message.socketid)

        let condition = isRemoteHost(message.socketid)
        // Người rời phòng là host.

        setHost(message.roomOwnerId)

        condition = condition && isHost()
        // Người hiện tại trở thành host mới.
        if (condition) {
            await renderOwnerView()
        }
        // TODO: xóa thông tin liên quan đến người này trong phần member
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
