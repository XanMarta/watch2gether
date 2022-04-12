import { getSocket } from "./StreamSingleton/init_socket.js"


export function init_listener_username() { 
    const socket = getSocket();

    socket.on("register-username-done", () => {
        console.log("** got register-username-done")
        console.log("register username complete!")
    })

    socket.on("register-username-reject", (message) => {
        console.log("** got register-username-reject")
        console.log("register username rejected!")
    })

    socket.on("username-require", () => {
        console.log("** got username-require")
        console.log("Need to register username first.")
    })
}