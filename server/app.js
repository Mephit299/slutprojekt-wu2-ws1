const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

//async function main() {
  // open the database file
  /*const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  }); 

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `); */
 
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
    cors: {
      origins: ['http://localhost:8000'],
  }
  });

/*  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  }); */

  io.on('connection', (socket) => {
    const room = socket.handshake.query.room;
    console.log(room)
    socket.join(room);
    //io.to(room).emit('playerJoined'); // Skickar till alla spelara. Kanske kan göra det här ett broadcast statement
    socket.broadcast.to(room).emit('playerJoined') // Kanske fixar något.

    socket.on('move', (data) => {
      console.log(data);
      socket.broadcast.to(room).emit('move', data.x, data.y);
    });

    socket.on('moveEnd', () => {
      console.log('moveEnd1')
      socket.broadcast.to(room).emit('moveEnd');
      console.log('moveEnd2')
    })
    socket.on('existingPlayer', (data) =>{
      socket.broadcast.to(room).emit('existingPlayer', data.x1, data.y1, data.x2, data.y2, data.level)
    })
    socket.on('2Players', () =>{
      socket.broadcast.to(room).emit('2Players')
    })
    socket.on('disconnect', () => {
      console.log('user disconnected');
      socket.broadcast.to(room).emit('playerDisconnected')
  });
  socket.on('enemies', (data) =>{
    socket.broadcast.to(room).emit('enemies', data.enemies)
  })
  socket.on('enemyChange', (data) =>{
    socket.broadcast.to(room).emit('enemyChange', data.enemy, data.i)
  })
  socket.on('shoot', (data) =>{
    console.log('shoot')
    socket.broadcast.to(room).emit('shoot', data.x, data.y, data.direction)
  })
  socket.on('syncRequest', () =>{
    socket.broadcast.to(room).emit('syncRequest')
  })
  socket.on('syncEvent', (data) =>{ // Fails: "Maximun call size exceeded"
    console.log('syncEvent')
    socket.broadcast.to(room).emit('syncEvent', data.x1, data.y1, data.x2, data.y2)
  })
      /* socket.on('chat message', async (msg) => {
      let result;
      try {
        // store the message in the database
        result = await db.run('INSERT INTO messages (content) VALUES (?)', msg);
      } catch (e) {
        // TODO handle the failure
        return;
      }
      // include the offset with the message
      io.emit('chat message', msg, result.lastID);
    }); 

    if (!socket.recovered){
        // if the connection state recovery was not successful
        try {
          await db.each('SELECT id, content FROM messages WHERE id > ?', //i dont get it
            [socket.handshake.auth.serverOffset || 0],
            (_err, row) => {
              socket.emit('chat message', row.content, row.id);
            }
          )
        } catch (e) {
          // something went wrong
        }
      } */
    
  });

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });
//}

//main();