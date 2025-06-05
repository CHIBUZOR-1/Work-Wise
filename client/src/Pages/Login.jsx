import React, { useState } from 'react'
import axios from 'axios'
import { pix } from '../Components/Pic'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../Redux/UserSlice';

const Login = ({installed, showInstallModal}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [info, setInfo] = useState({
    email: '',
    password: '',
  });
  const [load, setLoad] = useState(false);
  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  }
  const handleSubmit = async(e) => {
    try {
      e.preventDefault();
      setLoad(true)
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/login`, info)
      if (data.ok) {
        toast.success(data.msg);
        dispatch(setUser(data.details));
        setInfo({
            email: "",
            password: ""
        });
        if(data.details.admin) {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/user');
        }
         
      }else {
        toast.error(data.msg || "Registration failed, please try again.");
      }
    } catch (error) {
      console.error("❌ Registration Error:", error.response?.data?.msg || error.message);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoad(false)
    }
  }

  return (
    <div className='flex relative h-screen items-center justify-center'>
      <div className={`${installed && 'hidden'} absolute z-40 top-2 right-2`}>
        <button disabled={!window.matchMedia('(display-mode: browser)').matches && !window.navigator.standalone} onClick={showInstallModal} className='flex active:bg-blue-400 items-center justify-center p-2 bg-blue-700 rounded-md text-white font-semibold'>Install</button>
      </div>
      <div className='flex h-screen max-md:hidden w-full items-center justify-center'>
        <div className='h-full w-full'>
          <img src={pix.work_wise} className='w-full flex flex-shrink-0 h-full object-fill' alt="work-wise" />
        </div>
      </div>
      <div className='w-full flex flex-col gap-2 items-center'>
        <div className='w-full md:hidden flex items-center justify-center'>
            <img src={pix.work_wise} style={{ boxShadow: '0px 0px 10px 0px #22d3ee' }} className='h-16' alt="logo" />
          </div>
        <div className='flex w-[80%] gap-3 flex-col items-center border p-3'>
          <div>
            <h2 className='text-3xl max-sm:text-xl text-center font-medium'>Welcome Back!</h2>
            <p className='font-medium text-center max-sm:text-sm'>Log in with your details.</p>
          </div>
          <div className='space-y-2'>
            <input value={info.email} onChange={handleChange} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='email' type="email" name="email" />
            <input value={info.password} onChange={handleChange} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='password' type="password" name="password" />
            <button onClick={handleSubmit} className='p-2 flex items-center gap-2 justify-center border bg-blue-800 font-semibold text-slate-50 rounded-md w-full'>
             Login
             {load && <span className='h-5 w-5 border-[2px] rounded-full  border-t-teal-400 animate-spin'></span>}
            </button>
            <div className='w-full flex  p-1'>
              <p onClick={()=> navigate('/forgot-password')} className='ml-auto max-sm:text-sm text-blue-500 active:text-blue-300 cursor-pointer font-semibold'>Forgot password</p>
            </div>
            <div className='flex items-center justify-center'>
                <p className='text-slate-400 max-sm:text-sm'>Don't have an account? <span className='text-blue-500'><Link to='/sign-up' className='font-medium'>Register</Link></span></p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Login