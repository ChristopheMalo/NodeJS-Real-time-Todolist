/**
 * Real-time Todolist application
 * The server file
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
var index;

// Use public folder for JS file (Client)
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
    // console.log('User is connected'); // Debug user
    
    // When user is connected, send an update todolist
    socket.emit('updateTask', todolist);
    
    // Adds task on the todolist
    socket.on('addTask', function(task)
    {
       task = ent.encode(task); // Protect from injection
       todolist.push(task); // Add task to server todolist array  
       
       // Get the index position of task in array - to give kind of id
       index = todolist.length -1;
       
       // console.log(task); // Debug task
       // console.log(index); // Debug index
        
       // Send task to all users in real-time
       socket.broadcast.emit('addTask', {task:task, index:index});
       // console.log(todolist); // Debug
    });
    
    // Delete tasks
    socket.on('deleteTask', function(index)
    {
        // Deletes task from the server todolist array
        todolist.splice(index, 1);
        
        // Updates todolist of all users in real-time - refresh index
        socketio.sockets.emit('updateTask', todolist);
    });
});

server.listen(8080);
