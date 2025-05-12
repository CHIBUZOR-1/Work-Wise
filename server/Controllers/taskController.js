const supabase = require('../db');

const createTask = async (req, res) => {
    try {
        const { title, description, priority, deadline, attachment, todosList, assignedTo } = req.body;

        // Validate required fields
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required." });
        }

        if (!Array.isArray(todosList)) {
            return res.status(400).json({ success: false, message: "Invalid todosList structure." });
        }

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({ success: false, message: "Invalid assignedTo structure." });
        }

        console.log("Received Task Data:", req.body);

        // 1. Insert into the `tasks` table
        const { data: task, error: taskError } = await supabase
            .from('tasks')
            .insert([{
                title,
                description,
                priority, // optional if provided
                deadline,
                created_by: req.user.userId,
                attachment
            }])
            .select()
            .single();

        if (taskError) {
            console.error("Task Creation Error:", taskError);
            return res.status(500).json({ success: false, message: "Failed to create task" });
        }

        console.log("Task Created Successfully:", task);

        // 2. Insert Todos directly into `todos` table with `task_id`
        if (todosList.length > 0) {
            const formattedTodos = todosList.map((todo, idx) => ({
                text: todo.text,
                task_id: task.id, // if not provided, default to false
                index: idx + 1
            }));

            const { error: todosError } = await supabase
                .from('todos')
                .insert(formattedTodos);

            if (todosError) {
                console.error("Todos Creation Error:", todosError);
                return res.status(500).json({ success: false, message: "Failed to create todos" });
            }

            console.log("Todos Created Successfully");
        }

        // 3. Insert into `task_assignments`
        if (assignedTo.length > 0) {
            const formattedAssignments = assignedTo.map(userId => ({
                task_id: task.id,
                user_id: userId
            }));

            const { error: assignError } = await supabase
                .from('task_assignments')
                .insert(formattedAssignments);

            if (assignError) {
                console.error("Task Assignment Error:", assignError);
                return res.status(500).json({ success: false, message: "Failed to assign users to task" });
            }

            console.log("Users Assigned Successfully");
        }

        res.status(201).json({ success: true, message: "Task created successfully", task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        const { userId, rolez } = req.user;

        // Fetch tasks with related assigned users and todos in one query
        let query = supabase
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
            `);

        if (status) {
            query = query.eq('status', status);
        }

        const { data: tasks, error } = await query;

        if (error) {
            console.error(error);
            return res.status(500).json({ ok: false, message: "Failed to fetch tasks" });
        }

        // Now filter tasks if not admin
        let visibleTasks = [];
        if (rolez) {
            // Admin can see all
            visibleTasks = tasks;
        } else {
            // User sees only tasks they are assigned to
            visibleTasks = tasks.filter(task =>
                task.task_assignments.some(assignment => assignment.user_id === userId)
            );
        }

        const finalTasks = visibleTasks.map(task => {
            const assignedTo = task.task_assignments.map(a => a.Users);
            const todosList = task.todos || []; // fallback if no todos
            const completedTodosCount = todosList.filter(todo => todo.completed).length;

            return {
                id: task.id,
                created_at: task.created_at,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                deadline: task.deadline,
                created_by: task.created_by,
                attachment: task.attachment,
                progress: task.progress,
                assignedTo,
                todosList,
                completedTodosCount
            };
        });

        // Count by status
        const pendingTasks = finalTasks.filter(t => t.status === 'Pending').length;
        const inProgressTasks = finalTasks.filter(t => t.status === 'In Progress').length;
        const completedTasks = finalTasks.filter(t => t.status === 'Completed').length;

        res.status(200).json({
            ok: true,
            tasks: finalTasks,
            summary: {
                pending: pendingTasks,
                inProgress: inProgressTasks,
                completed: completedTasks
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server Error" });
    }
};



const getTaskById = async (req, res) => {
    try {
        const { id } = req.params; // get task id from URL

        if (!id) {
            return res.status(400).json({ ok: false, message: "Task ID is required" });
        }

        // Fetch task with its related assignments and todos
        const { data: task, error } = await supabase
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
                    completed,
                    index
                )
            `)
            .eq('id', id)
            .single(); // only one task

        if (error || !task) {
            console.error(error);
            return res.status(404).json({ ok: false, message: "Task not found" });
        }

        // Prepare response
        const assignedTo = task.task_assignments.map(a => a.Users);
        const todosList = task.todos || []; // fallback to empty if no todos
        const completedTodosCount = todosList.filter(todo => todo.completed).length;

        const finalTask = {
            id: task.id,
            created_at: task.created_at,
            title: task.title,
            description: task.description,
            priority: task.priority,
            status: task.status,
            deadline: task.deadline,
            created_by: task.created_by,
            attachment: task.attachment,
            progress: task.progress,
            assignedTo,
            todosList,
            completedTodosCount
        };

        res.status(200).json({
            ok: true,
            finalTask
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server Error" });
    }
};





const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title,
            description,
            priority,
            status,
            deadline,
            attachment,
            progress,
            assignedTo,
            todosList
        } = req.body;

        if (!id) {
            return res.status(400).json({ ok: false, message: "Task ID is required" });
        }

        // 1. Update Task Main Fields
        const fieldsToUpdate = {
            ...(title && { title }),
            ...(description && { description }),
            ...(priority && { priority }),
            ...(status && { status }),
            ...(deadline && { deadline }),
            ...(attachment && { attachment }),
            ...(progress !== undefined && { progress })
        };

        if (Object.keys(fieldsToUpdate).length > 0) {
            const { error: updateError } = await supabase
                .from('tasks')
                .update(fieldsToUpdate)
                .eq('id', id);

            if (updateError) {
                console.error(updateError);
                return res.status(500).json({ ok: false, message: "Failed to update task fields" });
            }
        }

        // 2. Update Assigned Users
        if (assignedTo && Array.isArray(assignedTo)) {
            await supabase.from('task_assignments').delete().eq('task_id', id);

            if (assignedTo.length > 0) {
                const newAssignments = assignedTo.map(userId => ({
                    task_id: id,
                    user_id: userId.id
                }));

                const { error: assignmentError } = await supabase
                    .from('task_assignments')
                    .insert(newAssignments);

                if (assignmentError) {
                    console.error(assignmentError);
                    return res.status(500).json({ ok: false, message: "Failed to update task assignments" });
                }
            }
        }

        // 3. Update Todos
        if (todosList && Array.isArray(todosList)) {
            await supabase.from('todos').delete().eq('task_id', id);

            if (todosList.length > 0) {
                const newTodos = todosList.map((todo, index) => ({
                    task_id: id,
                    text: todo.text,
                    index: index + 1
                }));

                const { error: todosError } = await supabase
                    .from('todos')
                    .insert(newTodos);

                if (todosError) {
                    console.error(todosError);
                    return res.status(500).json({ ok: false, message: "Failed to update task todos" });
                }
            }
        }

        // 4. Fetch and Return the Updated Task
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
                    completed,
                    index
                )
            `)
            .eq('id', id)
            .single();

        if (fetchError || !updatedTask) {
            console.error(fetchError);
            return res.status(500).json({ ok: false, message: "Failed to fetch updated task" });
        }

        const assignedUsers = updatedTask.task_assignments.map(a => a.Users);
        const todosListFormatted = updatedTask.todos || [];
        const completedTodosCount = todosListFormatted.filter(todo => todo.completed).length;

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
            assignedTo: assignedUsers,
            todosList: todosListFormatted,
            completedTodosCount
        };

        res.status(200).json({
            ok: true,
            message: "Task updated successfully",
            task: finalTask
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server Error" });
    }
};



const updateTaskList = async (req, res) => {
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
            .eq('task_id', id)
            .order('index', { ascending: true });

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
                    completed,
                    created_at,
                    index
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

const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ ok: false, message: "Task ID is required" });
    }

    // Optional: manually delete related records if cascade isn't set up
    // await supabase.from('todos').delete().eq('task_id', id);
    // await supabase.from('task_assignments').delete().eq('task_id', id);

    const { error } = await supabase.from('tasks').delete().eq('id', id);

    if (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ ok: false, message: "Failed to delete task" });
    }

    return res.status(200).json({ ok: true, message: "Task deleted successfully" });
};



module.exports= { createTask, getTasks, getTaskById, updateTask, updateTaskList, deleteTask}