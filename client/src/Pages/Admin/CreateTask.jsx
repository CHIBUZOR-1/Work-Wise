import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAttachFile } from "react-icons/md";
import { Modal } from 'antd'
import axios from 'axios';
import Avatars from '../../Components/Avatars';
import AvatarGroup from '../../Components/AvatarGroup';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreateTask = ({ handleBackToMenu }) => {
  const [newTask, setNewTask] = useState({
    title: '', 
    description: '', 
    priority: 'Low', 
    deadline: '', 
    attachment: [], 
    todosList: [], 
    assignedTo: [] 
  });
  const nav = useNavigate()
  const [open, setOpen] = useState(false);
  const [todoInput, setTodoInput] = useState('');
  const [error, setError] = useState("");
  const [att, setAtt] = useState("");
  const[load, setLoad] = useState(false);
  const [memb, setMemb] = useState([]);

  useEffect(()=> {
    getUsers()
  },[])
  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  }
  const handleAddList = () => {
    if (todoInput.trim()) {
      setNewTask(prev => ({
        ...prev,
        todosList: [...prev.todosList, { text: todoInput}]
      }));
      setTodoInput('');
    }
  };
  const handleAddAtach = () => {
    if (att.trim()) {
      setNewTask(prev => ({
        ...prev,
        attachment: [...prev.attachment, att]
      }));
      setAtt('');
    }
  };
  const handleToggleAssign = (userId) => {
    setNewTask(prev => {
      const isAlreadyAssigned = prev.assignedTo.includes(userId);
      return {
        ...prev,
        assignedTo: isAlreadyAssigned
          ? prev.assignedTo.filter(id => id !== userId)
          : [...prev.assignedTo, userId]
      };
    });
  };
  
  const handleDeleteTodo = (index) => {
    setNewTask((prevTask) => ({
      ...prevTask,
      todosList: prevTask.todosList.filter((_, i) => i !== index),
    }));
  };
  const openModal = ()=> {
    setOpen(true)
  }
  const handleDeleteAttach = (index) => {
    setNewTask((prevTask) => ({
      ...prevTask,
      attachment: prevTask.attachment.filter((_, i) => i !== index),
    }));
  };
  const getUsers = async()=> {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/allUsers`)
    if(data.ok) {
      setMemb(data.users)
    }
  }
  const handleCancel = ()=> {
    setOpen(false)
  }
  const selectedUsersAvatars = memb
  .filter(user => newTask.assignedTo.includes(user.id))
  .map(user=> user)

  const creatTask = async()=> {
    try {
      if(!newTask.title.trim()) {
      setError("Task Title required")
      return;
      }
      if(!newTask.description.trim()) {
        setError("Task Description required")
        return;
      }
      if(!newTask.deadline) {
        setError("Task Deadline required")
        return;
      }
      if(newTask.assignedTo.length === 0) {
        setError("Task not assigned to any member")
        return;
      }
      if(newTask.todosList.length === 0) {
        setError("Add at least one todo task")
        return;
      }
      setLoad(true)
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks/create-task`, newTask);
      if(data.success){
        toast.success(data.message)
        setNewTask({
          title: '', 
          description: '', 
          priority: '', 
          deadline: '', 
          attachment: [], 
          todosList: [], 
          assignedTo: [] 
        })
        nav('/dashboard/admin/task-management')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoad(false)
    }
    
  }

  return (
    <div className='w-full relative h-screen p-3 bg-slate-100'>
      <div onClick={ handleBackToMenu } className='p-1 absolute max-sm:bg-blue-600 z-20 cursor-pointer hover:bg-cyan-400 group  active:bg-orange-300 rounded-full border sm:hidden '>
        <FaArrowLeft className='text-slate-500 max-sm:text-white group-hover:text-white'/>
      </div>
      <div className='w-full h-full overflow-y-auto scrollbar pt-4 p-2 flex flex-col gap-2 bg-white'>
        <div className='w-full gap-1 items-center flex p-2'>
         <h2 className='font-semibold text-xl'>Create Task</h2> 
        </div>
        <div> 
          <p className='text-sm'>Task Title</p>
          <input value={newTask.title} onChange={handleChange} name='title' type="text" className='w-full border p-1 rounded-md border-slate-200' />
        </div>
        <div>
          <p className='text-sm'>Description</p>
          <textarea
            name="description"
            value={newTask.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className='grid grid-cols-3'>
          <div className='w-full p-1'>
            <p className='text-sm text-slate-600 font-bold'>Priority</p>
            <select className=' border w-full text-sm rounded-md p-1' onChange={handleChange} name="priority">
              <option className='hover:bg-slate-200' value="Low">Low</option>
              <option className='hover:bg-slate-200' value="Medium">Medium</option>
              <option className='hover:bg-slate-200' value="High">High</option>
            </select>
          </div>
          <div className='w-full p-1'>
            <p className='text-sm text-slate-600 font-bold'>Deadline</p>
            <input type="date" value={newTask.deadline} name='deadline' onChange={handleChange} className=' border text-sm w-full rounded-md p-1 font-medium' />
          </div>
          <div className='w-full p-1'>
            <p className='text-sm text-slate-600 font-bold'>Assign To</p>
            {
              newTask.assignedTo.length === 0 && (
                <button onClick={openModal} className=' border active:bg-slate-300 w-full text-sm text-blue-600 font-semibold bg-blue-100 rounded-md p-1'>Add Members</button>
              )
            }
            {
              newTask.assignedTo.length > 0 && (
                <AvatarGroup mod={()=> setOpen(true)} avatars={selectedUsersAvatars} maxVisible={3}/>
              )
            }
            
          </div>        
        </div>
        <div className='flex flex-col gap-1'>
          <p className='font-medium text-sm'>Add Todos</p>
          <ul className="space-y-1">
            {newTask.todosList.map((todo, index) => (
              <div key={index} className='flex bg-gray-100 items-center rounded-md justify-between'>
                <li  className="text-sm p-2  rounded-md">
                  <span className='font-semibold text-xs'>{index < 9 ? `0${index + 1}. ` : `${index + 1}. `}</span>
                  {todo.text}
                </li>
                <button className='px-2 cursor-pointer'>
                  <RiDeleteBin6Line onClick={()=>handleDeleteTodo(index)} className='text-red-600 active:text-cyan-500' />
                </button>
                
              </div>
              
            ))}
            
          </ul>
          <div className='w-full border gap-2 rounded-md flex p-1'>
            <input value={todoInput} onChange={(e) => setTodoInput(e.target.value)} type="text" name='todosList' className='w-full border px-1 rounded-l-md outline-none' />
            <button onClick={handleAddList} className='flex active:bg-blue-600 active:text-white text-sm font-medium p-1 border bg-slate-50 rounded-md items-center justify-center flex-shrink-0'>+ Add</button>
          </div>
        </div>
        <div>
          <p className='font-medium text-sm'>Add Attachment</p>
          <ul className="space-y-1">
            {newTask.attachment.map((atc, index) => (
              <div key={index}  className='flex bg-gray-100 items-center rounded-md justify-between'>
                <li className="text-sm p-2 flex items-center justify-center  rounded-md">
                  <span className='font-semibold text-sm'><MdOutlineAttachFile /></span>
                  <p className='font-medium'>{atc}</p>
                </li>
                <button className='px-2 cursor-pointer'>
                  <RiDeleteBin6Line onClick={()=>handleDeleteAttach(index)} className='text-red-600 active:text-cyan-500' />
                </button>
                
              </div>
              
            ))}
            
          </ul>

          <div className='w-full border gap-2 rounded-md flex p-1'>
            <input value={att} onChange={(e) => setAtt(e.target.value)} type="text" className='w-full border px-1 rounded-l-md outline-none' />
            <button onClick={handleAddAtach} className='flex active:bg-blue-600 active:text-white text-sm font-medium p-1 border bg-slate-50 rounded-md items-center justify-center flex-shrink-0'>+ Add</button>
          </div>
        </div>
        <div className={`${!error && 'hidden'} p-1`}>
          <p className='text-sm text-red-500 font-medium'>{error}!</p>
        </div>
        <button onClick={creatTask} className='font-medium active:bg-blue-300 active:text-blue-500 flex items-center justify-center gap-1 bg-blue-600 text-white p-1 w-full border border-slate-300 rounded-md'>Create Task {load && <span className='h-5 w-5 border-[2px] rounded-full  border-t-teal-400 animate-spin'></span>}</button>
        
      </div>
      <Modal open={open} footer={null} onCancel={handleCancel}>
        <div className='w-full h-full'>
          <div className='w-full p-1 flex justify-center'>
            <h3 className='text-xl font-medium'>Select Team Member</h3>
          </div>
          <hr className=''/>
          <div className='w-full'>
            {
              memb.map((u,i)=> {
                return(
                  <div className='p-1 flex items-center border-b py-2 w-full'>
                    <div className='flex items-center w-full gap-2'>
                      <Avatars height={40} width={40} s={16} name={(u?.firstname + " " + u?.lastname).toUpperCase() || ""}/>
                      <div>
                        <p className='text-sm font-medium'>{(u?.firstname + " " + u?.lastname).toUpperCase() || ""}</p>
                        <p className='text-xs font-normal'>{u?.email}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center'>
                      <input type="checkbox" checked={newTask.assignedTo.includes(u.id)} onChange={() => handleToggleAssign(u.id)} className='border'/>
                    </div>
                    
                  </div>
                )
              })
            }
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default CreateTask