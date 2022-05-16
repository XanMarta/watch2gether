// To show what, to hide what, go all here

import { getRoomIdOffline } from "../singleton/ownership.js"

function clease() {
    // Hàm này sẽ hide tất cả các view.
    document.querySelector('#host-view').hidden = true
    document.querySelector('#client-view').hidden = true 
}

// Render related to Owner View
export async function renderOwnerView() {
    clease()
    document.querySelector('#host-view').hidden = false         
    console.log("Show host view")

    document.querySelector("#room-id-renderer-host").innerHTML = getRoomIdOffline()
}

// Render related to Client View
export async function renderClientView() {
    clease()
    document.querySelector('#client-view').hidden = false         
    console.log("Show host view")

    document.querySelector("#room-id-renderer-client").innerHTML = getRoomIdOffline()
}

// Render related to Main View
export function renderMainMenu() {
    clease()
    console.log("Show main menu")
}