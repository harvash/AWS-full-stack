const express = require('express');
const http = require('http');
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pgkanban',
    password: process.env.DB_PASS || 'changeme',
    port: 5432,
    })

app.use(express.static(__dirname + '/css'));
app.use(require(__dirname + '/routes'))

// Setup Client Counter
var numClients = 0;

io.on('connect', onConnect); 

function onConnect(socket) {
  // inform stats subscribers
  numClients++;
  io.emit('stats', numClients);
  console.log('Connected clients:', numClients);
  
  // Query DB for kanban boards
  pool.query('SELECT * FROM pgkanban.kanban_list', (err,res) => {
    console.log(err,res)
    socket.emit('boards', res.rows)
  });
  // New board added by client
  socket.on('new board', function(data){
    // Add new board to Databasek 
    ;(async() => {
      const client = await pool.connect()
      try {
        // Insert the new board
        const insert = 'INSERT INTO pgkanban.kanban_list(kb_name) VALUES($1)'
        await client.query(insert, [data])
        await client.query('COMMIT')
        // Query updated board list
        const updateList = 'SELECT * FROM pgkanban.kanban_list'
        const res = await client.query(updateList)
        io.emit('boards', res.rows)
      } catch(e) { 
        await client.query('ROLLBACK')
        throw e
      } finally { client.release() } 
    })().catch(e => console.error(e.stack))
  });
  // handle disconnects
  socket.on('disconnect', function() {
    numClients--;
    io.emit('stats', numClients);
    console.log('Connected clients:', numClients);
  });
};

server.listen(port, () => console.log(`Listening on port ${port}`));