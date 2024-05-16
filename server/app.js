const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
 
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origins: ['http://localhost:8000'],
  }
  });



  io.on('connection', (socket) => {
    const room = socket.handshake.query.room;
    console.log(room)
    socket.join(room);
    //io.to(room).emit('playerJoined'); // Skickar till alla spelara. Kanske kan göra det här ett broadcast statement
    socket.broadcast.to(room).emit('playerJoined') /

    socket.on('move', (data) => {
      socket.broadcast.to(room).emit('move', data.x, data.y);
    });

    socket.on('moveEnd', () => {
      socket.broadcast.to(room).emit('moveEnd');
    });

    socket.on('existingPlayer', (data) =>{
      socket.broadcast.to(room).emit('existingPlayer', data.x1, data.y1, data.x2, data.y2, data.level)
    });

    socket.on('2Players', () =>{
      socket.broadcast.to(room).emit('2Players')
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.broadcast.to(room).emit('playerDisconnected')
    });

    socket.on('enemies', (data) =>{
      socket.broadcast.to(room).emit('enemies', data.enemies)
    });

    socket.on('enemyChange', (data) =>{
      socket.broadcast.to(room).emit('enemyChange', data.enemy, data.i)
    });

    socket.on('shoot', (data) =>{
      socket.broadcast.to(room).emit('shoot', data.x, data.y, data.direction)
    });

    socket.on('projectiles', (data) =>{
      socket.broadcast.to(room).emit('projectiles', data.projectiles)
    })

    socket.on('syncRequest', () =>{
      socket.broadcast.to(room).emit('syncRequest')
    });

    socket.on('syncEvent', (data) =>{
      console.log('syncEvent')
      socket.broadcast.to(room).emit('syncEvent', data.x1, data.y1, data.x2, data.y2)
    });
    
  });

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });