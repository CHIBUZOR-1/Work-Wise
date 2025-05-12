const supabase = require('../db');
const excelJS = require('exceljs');

const exportTaskReport = async(req, res) => {
    try {
        // Fetch tasks with assignments and user info
        const { data: tasks, error } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            description,
            status,
            priority,
            deadline,
            task_assignments (
              user_id,
              Users (
                firstname,
                lastname,
                email
              )
            )
          `);
    
        if (error) throw error;
    
        const workbook = new excelJS.Workbook();
        const worksheet = workbook.addWorksheet('Task Report');
    
        // Define headers
        worksheet.columns = [
          { header: 'Task ID', key: 'id', width: 10 },
          { header: 'Title', key: 'title', width: 30 },
          { header: 'Description', key: 'description', width: 40 },
          { header: 'Status', key: 'status', width: 15 },
          { header: 'Priority', key: 'priority', width: 10 },
          { header: 'Deadline', key: 'deadline', width: 20 },
          { header: 'Assigned To', key: 'assignedTo', width: 40 }
        ];
    
        // Add each task row with formatted assigned users
        tasks.forEach(task => {
            const assignedTo = (task.task_assignments || [])
                .map(a => {
                const u = a.Users;
                return u ? `${u.firstname} ${u.lastname}, ${u.email}` : '';
                })
                .filter(Boolean)
                .join('; ');
    
          worksheet.addRow({
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            deadline: task.deadline,
            assignedTo
          });
        });
    
        // Set download headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=task-report.xlsx');
    
        // Pipe workbook to response
        await workbook.xlsx.write(res);
        res.end();
    
      } catch (err) {
        console.error('Download error:', err);
        res.status(500).json({ success: false, message: 'Failed to generate report' });
      }
}

const exportUsersReport = async (req, res) => {
    try {
      // 1. Fetch all users with their assigned tasks
      const { data: users, error } = await supabase
        .from('Users')
        .select(`
          id,
          firstname,
          lastname, 
          email,
          task_assignments (
            task_id,
            tasks (
              id,
              status
            )
          )
        `);
  
      if (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch users' });
      }
  
      // 2. Create a new Excel workbook and worksheet
      const workbook = new excelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users Report');
  
      // 3. Define headers
      worksheet.columns = [
        { header: 'Full Name', key: 'fullName', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Total Tasks', key: 'total', width: 15 },
        { header: 'Pending Tasks', key: 'pending', width: 18 },
        { header: 'In Progress Tasks', key: 'inProgress', width: 20 },
        { header: 'Completed Tasks', key: 'completed', width: 20 },
      ];
  
      // 4. Populate the rows
      users.forEach(user => {
        const tasks = user.task_assignments.map(ta => ta.tasks).filter(Boolean);
  
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === 'Pending').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
  
        worksheet.addRow({
          fullName: `${user.firstname} ${user.lastname}`,
          email: user.email,
          total,
          pending,
          inProgress,
          completed
        });
      });
  
      // 5. Set response headers and send file
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=users_report.xlsx');
  
      await workbook.xlsx.write(res);
      res.end();
  
    } catch (err) {
      console.error("UsersReport Error:", err);
      res.status(500).json({ success: false, message: 'Server error generating user report' });
    }
  };

  /*
  for ui
  const downloadReport = () => {
  window.open(`${import.meta.env.VITE_API_URL}/api/tasks/download-report`, '_blank');
};

   */

  module.exports = { exportTaskReport, exportUsersReport}