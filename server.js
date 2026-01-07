const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// WICHTIG: Erlaubt Verbindungen von allen Quellen (CORS)
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('User verbunden:', socket.id);

    // Diese Funktion verarbeitet das Objekt { msg, user } vom neuen Client
    socket.on('newMessage', (data) => {
        console.log('Nachricht erhalten:', data);

        // Wir extrahieren Text und Name, egal ob es ein Objekt oder String ist
        const messageText = typeof data === 'object' ? data.msg : data;
        const userName = typeof data === 'object' ? data.user : "Gast_" + socket.id.substring(0, 3);

        // Weiterleiten an alle anderen
        socket.broadcast.emit('chatMessage', {
            user: userName,
            msg: messageText
        });
    });

    socket.on('disconnect', () => {
        console.log('User getrennt');
    });
});

// Railway nutzt process.env.PORT
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});