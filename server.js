<!-- 1. Socket.io Client Bibliothek laden -->
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Initialisierung von Socket.io mit CORS-Einstellungen
// "origin: *" erlaubt es deiner HTML-Datei, von jeder Domain aus zu verbinden.
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Event-Handler für neue Verbindungen
io.on('connection', (socket) => {
    console.log('Ein Benutzer hat sich verbunden. ID:', socket.id);

    // Wenn der Server eine Nachricht von einem Client empfängt
    socket.on('newMessage', (msg) => {
        console.log('Neue Nachricht empfangen:', msg);

        // Die Nachricht an alle ANDEREN verbundenen Benutzer weiterleiten
        socket.broadcast.emit('chatMessage', {
            user: socket.id.substring(0, 5), // Nutzt die ersten 5 Zeichen der ID als Name
            msg: msg
        });
    });

    // Wenn ein Benutzer die Verbindung trennt
    socket.on('disconnect', () => {
        console.log('Benutzer hat die Verbindung getrennt.');
    });
});

// Port-Konfiguration: Railway vergibt den Port über process.env.PORT.
// Lokal wird Port 3000 verwendet.
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Chat-Server läuft auf Port ${PORT}`);
});