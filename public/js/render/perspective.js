// To show what, to hide what, go all here

import { getRoomId } from "../singleton/ownership.js"

function clease() {
    // Hàm này sẽ hide tất cả các view.
    document.querySelector('#host-view').hidden = true
    document.querySelector('#client-view').hidden = true 
}

// Render related to Owner View
export function renderOwnerView() {
    clease()
    document.querySelector('#host-view').hidden = false         
    console.log("Show host view")

    document.querySelector("#room-id-renderer-host").innerHTML = getRoomId()
}

// Render related to Client View
export function renderClientView() {
    clease()
    document.querySelector('#client-view').hidden = false         
    console.log("Show host view")

    document.querySelector("#room-id-renderer-client").innerHTML = getRoomId()
}

// Render related to Main View
export function renderMainMenu() {
    clease()
    console.log("Show main menu")
}