import io from "socket.io-client";


export const socketio = io('http://127.0.0.1:8000/', {
    transports: ['websocket'],
    upgrade: false,
    auth: {username: localStorage.getItem('username')}
})