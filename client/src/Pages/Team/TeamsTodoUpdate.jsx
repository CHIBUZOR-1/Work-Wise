import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import AvatarGroup from '../../Components/AvatarGroup';
import { MdOutlineAttachFile } from 'react-icons/md';
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaArrowLeft } from 'react-icons/fa';

const TeamsTodoUpdate = ({ handleBackToMenu } ) => {
    const {id} = useParams();
    const [load, setLoad] = useState(false);
    const [newDetails, setNewDetails] = useState({
      title: '',
      description: '',
      status: '',
      priority:'',
      deadline: null,
      todosList: [],
      assignedTo: [],
      attachment: []
    })
      useEffect(()=> {
        getTask();
      }, []);
      const getTask = async() => {
        try {
          setLoad(true)
         const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/get-task/${id}`) 
         if(data.ok) {
          const sortedTodos = [...data.finalTask.todosList].sort((a, b) => a.index - b.index);
          setNewDetails({
            title: data.finalTask?.title,
            description: data.finalTask.description,
            status: data.finalTask.status,
            priority: data.finalTask.priority,
            deadline: data.finalTask.deadline,
            todosList: sortedTodos,
            assignedTo: data.finalTask.assignedTo,
            attachment: data.finalTask.attachment
          })
         }
        } catch (error) {
          console.log(error)
        } finally {
         setLoad(false) 
        }
        
      }
      const updateTodosInBackend = async (updatedTodos) => {
        try {
            const { data } = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/tasks/update-todos/${id}`,
            { todosList: updatedTodos }
            );

            if (data.ok) {
              const sortedTodos = [...data.task.todosList].sort((a, b) => a.index - b.index);
                setNewDetails({
                    title: data.task.title,
                    description: data.task.description,
                    status: data.task.status,
                    priority: data.task.priority,
                    deadline: data.task.deadline,
                    todosList: sortedTodos,
                    assignedTo: data.task.assignedTo,
                    attachment: data.task.attachment
                })
            }
        } catch (err) {
            console.error("Failed to update todos:", err);
        }
    }
      const handleCheckboxChange = (id) => {
        const updatedTodos = newDetails.todosList.map(todo => {
          if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
          }
          return todo;
        });
      
        setNewDetails(prev => ({
          ...prev,
          todosList: updatedTodos
        }));
      
        updateTodosInBackend(updatedTodos);
      };
  return (
    <div className='w-full p-2 flex-col sm:pt-14 flex gap-2  bg-slate-200 h-full'>
        <div className='w-full flex max-sm:fixed items-center gap-2 p-2 bg-white'>
          <div onClick={ handleBackToMenu } className='p-2 cursor-pointer hover:bg-cyan-400 group  active:bg-orange-300 rounded-full border sm:hidden '>
            <FaArrowLeft className='text-slate-500 group-hover:text-white'/>
          </div>
          <h2 className='font-semibold'>Update Task</h2>
        </div>
          {
            load && (
              <div className='flex items-center justify-center mt-3'>
                <div className='h-44 w-44 border-[5px] rounded-full  border-t-teal-400 animate-spin'></div>
              </div>    
            )
          }
          {
            !load && (
                <div className='w-full max-sm:pt-12 bg-white overflow-y-auto scrollbar h-full'>
                  <div className='w-full p-2 flex justify-between items-center'>
                    <h2 className='sm:text-xl font-semibold'>{newDetails?.title}</h2>
                    {
                      newDetails?.status === 'Pending' && (
                        <p className='p-1 text-sm rounded-md bg-yellow-100 text-yellow-600 border'>{newDetails?.status}</p>
                      )
                    }
                    {
                      newDetails?.status === 'In Progress' && (
                        <p className='p-1 text-sm rounded-md bg-blue-100 text-blue-600 border'>{newDetails?.status}</p>
                      )
                    }
                    {
                      newDetails?.status === 'Completed' && (
                        <p className='p-1 text-sm rounded-md bg-green-100 text-green-600 border'>{newDetails?.status}</p>
                      )
                    }
                  </div>
                  <div className='w-full p-2 flex flex-col gap-2'>
                    <p className='text-sm font-medium'>Description:</p>
                    <p className='text-sm'>{newDetails?.description}</p>
                  </div>
                  <div className='w-full flex items-center justify-between p-2'>
                    <div>
                        <p className='text-sm'>Priority</p>
                        <p className='text-sm font-medium'>{newDetails.priority}</p>
                    </div>
                    <div>
                        <p className='text-sm'>Deadline</p>
                        <p className='text-sm font-medium'>{newDetails.deadline}</p>
                    </div>
                    <div>
                        <p className='text-sm'>Assigned To:</p>
                        <AvatarGroup mod={()=> setOpen(true)} avatars={newDetails.assignedTo} maxVisible={3}/>
                    </div>
                  </div>
                  <div className='p-2 flex-col flex gap-2'>
                    <p className='text-sm'>Todo Checklist:</p>
                    {
                        newDetails.todosList.map((l,i)=> {
                            return(
                                <div key={i} className='flex items-center gap-2'>
                                    <input type="checkbox" checked={l.completed} onChange={() => handleCheckboxChange(l.id)}  className='border border-slate-300 w-5 h-5 accent-blue-500'/>
                                    <p className='font-normal'>{l?.text}</p>
                                </div>
                            )
                        })
                    }
                  </div>
                  <div className='w-full p-2'>
                          <ul className="space-y-1">
                            <p className='text-sm'>Attachments:</p>
                            {newDetails.attachment.map((atc, index) => (
                              <div key={index}  className='flex bg-gray-100 items-center rounded-md justify-between'>
                                <li className="text-sm p-2 flex items-center justify-center  rounded-md">
                                  <span className='font-semibold text-sm'><MdOutlineAttachFile /></span>
                                  <p className='font-medium'>{atc}</p>
                                </li>
                                <button className='px-2 cursor-pointer'>
                                  <HiOutlineExternalLink className='text-slate-400 active:text-cyan-500' />
                                </button>
                                        
                              </div>
                                      
                            ))}
                                    
                          </ul>
                  </div>
                </div>
            )
          }
            
    </div>
  )
}

export default TeamsTodoUpdate