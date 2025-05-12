import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import TaskStatusChart from '../../Components/TaskStatusChart';
import TaskPriorityLevel from '../../Components/TaskStatusChart';
import TaskPriorityChart from '../../Components/TaskPriorityChart';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Panel = ({ handleBackToMenu }) => {
  const user = useSelector(state => state.user?.user);
  const [allTasks, SetAllTask] = useState([]);
  const [allSummaries, SetAllSummarries] = useState({});
  const [load, setLoad] = useState(false)
  const navigate = useNavigate();

  useEffect(()=> {
    getAllTasks();
  }, []);

  const getAllTasks = async() => {
    try {
    setLoad(true)
     const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/all-tasks`) 
     if(data.ok) {
      SetAllTask(data.tasks)
      SetAllSummarries(data.summary)
     }
    } catch (error) {
      console.log(error)
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className='w-full relative h-full p-2'>
      <div className="flex absolute z-20 sm:hidden py-2">
        <div onClick={ handleBackToMenu } className='p-2 bg-blue-600 cursor-pointer hover:bg-cyan-400 group  active:bg-orange-300 rounded-full border sm:hidden '>
          <FaArrowLeft className='text-white group-hover:text-white'/>
        </div>
      </div>
      <div className='h-full w-full px-1 py-2 max-sm:pt-12 sm:pt-14 overflow-y-auto scrollbar'>
        <div style={{ boxShadow: '0px 0px 5px 0px #94a3b8' }} className='w-full p-2'>
          <h2 className='font-semibold text-xl'>Welcome {(user?.firstname + " " + user?.lastname).toUpperCase() || ""}</h2>
          <p className='text-xs font-medium p-1'>{moment(Date.now()).format('dddd Do MM YYYY')}</p>
          <div className='p-1 grid grid-cols-4 max-md:grid-cols-2 gap-1 items-center justify-between font-normal text-slate-600'>
            <p className='p-1 border-l-4 max-sm:text-sm border-l-blue-600'> <span className='font-semibold border p-1'>{allTasks.length}</span> All Tasks</p>
            <p className='p-1 border-l-4 max-sm:text-sm border-l-red-400'> <span className='font-semibold border p-1'>{allSummaries?.pending || 0}</span> Pending Tasks</p>
            <p className='p-1 border-l-4 max-sm:text-sm border-l-yellow-400'> <span className='font-semibold border p-1'>{allSummaries?.inProgress || 0}</span> In Progress</p>
            <p className='p-1 border-l-4 max-sm:text-sm border-l-green-400'> <span className='font-semibold border p-1'>{allSummaries?.completed || 0}</span> Completed Tasks</p>
          </div>
        </div>
        <div className={`flex ${allTasks.length === 0 && 'hidden'} max-md:flex-col w-full pt-2 gap-1`}>
          <div style={{ boxShadow: '0px 0px 5px 0px #94a3b8' }} className='p-2 w-full flex flex-col'>
            <h3 className='font-semibold max-sm:text-sm'>Task Distribution</h3>
            <TaskStatusChart taskz={allTasks}/>
          </div>
          <div style={{ boxShadow: '0px 0px 5px 0px #94a3b8' }} className='p-2 w-full'>
            <h3 className='font-semibold max-sm:text-sm'>Task Priority</h3>
            <TaskPriorityChart taskd={allTasks}/>
          </div>
        </div>
        {
          load && (
            <div className='flex w-full items-center justify-center mt-3'>
              <div className='h-44 w-44 border-[5px] rounded-full  border-t-teal-400 animate-spin'></div>
            </div>
          )
        }
        {
          !load && allTasks.length === 0 && (
            <div className='flex w-full items-center p-3 justify-center mt-3'>
              <p className='text-slate-400 font-semibold'>No tasks yet</p>
            </div>
          )
        }
        {
          !load && allTasks.length > 0 && (
            <div className='w-full p-1'>
              <div className='w-full flex items-center justify-between py-2 p-1'>
                <p className='text-xl font-semibold'>Recent Tasks</p>
                <button onClick={()=> navigate('/dashboard/admin/task-management')} className='text-xs rounded-md active:bg-blue-200 active:text-blue-600 hover:bg-blue-500 hover:text-white font-medium border p-1'>See All</button>
              </div>
              <table className='w-full border border-slate-200'>
                <thead>
                  <tr>
                    <th className='border p-1'>Name</th>
                    <th className='border p-1'>Status</th>
                    <th className='border p-1'>Priority</th>
                    <th className='border max-sm:hidden p-1'>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    allTasks.map((tsk,idx) => {
                      return(
                        <tr key={idx} className=''>
                          <td>
                            <p className='p-1 font-medium text-xs'>{tsk.title}</p>
                          </td>
                          <td className=' p-1 text-center'>
                            {
                              tsk.status === 'Pending' && (
                              <p className='p-1 w-full max-sm:text-xs font-semibold bg-yellow-200 rounded-md text-yellow-600 text-center border'>{tsk.status}</p> 
                              )
                            }
                            {
                              tsk.status === 'In Progress' && (
                              <p className='p-1 w-full max-sm:text-xs font-semibold bg-green-200 rounded-md text-green-600 text-center border'>{tsk.status}</p> 
                              )
                            }
                            {
                              tsk.status === 'Completed' && (
                              <p className='p-1 w-full max-sm:text-xs font-semibold bg-blue-200 rounded-md text-blue-600  text-center border'>{tsk.status}</p> 
                              )
                            }
                          </td>
                          <td className=' p-1'>
                            {
                              tsk.priority === 'Low' && (
                              <p className='p-1 w-full max-sm:text-xs bg-green-200 font-semibold rounded-md text-green-600 text-center border'>{tsk.priority}</p> 
                              )
                            }
                            {
                              tsk.priority === 'Medium' && (
                              <p className='p-1 w-full max-sm:text-xs bg-yellow-200 font-semibold rounded-md text-yellow-600 text-center border'>{tsk.priority}</p> 
                              )
                            }
                            {
                              tsk.priority === 'High' && (
                              <p className='p-1 w-full max-sm:text-xs bg-red-200 font-semibold rounded-md text-red-600  text-center border'>{tsk.priority}</p> 
                              )
                            }
                          </td>
                          <td className='max-sm:hidden'>
                            <p className='max-sm:text-xs font-medium text-sm text-center'>{moment(tsk.created_at).format('Do MMM YYYY')}</p>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
                
              </table>
            </div>
          )
        }
        
      </div>
      
    </div>
  )
}

export default Panel