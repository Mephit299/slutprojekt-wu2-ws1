const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function main() {
  // open the database file
  const db = await open({
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
  `);

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {}
  });

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  io.on('connection', async (socket) => {
    socket.on('chat message', async (msg) => {
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
      }
    
  });

  server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
  });
}

main();
/*
io.on('connection', (socket) => {
    const room = socket.handshake.query.room;
    console.log(room)
    socket.join(room);
    io.to(room).emit('playerJoined');

    socket.on('move', (data) => {
        console.log(data);
        socket.broadcast.to(room).emit('move', data.x, data.y);
    });
    socket.on('moveEnd', () => {
        console.log('moveEnd');
        socket.broadcast.to(room).emit('moveEnd');
    });
    socket.on('chatMsg', (msg) => {
        console.log(msg);
        io.to(room).emit('chatMsg', msg);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
}); */