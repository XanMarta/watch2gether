import * as Ownership from "../singleton/ownership.js"

var roomMember = [];
var numberMemberDOM = null;
var memberContainerDOM = null;


function getMemberContainer() {
    memberContainerDOM = document.querySelector("#members-list")
}

function renderMember(username, socketid) {
    let name = username;
    let isHost = Ownership.isRemoteHost(socketid)
    
    if (isHost) 
    {
        name = name + " (Chủ phòng)"
    }

    let memberElement = document.createElement("li")
    memberElement.innerHTML = username + '<button style="float: right;">Ban</button>'
    memberElement.className = "list-group-item"
    memberElement.id = socketid + "-list-name"
    memberContainerDOM.appendChild(memberElement) 
}

function eraseMember(socketid) {
    let targetDOM = document.querySelector("#" + socketid + "-list-name")
    console.log(targetDOM)

    if (targetDOM == undefined || targetDOM == null) 
    {
        return;
    }

    targetDOM.remove()
}

function renderNumberRoomMember() {
    numberMemberDOM = document.querySelector("#member-number");
    numberMemberDOM.innerHTML = roomMember.length;
}


export function addRoomMember(member) {
    getMemberContainer()

    console.log("v4 add member: ")
    console.log(member)
    if (roomMember == null || roomMember == undefined) 
    {
        roomMember = []
    }

    roomMember.push(member)

    renderNumberRoomMember()
    renderMember(member.username, member.socketid)
}


export function removeRoomMember(socketid) {
    getMemberContainer()

    console.log("v4 remove socket id: ")
    console.log(socketid)

    if (roomMember == null || roomMember == undefined) 
    {
        return;
    }

    for (let i = 0;i<roomMember.length;i++) 
    {
        if (socketid == roomMember[i]['socketid']) {
            eraseMember(socketid)
            roomMember = roomMember.splice(i, 1)

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
    if (roomMember == null || roomMember == undefined) 
    {
        return 0;
    }
    return roomMember.length
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