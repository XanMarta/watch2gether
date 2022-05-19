// To show what, to hide what, go all here

import { getRoomIdOffline } from "../singleton/ownership.js"

function clease() {
    // Hàm này sẽ hide tất cả các view.
    document.querySelector('#host-view').hidden = true
    document.querySelector("#stream-stop-button").hidden = true;
    //document.querySelector('#client-view').hidden = true

    document.querySelectorAll(".list-group-item").forEach(DOM => {
        DOM.remove();
    })
    document.querySelectorAll(".notification").forEach(DOM => {
        DOM.remove();
    })
}

// Render related to Owner View
export async function renderOwnerView() {
    clease()
    document.querySelector('#host-view').hidden = false
    document.querySelector("#video-area").hidden = true;
    console.log("Show host view")

    //document.querySelector("#room-id-renderer-host").innerHTML = getRoomIdOffline()
    document.querySelector("#roomIdInput").value = getRoomIdOffline()
}

// Render related to Client View
export async function renderClientView() {
    clease()
    //document.querySelector('#client-view').hidden = false
    //document.querySelector("#video-area").hidden = false;
    console.log("Show client view")

    //document.querySelector("#room-id-renderer-client").innerHTML = getRoomIdOffline()
    document.querySelector("#roomIdInput").value = getRoomIdOffline()
}

// Render related to Main View
export function renderMainMenu() {
    clease()
    console.log("Show main menu")
}