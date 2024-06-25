const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

// Read tasks from the tasks.json file
const readTasksFromFile = () => {
    try {
        const tasksData = fs.readFileSync('tasks.json', 'utf-8');
        return JSON.parse(tasksData);
    } catch (error) {
        console.error('Error reading tasks from file:', error.message);
        return [];
    }
};

// Write tasks to the tasks.json file
const writeTasksToFile = (tasks) => {
    try {
        fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing tasks to file:', error.message);
    }
};

// REST API endpoints

// Read all tasks
app.get('/tasks', (req, res) => {
    const tasks = readTasksFromFile();
    res.json(tasks);
});

// Read a single task
app.get('/tasks/:id', (req, res) => {
    const tasks = readTasksFromFile();
    const task = tasks.find(t => t.id === req.params.id);
    res.json(task);
});

// Create a new task
app.post('/tasks', (req, res) => {
    const tasks = readTasksFromFile();
    const newTask = req.body;
    tasks.push(newTask);
    writeTasksToFile(tasks);
    res.json(newTask);
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const tasks = readTasksFromFile();
    const updatedTask = req.body;
    const index = tasks.findIndex(t => t.id === req.params.id);
    tasks[index] = updatedTask;
    writeTasksToFile(tasks);
    res.json(updatedTask);
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const tasks = readTasksFromFile();
    const index = tasks.findIndex(t => t.id === req.params.id);
    const deletedTask = tasks.splice(index, 1)[0];
    writeTasksToFile(tasks);
    res.json(deletedTask);
});

// DELETE route to clear tasks
app.delete('/tasks', (req, res) => {
    // Assuming tasks are stored in tasks.json
    fs.writeFile('tasks.json', '[]', (err) => {
        if (err) {
            console.error('Error clearing tasks:', err);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Tasks cleared successfully.');
            res.sendStatus(200); // OK
        }
    });
});

app.listen(4000, () => {
    console.log('Server is running at http://localhost:4000');
});
