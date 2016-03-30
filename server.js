/**
 * Real-time Todolist server application
 * 
 * @author: Christophe Malo
 * @version: 0.1.0
 */
var express     = require('express'); // Loads Express.js framework
var http        = require('http'); // Loads http module
var ent         = require('ent'); // Loads security module as PHP htmlentities

var application = express(); // Create application
var server      = http.createServer(application); // Create the server

var socketio    = require('socket.io').listen(server); // Loads socket

var todolist    = []; // Create the todolist array to store tasks on server

// Use public folder for CSS and JS
application.use(express.static('public'))

// Display the todolist and the form
.get('/todolist', function(request, response)
{
    response.sendFile(__dirname + '/views/index.html');
})

// Redirects to todolist homepage if wrong page is called
.use(function(request, response, next)
{
    response.redirect('/todolist');
});


// Manage data exchange with sockets
socketio.sockets.on('connection', function(socket)
{
    console.log('User is connected'); // Debug user is connected
    //console.log(todolist); // Debug todolist array
    
    // When user is connected, send an update todolist
    socket.emit('updateTask', todolist);
    
    // Adds task on the todolist
    socket.on('addTask', function(task)
    {
       task = ent.encode(task); // Protect from injection
       todolist.push(task); // Update server todolist array with the task
       
       console.log(task); // Debug task
       
       socket.emit('updateTask', todolist); // Send task to all users
       console.log(todolist);
    });
    
    // Delete tasks
    socket.on('deleteTask', function(indexTask)
    {
        todolist.splice(indexTask, 1); // Deletes task from the server todolist array
        socket.emit('updateTask', todolist); // Update todolist of all users
    });
});

server.listen(8080);
