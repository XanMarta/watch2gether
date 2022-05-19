var roomMember = [];
var numberMemberDOM = null;


function renderRoomMember() {
    numberMemberDOM = document.querySelector("#member-number") ;
    numberMemberDOM.innerHTML = roomMember.length;
}


export function addRoomMember(member) {
    console.log("v4 add member: ")
    console.log(member)
    if (roomMember == null || roomMember == undefined) 
    {
        roomMember = []
    }

    roomMember.push(member)

    renderRoomMember()
}


export function removeRoomMember(socketid) {
    console.log("v4 remove socket id: ")
    console.log(socketid)

    if (roomMember == null || roomMember == undefined) 
    {
        return;
    }

    for (let i = 0;i<roomMember.length;i++) 
    {
        if (socketid == roomMember[i]['socketid']) {
            roomMember.splice(i, 1)

            renderRoomMember() 
            return 
        }
    }
}

export function resetRoomMember() {
    console.log("v4 reset member: ")
    
    roomMember = [];

    renderRoomMember()
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
    console.log("v4 init room member: ")
    console.log(member)

    roomMember = member;
    console.log("v4 init room length")
    console.log(roomMember)
    console.log(roomMember.length)
    renderRoomMember() 

    // type: Array
    // e.g: {
    //     roomId: roomId,
    //     username: username
    //     // TODO: send more in the future, like colour, and avt
    // }
    console.log(`All member: `, roomMember)
}