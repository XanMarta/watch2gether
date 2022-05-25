import { getSocket } from "../singleton/init_socket.js";
import * as Ownership from "../singleton/ownership.js"

var roomMember = [];
var numberMemberDOM = null;
var memberContainerDOM = null;


function getMemberContainer() {
    memberContainerDOM = document.querySelector("#members-list")
}

function renderMember(username, socketid) {
    console.log("11103: Render member: ")
    console.log(username, socketid)

    let name = username;
    let isHost = Ownership.isRemoteHost(socketid)

    if (getSocket().id == socketid) {
        name = name + " (You)"
    }

    if (isHost) {
        name = name + " (Room Owner)"
    }

    let memberElement = document.createElement("li")
    memberElement.innerHTML = name;
    memberElement.className = "list-group-item"
    memberElement.id = socketid + "-list-name"
    memberContainerDOM.appendChild(memberElement)
    memberContainerDOM.scrollTop = memberContainerDOM.scrollHeight;

    console.log("11103: Đã thêm element mới: ", memberElement)
}

function eraseMember(socketid) {
    console.log("11104: Erase member: ")
    console.log(socketid)

    let targetDOM = document.getElementById(socketid + "-list-name")
    console.log("target DOM to erase: ", targetDOM)

    if (targetDOM == undefined || targetDOM == null) {
        console.log("11104: DOM element không tồn tại")
        return;
    }

    targetDOM.remove()
    console.log("11104: DOM element xóa thành công")
}

function renderNumberRoomMember() {
    numberMemberDOM = document.querySelector("#member-number");
    numberMemberDOM.innerHTML = Array.from(roomMember).length;
}


export function isMemberExist(socketid) {
    getMemberContainer()

    console.log("v4 check exist: ")
    console.log(socketid)

    if (roomMember == null || roomMember == undefined) {
        return false;
    }

    for (let i = 0; i < roomMember.length; i++) {
        console.log(i)
        console.log(roomMember[i]['socketid'])
        console.log(roomMember[i])

        if (socketid == roomMember[i]['socketid']) {
            // tìm kiếm vị trí và kiểm tra xem có thuộc phòng hay không.
            return true
        }
    }
    return false
}


export function addRoomMember(member) {
    console.log("11223: v4 thêm người dùng vào phòng")
    getMemberContainer()

    console.log("11223: thông tin về member mới: ", member)

    if (roomMember == null || roomMember == undefined) {
        roomMember = []
    }

    console.log("11223: mảng thông tin trước khi thêm: ", roomMember)
    roomMember.push(member)

    console.log("11223: mảng thông tin sau khi thêm: ", roomMember)
    renderNumberRoomMember()
    renderMember(member.username, member.socketid)
}


export function removeRoomMember(socketid) {
    getMemberContainer()

    console.log("1208: v4 remove socket id: ")
    console.log(socketid)

    if (roomMember == null || roomMember == undefined) {
        console.log("1208: mảng lưu các thành viên không tồn tại")
        return;
    }

    for (let i = 0; i < roomMember.length; i++) {
        console.log(i)
        console.log(roomMember[i]['socketid'])
        console.log(roomMember[i])

        if (socketid == roomMember[i]['socketid']) {
            // tìm kiếm vị trí và kiểm tra xem có thuộc phòng hay không.
            console.log("1208: tìm thấy socket id tương ứng")
            console.log("1208: mảng lưu các thành viên không tồn tại", roomMember)

            eraseMember(socketid)
            roomMember.splice(i, 1)

            console.log("1208: sau khi xóa thành viên", roomMember)

            renderNumberRoomMember()

            return
        }
    }
}

export function resetRoomMember() {
    getMemberContainer()

    console.log("v4 reset member: ")

    roomMember = [];

    renderNumberRoomMember()
}

export function getNumberOfMember() {
    console.log("Get number of member: ")
    if (roomMember == null || roomMember == undefined) {
        return 0;
    }
    return roomMember.length
}

export function renderAllMember() {
    // Hàm này xóa đi xong render lại các elememt liên quan đến thẻ render.
    document.querySelectorAll(".list-group-item").forEach(DOM => {
        DOM.remove();
    })

    roomMember.forEach(memberInformation => {
        renderMember(memberInformation.username, memberInformation.socketid)
    })
}


export function initRoomMember(member) {
    getMemberContainer()

    console.log("v4 init room member: ")
    console.log(member)

    roomMember = member;
    console.log("v4 init room length")
    console.log(roomMember)
    console.log(roomMember.length)
    renderNumberRoomMember()

    member.forEach(memberInformation => {
        renderMember(memberInformation.username, memberInformation.socketid)
    })

    // type: Array
    // e.g: {
    //     roomId: roomId,
    //     username: username
    //     // TODO: send more in the future, like colour, and avt
    // }
    console.log(`All member: `, roomMember)
}