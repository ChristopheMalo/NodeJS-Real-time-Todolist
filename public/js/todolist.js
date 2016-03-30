/**
 * Real-time Todolist application JS
 *
 * @author: Christophe Malo  
 * @version: 0.1.0 
 */
// Connect to socket.io
var socket = io.connect('http://localhost:8080');

// On first connect, retrieves all tasks
socket.on('updateTask', function(todolist) {
    todolist.forEach(function(index,task) {
        insertTask(index,task);
    });
});

// When the form is submitted, the task is transmitted and is displayed on the page
$('#todolistForm').submit(function ()
{
    var task = $('#task').val();
    socket.emit('addTask', task); // sends task to server, server sends to all other clients connected
    console.log(task); // Debug
    insertTask(task); // Displays the task of the sender (in his todolist)
    $('#task').val('').focus(); // Empty the field task and put the focus on it
    return false; // Blocks the classic sending of the form
});


// When receives new task, insert the task in the page
socket.on('addTask', function(data)
{
    insertTask(data.index,data.task);
});

/**
 * Add task in the page
 * 
 * @param {int} index
 * @param {string} task
 */
function insertTask(index,task)
{
    // Use data- attribute for position index in array
    $('#todolist').append('<li id="' + index + '"><a href="#">✘</a> ' + task  + '</li>');
}

/**
 * 
 * @returns {undefined}
 */
function deleteTask()
{
    
}
