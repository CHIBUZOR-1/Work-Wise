const express = require('express');
const { verifyToken, isAdminz } = require('../Utitz/verifyToken');
const { createTask, getTasks, updateTask, getTaskById, updateTaskList, deleteTask } = require('../Controllers/taskController');
const taskRouter = express.Router();

taskRouter.post('/create-task', verifyToken, isAdminz, createTask);
taskRouter.get('/all-tasks', verifyToken, getTasks);
taskRouter.post('/update-task/:id', verifyToken, isAdminz, updateTask);
taskRouter.put('/update-todos/:id', verifyToken, updateTaskList);
taskRouter.get('/get-task/:id', verifyToken, getTaskById);
taskRouter.delete('/delete-task/:id', verifyToken, isAdminz, deleteTask);

module.exports = taskRouter;
