import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom'
import { RiDashboardFill } from "react-icons/ri";
import Avatars from '../../Components/Avatars';
import { SlLogout } from "react-icons/sl";
import { logout } from '../../Redux/UserSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { pix } from '../../Components/Pic';
import Plan from '../../Components/Plan';

const Homepage = () => {
  const user = useSelector(state => state?.user?.user);
  const location = useLocation()
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logOut = async()=> {
    const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/logout`);
    if(data.ok) {
      toast.success(data.msg);
      dispatch(logout());
      navigate('/')
    }
    
  }
  let title = '';
  switch (location.pathname) {
    case '/dashboard/admin':
      title = 'Admin Dashboard';
      break;
    case '/dashboard/admin/panel':
      title = 'Admin Dashboard Panel Page';
      break;
    case '/dashboard/admin/profile':
      title = 'Your Profile Page';
      break;
    case '/dashboard/admin/create-task':
      title = 'Create Task Page';
      break;
    case '/dashboard/admin/team':
      title = 'Team Members Page';
      break
    case '/dashboard/admin/task-management':
      title = 'Task Management Page';
      break;
    default:
      title = 'Work-Wise';
  }
  //svg+xml
  return (
    <Plan title={title}>
      <div className='flex max-sm:gap-4 overflow-hidden h-screen'>
        <div className={`w-[180px] ${location.pathname !== '/dashboard/admin' && 'hidden sm:block'} max-sm:p-1 max-sm:w-full sm:pt-14 h-full max-sm:px-2 border border-t-0`}>
          <div className='sm:hidden border border-slate-100 w-full items-center gap-2 flex p-2'>
            <div className='h-9 w-9'>
              <img src={pix.wk} className='w-full flex flex-shrink-0 h-full object-fill' alt="work-wise" />
            </div>
            <p className='font-bold text-xl bg-gradient-to-r from-slate-500 to-blue-400 text-transparent bg-clip-text'>Work-Wise</p>
          </div>
          <div className='w-full flex flex-col gap-1 py-2 items-center justify-center'>
            <Avatars height={60} image={user?.photo} width={60} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""}/>
            <p className='font-semibold'>{user?.firstname}</p>
            <h3 className='font-medium text-sm'>{user?.email}</h3>
          </div>
          <aside className='flex flex-col max-sm:grid max-sm:grid-cols-2 sm:h-full py-2 px-1 max-sm:gap-3 max-sm:w-full sm:gap-4'>
                <Link to={'panel'}  className='cursor-pointer bg-blue-500 max-sm:rounded-md hover:bg-blue-200 group  px-3 h-[40px] text-[20px] border'>
                    <p  className='group-hover:text-blue-500 font-semibold text-white max-sm:text-[18px] flex items-center justify-between'><span className='group-hover:text-blue-500 flex rounded items-center text-slate-50 mt-1 p-1 text-[19px]'><RiDashboardFill /></span> Dashboard</p>
                </Link>
                <Link to={'profile'}  className='cursor-pointer bg-blue-500 max-sm:rounded-md hover:bg-blue-200 group  px-3 h-[40px] text-[20px] border'>
                    <p  className='group-hover:text-blue-500 font-semibold text-white max-sm:text-[18px] flex items-center justify-between'>Profile <span className={`bg-black text-white flex rounded items-center mt-1 p-1 text-[12px]`}>Admin</span></p>
                </Link>
                <Link to={'task-management'}  className='cursor-pointer bg-blue-500 max-sm:rounded-md hover:bg-blue-200  group px-3 h-[40px] text-[20px] border'>
                    <p className='group-hover:text-blue-500 font-semibold text-white max-sm:text-[18px] '>Manage tasks</p>
                </Link>
                <Link to={'create-task'}  className='cursor-pointer bg-blue-500 max-sm:rounded-md hover:bg-blue-200 group  px-3 h-[40px] text-[20px] border '>
                    <p className='group-hover:text-blue-500 font-semibold text-white max-sm:text-[18px] '>Create Task</p>
                </Link>
                <Link  to={'team'}  className='cursor-pointer bg-blue-500 max-sm:rounded-md group hover:bg-blue-200 px-3 h-[40px] text-[20px] border '>
                    <p className='group-hover:text-blue-500 font-semibold text-white max-sm:text-[18px] '>Team</p>
                </Link>
                <button onClick={logOut} className='w-full flex hover:border-blue-500 border p-2 max-sm:rounded-md active:bg-blue-100 font-semibold items-center gap-1 text-slate-700'><span><SlLogout  className='text-blue-500'/></span>Logout</button>
          </aside>
        </div>
        <main className={`${location.pathname === '/dashboard/admin' ?  'hidden' : 'block'} w-full h-screen overflow-hidden`}>
          <Outlet />
        </main>
        <div className={`${location.pathname === '/dashboard/admin'? 'block' : 'hidden'} flex items-center max-sm:hidden bg-blue-800 h-full w-full`}>
          <div className='w-full p-2 flex flex-col gap-2 items-center justify-center'>
            <div className='w-full flex items-center justify-center '>
                <h2 className=' font-semibold border bg-white rounded-md p-1 px-1 text-7xl text-slate-400'>w<span className='-ml-5 text-blue-400'>w</span></h2>
            </div>
            <p className='text-2xl font-mono font-medium text-white'>Welcome to WORK-WISE Admin Dashboard</p>
          </div>
        </div>
      </div>
    </Plan>
  )
}

export default Homepage