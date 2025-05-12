import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GrDocumentText } from "react-icons/gr";
import ProgressBar from '../../Components/ProgressBar';
import moment from 'moment'
import Avatars from '../../Components/Avatars';
import { MdOutlineAttachFile } from "react-icons/md";
import TabNav from '../../Components/TabNav';
import TabContent from '../../Components/TabContent';
import { FaArrowLeft } from 'react-icons/fa';

const MyTasks = ({handleBackToMenu}) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user?.user);
  const [allTasks, SetAllTask] = useState([]);
  const [allSummaries, SetAllSummarries] = useState({});
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [load, setLoad] = useState(false);
  

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
  const tabs = [
    { label: 'All Tasks', count: allTasks.length },
    { label: 'Pending', count: allTasks.filter(t => t?.status === 'Pending').length },
    { label: 'In Progress', count: allTasks.filter(t => t?.status === 'In Progress').length },
    { label: 'Completed', count: allTasks.filter(t => t?.status === 'Completed').length },
  ];

  const filteredTasks = activeTab === 'All Tasks'
  ? allTasks
  : allTasks.filter(task => task.status === activeTab);
  return (
    <div className='w-full relative h-screen p-2'>
      <div className='flex absolute z-20 w-full items-center sm:hidden py-2'>
        <div onClick={ handleBackToMenu } className='p-2 cursor-pointer hover:bg-cyan-400 group  active:bg-orange-300 rounded-full border sm:hidden '>
          <FaArrowLeft className='text-slate-500 group-hover:text-white'/>
        </div>
      </div>
      <div className='overflow-y-auto w-full scrollbar pt-14 h-full'>
        <div className='flex items-center lg:items-center w-full justify-between max-lg:flex-col'>
            <div className='flex max-lg:w-full justify-between items-center'>
              <h3 className='font-semibold flex-shrink-0 flex items-center'>My Tasks</h3>
            </div>
            <div className='flex max-lg:w-full items-center'>
              <TabNav tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
            </div>
        </div>

        {
          load && (
            <div className='flex items-center justify-center mt-3'>
              <div className='h-44 w-44 border-[5px] rounded-full  border-t-teal-400 animate-spin'></div>
            </div>
            
          )
        }
        {
          !load && filteredTasks.length === 0  && (
            <div className='w-full mt-3'>
              <p className="text-sm text-center text-gray-500">No tasks found for this category.</p>
            </div>
          )
        }
        {
          !load && filteredTasks.length > 0 && (
            <TabContent content={
              <div className='grid grid-cols-3 gap-2 mt-3 max-md:grid-cols-2 max-sm:grid-cols-1 w-full'>
                {
                  filteredTasks?.map((t,i)=> {
                    return (
                      <div onClick={()=> navigate(`/dashboard/user/update-task-todos/${t?.id}`)} key={i} style={{ boxShadow: '0px 0px 5px 0px #94a3b8' }} className='w-full cursor-pointer'>
                        <div className='flex gap-1 w-full p-2'>
                          <p className='text-xs border p-1 rounded-md bg-yellow-200 font-semibold text-yellow-600'>{t.status}</p>
                            {
                              t?.priority === 'High' && (
                                <p className='text-xs border p-1 rounded-md bg-red-200 font-semibold text-red-600'>High Priority</p>
                              )
                            }
                            {
                              t?.priority === 'Medium' && (
                                <p className='text-xs border p-1 rounded-md bg-yellow-200 font-semibold text-yellow-600'>Medium Priority</p>
                              )
                            }
                            {
                              t?.priority === 'Low' && (
                                <p className='text-xs border p-1 rounded-md bg-green-200 font-semibold text-green-600'>Low Priority</p>
                              )
                            }
                        </div>
                        <div className='p-1 border-l-2 border-l-green-500'>
                          <p className='text-sm text-slate-600 font-bold'>{t?.title}</p>
                          <p className='text-xs line-clamp-3'>{t?.description}</p>
                          <div className='w-full pt-2'>
                            <p className='text-xs font-medium'>Task Done:{" "}<span className=''>{t?.completedTodosCount} / {t?.todosList.length}</span></p>
                            <ProgressBar progress={t?.progress} status={t?.status}/>
                          </div>
                          
                        </div>
                        <div className='flex items-center justify-between p-1'>
                          <div >
                            <p className='text-xs'>Start Date</p>
                            <p className='text-xs font-medium'>{moment(t?.created_at).format("Do MMM YYYY")}</p>
                          </div>
                          <div >
                            <p className='text-xs'>Due Date</p>
                            <p className='text-xs font-medium'>{moment(t?.deadline).format("Do MMM YYYY")}</p>
                          </div>
                        </div>
                        <div className=' p-1 px-2 w-full flex justify-between items-center'>
                          <div className='flex'>
                            {
                              t?.assignedTo.map((at, i)=> {
                                return(
                                  
                                  <div key={i} className='flex first:ml-0 -ml-2'>
                                    <Avatars height={35} width={35} s={15} image={at?.image} name={(at?.firstname + " " + at?.lastname).toUpperCase() || ""}/>
                                  </div>
                                  
                                )
                              })
                            }
                          </div>
                          
                          
                          <p className='flex p-1 bg-blue-100 rounded-lg items-center justify-center font-medium text-sm'><span><MdOutlineAttachFile className='text-blue-500' /></span>{t?.attachment.length}</p>
                        </div>
                        
                      </div>
                    )
                  })
                }
              </div>
            } />
          )
        } 
      </div>
      

      
    </div>
  )
}

export default MyTasks