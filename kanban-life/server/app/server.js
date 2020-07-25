const express = require('express');
const http = require('http');
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);


const { Pool, Client } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pgkanban',
    password: process.env.DB_PASS || 'changeme',
    port: 5432,
    })
//const db = require('./db')


app.use(express.static(__dirname + '/css'));
app.use(require(__dirname + '/routes'))

// Setup Client Counter
var numClients = 0;
var isInitBoards = false;
var boards = [];

// handle connection events
io.on('connection', function(socket) {

  // inform stats subscribers
  numClients++;
  io.emit('stats', numClients);
  console.log('Connected clients:', numClients);
  socket.on('disconnect', function() {
    numClients--;
    io.emit('stats', numClients);
    console.log('Connected clients:', numClients);
    });

  // Check if boards are loaded & emit
  if (!isInitBoards){
    pool.query('SELECT * FROM pgkanban.kanban_list', (err,res) => {
        console.log(err,res)
        io.emit('initial boards', res.rows)
    })
  } else{
    io.emit('initial boards', boards)
  }

  // New board added by client
  socket.on('new board', function(data){
    console.log('New board added: ' + data)
    boards.push(data)
    io.emit('new board', data)

    // Add new board to Database
    const query = {
      text: 'INSERT INTO pgkanban.kanban_list(kb_name) VALUES($1)',
      values: [data],
    }
    pool
      .query(query)
      .then(res => console.log('Inserted row' + res))
      .catch(e => console.error(e.stack))
  })
});

server.listen(port, () => console.log(`Listening on port ${port}`));