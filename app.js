/**
 * Real-time Todolist application
 * 
 * @author: Christophe Malo
 * @version: 0.1.0
 */
// Loads Express.js framework
var express = require('express');

// Loads the modules
var http = require('http');
var ent = require('ent'); // For security as PHP htmlentities

// Create application
var application = express();

// Create the server
var server = http.createServer(application);

// Loads socket
var socketio = require('socket.io').listen(server);

// Create the todolist array to store tasks
var todolist = [];

// Use public folder for CSS and JS
application.use(express.static('public'))

// Display the todolist and the form
.get('/', function(request, response)
{
    response.sendFile(__dirname + '/index.html');
})

// Redirects to todolist homepage if wrong page is called
.use(function(request, response, next)
{
    response.redirect('/');
});


// Manage the application sockets
socketio.sockets.on('connection', function(socket)
{
    console.log('User is connected'); // Debug user is connected
    console.log(todolist); // Debug todolist array
    
    // When user is connected, send an update todolist
    socket.emit('updateTask', todolist);
    
    // Adds task on the todolist
    socket.on('task', function(task)
    {
       task = ent.encode(task); // Protect from injection
       
       todolist.push(task); // Update todolist array with the task
       console.log(task); // Debug task
       
       // Send task to all users
       socket.broadcast.emit('task', {task: task});
    });
});

server.listen(8080);
