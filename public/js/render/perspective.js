// To show what, to hide what, go all here

import { getRoomId } from "../singleton/ownership.js"

/**
 * #drag-area-host
 * #drag-area-client
 * 
 * #stop-streaming
 * #continue-streaming?
 */

function clease() {
    // Hàm này sẽ hide tất cả các view.
    // document.querySelector('#host-view').hidden = true
    // document.querySelector('#client-view').hidden = true

    document.querySelector('#drag-area-host').hidden = true
    document.querySelector('#drag-area-client').hidden = true
    document.querySelector("#video-stream-send-stream").hidden = true;

}

// Render related to Owner View
export function renderOwnerView() {
    clease()
    document.querySelector('#drag-area-host').hidden = false
    document.querySelector("#video-stream-send-stream").hidden = false;
    //document.querySelector('#host-view').hidden = false
    console.log("Show host view")

    //document.querySelector("#room-id-renderer-host").innerHTML = getRoomId()
}

// Render related to Client View
export function renderClientView() {
    clease()
    //document.querySelector('#client-view').hidden = false
    document.querySelector('#drag-area-client').hidden = false;
    console.log("Show Client view")

    //document.querySelector("#room-id-renderer-client").innerHTML = getRoomId()
}

// Render related to Main View
export function renderMainMenu() {
    clease()
    console.log("Show main menu")
}