/* global index */

/**
 * Real-time Todolist application JS
 * The client file
 *
 * @author: Christophe Malo  
 * @version: 0.1.0 
 */
// Connect to socket.io
var socket = io.connect('http://localhost:8080');

// On first connect, retrieves all tasks
socket.on('updateTask', function(todolist) {
    $('#todolist').empty(); // Refresh the list
    todolist.forEach(function(task, index) {
        insertTask(task, index);
    });
});

// When the form is submitted, the task is transmitted and is displayed on the page
$('#todolistForm').submit(function ()
{
    var task = $('#task').val(); // Retrieve the value of field - the task
    socket.emit('addTask', task); // sends task to server, server sends to all other clients connected
    // console.log(task); // Debug
    insertTask(task, index); // Add task in the sender area - Global index here 
    $('#task').val('').focus(); // Empty the field task and put the focus on it
    return false; // Blocks the classic sending of the form
});

// When receives message, insert the message in the page
socket.on('addTask', function(data) {
    insertTask(data.task, data.index);
});

/**
 * Add task in the page
 * 
 * @param {int} index
 * @param {string} task
 */
function insertTask(task, index)
{
    // Use data- attribute for position index in array
    $('#todolist').append('<li><a class="delete" href="#" data-index="' + index + '">✘</a> ' + task  + '</li>');
}

// Deletes a task
$('body').on('click', '.delete', function()
{
    socket.emit('deleteTask', $(this).data('index'));
});
