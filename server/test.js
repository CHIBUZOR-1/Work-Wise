/*
const updateTaskList = async (req, res)=> {
    const {todoList} = req.body;
    const task = await TaskModel.findById(req.params.id)
    if(!task) { }
    task.todolist = todoList
    const completedCount = task.todoList.filter(
        (item)=> item.completed
    ).length
    const totalItems = task.todoList.length
    task.progress = 
        totalItems > 0 ? Math.round((completedCount/totalItems) * 100) : 0
    //auto-mark task status as Completed if a todos are completed
    if(task.progress === 100) {
        task.status = "Completed"
    } else if (task.progress > 0) {
        task.status = "In Progress"
    } else {
        task.status = "Pending"
    }
    
    await task.save()
    const updatedTask = await TaskModel.findById(req.params.id).populate(assignedTo)
    res.json({updatedtask
    })
}
    2

const updateTaskCheck = async (req, res) => {
    try {
        const { id } = req.params;
        const { todosList } = req.body;

        if (!id) {
            return res.status(400).json({ ok: false, message: "Task ID is required" });
        }

        // 1. Update todos if provided
        if (todosList && Array.isArray(todosList) && todosList.length > 0) {
            await Promise.all(
                todosList.map(todo =>
                    supabase
                        .from('todos')
                        .update({ completed: todo.completed })
                        .eq('id', todo.id)
                )
            );
        }

        // 2. Always fetch fresh todos to recalculate
        const { data: allTodos, error: todosError } = await supabase
            .from('todos')
            .select('*')
            .eq('task_id', id);

        if (todosError) {
            console.error(todosError);
            return res.status(500).json({ ok: false, message: "Failed to fetch todos" });
        }

        const completedCount = allTodos.filter(todo => todo.completed).length;
        const totalItems = allTodos.length;
        const progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        let newStatus = 'Pending';
        if (progress === 100) {
            newStatus = 'Completed';
        } else if (progress > 0) {
            newStatus = 'In Progress';
        }

        // 3. Update the task's progress and status
        const { error: taskUpdateError } = await supabase
            .from('tasks')
            .update({ progress, status: newStatus })
            .eq('id', id);

        if (taskUpdateError) {
            console.error(taskUpdateError);
            return res.status(500).json({ ok: false, message: "Failed to update task progress/status" });
        }

        // 4. Fetch the updated task
        const { data: updatedTask, error: fetchError } = await supabase
            .from('tasks')
            .select(`
                *,
                task_assignments (
                    id,
                    user_id,
                    Users (
                        id,
                        firstname,
                        lastname,
                        email,
                        image
                    )
                ),
                todos (
                    id,
                    text,
                    completed
                )
            `)
            .eq('id', id)
            .single();

        if (fetchError || !updatedTask) {
            console.error(fetchError);
            return res.status(500).json({ ok: false, message: "Failed to fetch updated task" });
        }

        const assignedTo = updatedTask.task_assignments.map(a => a.Users);
        const todosFormatted = updatedTask.todos || [];
        const completedTodosCount = todosFormatted.filter(todo => todo.completed).length;

        const finalTask = {
            id: updatedTask.id,
            created_at: updatedTask.created_at,
            title: updatedTask.title,
            description: updatedTask.description,
            priority: updatedTask.priority,
            status: updatedTask.status,
            deadline: updatedTask.deadline,
            created_by: updatedTask.created_by,
            attachment: updatedTask.attachment,
            progress: updatedTask.progress,
            assignedTo,
            todosList: todosFormatted,
            completedTodosCount
        };

        res.status(200).json({
            ok: true,
            task: finalTask
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server Error" });
    }
};
import React, { useState, useEffect } from 'react';
import TabNav from './TabNav';
import TabContent from './TabContent';
import TaskCard from './TaskCard'; // Assume a TaskCard component exists
import { fetchTasks } from '../api/tasks'; // Replace with your actual fetch logic

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const loadTasks = async () => {
      const tasks = await fetchTasks();
      setAllTasks(tasks);
    };
    loadTasks();
  }, []);

  const taskCounts = {
    all: allTasks.length,
    pending: allTasks.filter(task => task.status === 'Pending').length,
    inProgress: allTasks.filter(task => task.status === 'In Progress').length,
    completed: allTasks.filter(task => task.status === 'Completed').length,
  };

  const tabs = [
    `All Tasks (${taskCounts.all})`,
    `Pending (${taskCounts.pending})`,
    `In Progress (${taskCounts.inProgress})`,
    `Completed (${taskCounts.completed})`
  ];

  const handleTabClick = (tabLabel) => {
    const cleanLabel = tabLabel.split(' ')[0];
    setActiveTab(tabLabel);
    setStatusFilter(cleanLabel === 'All' ? 'All' : cleanLabel);
  };

  const filteredTasks = statusFilter === 'All'
    ? allTasks
    : allTasks.filter(task => task.status === statusFilter);

  return (
    <div className="w-full">
      <TabNav tabs={tabs} activeTab={activeTab} onTabClick={handleTabClick} />
      <TabContent content={
        <div className="grid gap-4 mt-4">
          {filteredTasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      } />
    </div>
  );
};

export default ManageTasks;


*/
