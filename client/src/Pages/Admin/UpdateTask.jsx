import React, {useEffect, useState} from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import AvatarGroup from '../../Components/AvatarGroup';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { MdOutlineAttachFile } from 'react-icons/md';
import { Modal } from 'antd';
import Avatars from '../../Components/Avatars';
import { toast } from 'react-toastify';
import { FaArrowLeft } from 'react-icons/fa';

const UpdateTask = ({ handleBackToMenu }) => {
  const {id} = useParams();
  const nav = useNavigate();
  const [newTodoInput, setNewTodoInput] =useState("")
  const [newAtt, setNewAtt] =useState("")
  const [task, setTask] = useState(null);
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [memb, setMemb] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [loader, setLoader] = useState(false);
  
  
  useEffect(()=> {
    getTask();
    getUsers()
  }, []);

  const getTask = async() => {
    try {
      setLoad(true)
     const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks/get-task/${id}`) 
     if(data.ok) {
      setTask(data.finalTask)
      setNewDetails({
        title: data.finalTask?.title,
        description: data.finalTask.description,
        status: data.finalTask.status,
        priority: data.finalTask.priority,
        deadline: data.finalTask.deadline,
        todosList: data.finalTask.todosList,
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
  const getUsers = async()=> {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/allUsers`)
    if(data.ok) {
      setMemb(data.users)
    }
  }

  const updateTask = async() => {
    try {
      setLoading(true)
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/tasks/update-task/${id}`, newDetails) 
      if(data.ok) {
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
    
  }

  const handleChange = (e) => {
    setNewDetails({ ...newDetails, [e.target.name]: e.target.value });
  }
  const handleToggleAssigns = (id) => {
    const user = memb.find(u => u.id === id);
    if (!user) return;
  
    const exists = newDetails.assignedTo.some(u => u.id === id);
  
    const updated = exists
      ? newDetails.assignedTo.filter(u => u.id !== id)  // Remove
      : [...newDetails.assignedTo, user];              // Add
  
    setNewDetails(prev => ({ ...prev, assignedTo: updated }));
  };
  const openModal = ()=> {
    setOpen(true)
  }
  
  const handleCancel = ()=> {
    setOpen(false)
  }
  const openModal1 = ()=> {
    setOpen1(true)
  }
  
  const handleCancel1 = ()=> {
    setOpen1(false)
  }
  
  const handleAddTodo = (text) => {
    const newTodo = {
      id: crypto.randomUUID(), // use uuid if needed
      text,
      completed: false
    };
    setNewDetails((prev) => ({
      ...prev,
      todosList: [...prev.todosList, newTodo]
    }));
  };
  
  const handleDeleteTodo = (id) => {
    setNewDetails((prev) => ({
      ...prev,
      todosList: prev.todosList.filter(todo => todo.id !== id)
    }));
  };
  
  const handleAddAttachment = (fileText) => {
    setNewDetails((prev) => ({
      ...prev,
      attachment: [...prev.attachment, fileText]
    }));
  };
  
  const handleDeleteAttachment = (index) => {
    setNewDetails((prev) => ({
      ...prev,
      attachment: prev.attachment.filter((_, i) => i !== index)
    }));
  };
  const onAdd = () => {
    if (newTodoInput.trim() !== "") {
      handleAddTodo(newTodoInput.trim());
      setNewTodoInput(""); // Clear input after adding
    }
  }
  const onAttachmentAdd = () => {
    if (newAtt.trim() !== "") {
      handleAddAttachment(newAtt.trim());
      setNewAtt(""); // Clear input after adding
    }
  }
  const handleDeleteTask = async() => {
    try {
      setLoader(true)
      setOpen1(false)
      const { data } = await axios.delete(`${import.meta.env.VITE_API_URL}/api/tasks/delete-task/${id}`)
      if(data.ok) {
        toast.success('Task Deleted')
        nav('/dashboard/admin/task-management')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
  }

  return (
    <div className='h-full relative w-full p-3 bg-slate-100'>
      <div onClick={ handleBackToMenu } className='p-2 z-20 max-sm:bg-blue-500  absolute cursor-pointer hover:bg-cyan-400 group  active:bg-orange-300 rounded-full border sm:hidden '>
        <FaArrowLeft className='text-slate-500 max-sm:text-white group-hover:text-white'/>
      </div>
      {
        loading && (
            <div className='flex items-center justify-center mt-3'>
              <div className='h-44 w-44 border-[5px] rounded-full  border-t-teal-400 animate-spin'></div>
            </div>
        )
      }
      {
        !loading && task && (
          <div className='w-full h-full sm:pt-12 max-sm:pt-8 scrollbar p-2 flex-col flex gap-2 overflow-y-auto bg-white'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <h3 className='font-semibold text-xl'>Update Task</h3>
              </div>
              <button onClick={openModal1} className='p-1 bg-red-100 active:bg-red-600 active:text-white font-semibold rounded-md text-red-600 border flex items-center text-sm gap-1'><RiDeleteBin6Line />Delete {loader && <span className='h-4 w-4 border-[2px] rounded-full  border-t-red-400 animate-spin'></span>}</button> 
            </div>
            
            <div>
              <p className='text-sm'>Task Title</p>
              <input value={newDetails.title} onChange={handleChange} name='title' type="text" className='w-full border p-1 rounded-md border-slate-200' />
            </div>
            <div>
              <p className='text-sm'>Description</p>
              <textarea
                name="description"
                value={newDetails.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className='grid grid-cols-3 max-sm:grid-cols-1 w-full'>
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
                <input type="date" value={newDetails.deadline || ""} name='deadline' onChange={handleChange} className=' border text-sm w-full rounded-md p-1 font-medium' />
              </div>
              <div className='w-full p-1'>
                <p className='text-sm text-slate-600 font-bold'>Assigned To</p>
                {
                  newDetails.assignedTo.length === 0 && (
                    <button onClick={openModal} className=' border active:bg-slate-300 w-full text-sm text-blue-600 font-semibold bg-blue-100 rounded-md p-1'>Add Members</button>
                  )
                }
                {
                  newDetails.assignedTo.length > 0 && (
                  <AvatarGroup mod={()=> setOpen(true)} avatars={newDetails.assignedTo} maxVisible={3}/>
                  )
                }
                
              </div>        
            </div>
            <div className='flex flex-col gap-1'>
              <p className='font-medium text-sm'>Add Todos</p>
              <ul className="space-y-1">
                {newDetails.todosList.map((todo, index) => (
                  <div key={index} className='flex bg-gray-100 items-center rounded-md justify-between'>
                    <li  className="text-sm p-2  rounded-md">
                      <span className='font-semibold text-xs'>{index < 9 ? `0${index + 1}. ` : `${index + 1}. `}</span>
                      {todo.text}
                    </li>
                    <button className='px-2 cursor-pointer'>
                      <RiDeleteBin6Line onClick={()=>handleDeleteTodo(todo?.id)} className='text-red-600 active:text-cyan-500' />
                    </button>
                            
                  </div>
                          
                ))}
                        
              </ul>
              <div className='w-full border gap-2 rounded-md flex p-1'>
                <input value={newTodoInput} onChange={(e) => setNewTodoInput(e.target.value)} type="text" name='todosList' className='w-full border px-1 rounded-l-md outline-none' />
                <button onClick={onAdd} className='flex active:bg-blue-600 active:text-white text-sm font-medium p-1 border bg-slate-50 rounded-md items-center justify-center flex-shrink-0'>+ Add</button>
              </div>
            </div>
            <div>
              <p className='font-medium text-sm'>Add Attachment</p>
              <ul className="space-y-1">
                {newDetails.attachment.map((atc, index) => (
                  <div key={index}  className='flex bg-gray-100 items-center rounded-md justify-between'>
                    <li className="text-sm p-2 flex items-center justify-center  rounded-md">
                      <span className='font-semibold text-sm'><MdOutlineAttachFile /></span>
                      <p className='font-medium'>{atc}</p>
                    </li>
                    <button className='px-2 cursor-pointer'>
                      <RiDeleteBin6Line onClick={()=>handleDeleteAttachment(index)} className='text-red-600 active:text-cyan-500' />
                    </button>
                            
                  </div>
                          
                ))}
                        
              </ul>
            
              <div className='w-full border gap-2 rounded-md flex p-1'>
                <input value={newAtt} onChange={(e) => setNewAtt(e.target.value)} type="text" className='w-full border px-1 rounded-l-md outline-none' />
                <button onClick={onAttachmentAdd} className='flex active:bg-blue-600 active:text-white text-sm font-medium p-1 border bg-slate-50 rounded-md items-center justify-center flex-shrink-0'>+ Add</button>
              </div>
            </div>
            <button onClick={updateTask} className='font-medium flex gap-2 items-center justify-center active:bg-blue-300 active:text-blue-500 bg-blue-600 text-white p-1 w-full border border-slate-300 rounded-md'>Update Task {load && <span className='h-5 w-5 border-[2px] rounded-full  border-t-teal-400 animate-spin'></span>}</button>
          </div>
        )
      }
      {
        !loading && !task && (
          <div className='w-full h-full bg-white items-center pt-10 justify-center'>
            <p className='text-slate-400 text-xl font-semibold text-center'>Task Not Found</p>
          </div>
        )
      }
      
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
                  <div key={u.id} className='p-1 flex items-center border-b py-2 w-full'>
                    <div className='flex items-center w-full gap-2'>
                      <Avatars height={40} width={40} s={16} name={(u?.firstname + " " + u?.lastname).toUpperCase() || ""}/>
                      <div>
                        <p className='text-sm font-medium'>{(u?.firstname + " " + u?.lastname).toUpperCase() || ""}</p>
                        <p className='text-xs font-normal'>{u?.email}</p>
                      </div>
                    </div>
                    <div className='flex items-center justify-center'>
                      <input type="checkbox" checked={newDetails.assignedTo.some(user => user.id === u.id)} onChange={() => handleToggleAssigns(u.id)} className='border'/>
                    </div>
                    
                  </div>
                )
              })
            }
          </div>
        </div>
      </Modal>
      <Modal open={open1} footer={null} onCancel={handleCancel1}>
        <div className='w-full p-2 flex flex-col items-center justify-center h-full'>
          <p className='font-semibold text-2xl'>Are you sure? </p>
          <div className='flex p-2 items-center justify-center gap-3'>
            <button onClick={handleDeleteTask} className='font-semibold text-white bg-red-500 p-1 px-2 text-xl rounded-md'>Yes</button>
            <button onClick={()=> setOpen1(false)} className='font-semibold text-white bg-blue-500 p-1 px-2 text-xl rounded-md'>No</button>
          </div>
          
        </div>
      </Modal>
    </div>
  )
}

export default UpdateTask