import React from 'react'
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Cell, Tooltip, CartesianGrid, Legend } from 'recharts';

const TaskPriorityChart = ({taskd}) => {
    const COLORS = ['#22c55e', '#f97316', '#ef4444'];
    const getPriorityData = (tasks) => {
        const counts = { Low: 0, Medium: 0, High: 0 };
      
        tasks.forEach((task) => {
          if (counts[task.priority] !== undefined) {
            counts[task.priority]++;
          }
        });
      
        return Object.entries(counts).map(([name, count]) => ({ priority: name, count }));
      };
      const priorityData = getPriorityData(taskd);
  return (
    <div className='w-full flex items-center justify-center'>
        <ResponsiveContainer width='100%' height={300}>
           <BarChart  data={priorityData}>
            <CartesianGrid stroke='none'/>
            <XAxis dataKey="priority" stroke='none' tick={{fill: '#555', fontSize: 13}} />
            <YAxis stroke='none' tick={{fill: '#555', fontSize: 13}} />
            <Tooltip  cursor={{fill: 'transparent'}}/>
            <Bar dataKey="count" fill="#ff8842" radius={[10, 10, 0, 0]}>
                    {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
            </Bar>
            </BarChart> 
        </ResponsiveContainer>
        
    </div>
  )
}

export default TaskPriorityChart