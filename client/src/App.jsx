import React, { useEffect, useState } from 'react'
import ScrollTop from './Components/ScrollTop'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Homepage from './Pages/Admin/Homepage'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import { ToastContainer } from 'react-toastify';
import NotFound from './Pages/NotFound'
import ManageTasks from './Pages/Admin/ManageTasks'
import UpdateTask from './Pages/Admin/UpdateTask'
import CreateTask from './Pages/Admin/CreateTask'
import Teams from './Pages/Admin/Teams'
import Profile from './Pages/Admin/Profile'
import MyProfile from './Pages/Team/MyProfile'
import MyTasks from './Pages/Team/MyTasks'
import AdminRoute from './Components/AdminRoute'
import UserRoute from './Components/UserRoute'
import Home from './Pages/Team/Home'
import Panel from './Pages/Admin/Panel'
import TeamPanel from './Pages/Team/TeamPanel'
import TeamsTodoUpdate from './Pages/Team/TeamsTodoUpdate'
import EntryLoad from './Components/EntryLoad'
import ForgotPassword from './Pages/ForgotPassword'

const App = () => {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
  useEffect(() => { 
    setTimeout(() => { 
      setLoading(false); 
    }, 3000);  
  }, []); 
  if (loading) { 
    return <EntryLoad />; 
  }
  return (
    <>
      <ToastContainer className='max-sm:flex max-sm:w-full px-1 max-sm:justify-center font-semibold' />
      <ScrollTop />
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='*' element={<NotFound/>}/>
        <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<Homepage />}>
          <Route path='panel' element={<Panel handleBackToMenu={() => navigate('/dashboard/admin')} />}/>
            <Route path='create-task' element={<CreateTask handleBackToMenu={() => navigate('/dashboard/admin')} />}/>
            <Route path='profile' element={<Profile handleBackToMenu={() => navigate('/dashboard/admin')} />}/>
            <Route path='task-management' element={<ManageTasks handleBackToMenu={() => navigate('/dashboard/admin')}/>}/>
            <Route path='update-task/:id' element={<UpdateTask handleBackToMenu={() => navigate('/dashboard/admin')}/>}/>
            <Route path='team' element={<Teams handleBackToMenu={() => navigate('/dashboard/admin')}/>} />
          </Route>
        </Route>
        <Route path="/dashboard" element={<UserRoute />}>
          <Route path="user" element={<Home />}>
          <Route path='panel' element={<TeamPanel handleBackToMenu={() => navigate('/dashboard/user')}/>} />
            <Route path='profile' element={<MyProfile handleBackToMenu={() => navigate('/dashboard/user')}/>} />
            <Route path='my-tasks' element={<MyTasks handleBackToMenu={() => navigate('/dashboard/user')}/>} />
            <Route path='update-task-todos/:id' element={<TeamsTodoUpdate handleBackToMenu={() => navigate('/dashboard/user')}/>} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}
 
export default App
