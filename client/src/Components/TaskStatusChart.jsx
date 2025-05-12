import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TaskStatusChart = ({taskz}) => {
    const COLORS = ['#FFBB28', '#22c55e', '#2563eb']; // you can adjust

    const getStatusData = (tasks) => {
      const counts = { Pending: 0, 'In Progress': 0, Completed: 0 };
    
      tasks.forEach((task) => {
        if (counts[task.status] !== undefined) {
          counts[task.status]++;
        }
      });
    
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    };
    
    // In your component:
    const statusData = getStatusData(taskz);
  return (
    <div className='w-full flex items-center justify-center'>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart >
            <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                innerRadius={90}
                labelLine={false} // Makes it a doughnut
                fill="#8884d8"
            >
                {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }}/>
        </PieChart>
      </ResponsiveContainer>
        
    </div>
  )
}

export default TaskStatusChart