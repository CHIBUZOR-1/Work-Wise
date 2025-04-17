import React, { useState } from 'react'
import axios from 'axios'
import { pix } from '../Components/Pic'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [info, setInfo] = useState({
    email: '',
    password: '',
  });

  const handleChange = async(e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  }
  const handleSubmit = async() => {
    const { data } = await axios.post('')
  }

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='flex bg-green-400 h-screen max-md:hidden w-full items-center justify-center'>
        <div className='h-full w-full'>
          <img src={pix.wk} className='w-full flex flex-shrink-0 h-full object-fill' alt="work-wise" />
        </div>
      </div>
      <div className='w-full flex flex-col gap-2 items-center'>
        <div className='w-full md:hidden flex items-center justify-center'>
            <img src={pix.wr} style={{ boxShadow: '0px 0px 10px 0px #22d3ee' }} className='h-16' alt="logo" />
          </div>
        <div className='flex w-[80%] gap-3 flex-col items-center border p-3'>
          <div>
            <h2 className='text-3xl font-medium'>Welcome Back!</h2>
            <p className='font-medium'>Log in with your details.</p>
          </div>
          <div className='space-y-2'>
            <input value={info.email} onChange={handleChange} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='email' type="email" name="email" />
            <input value={info.password} onChange={handleChange} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='password' type="password" name="password" />
            <button className='p-2 border bg-cyan-600 font-semibold text-slate-50 rounded-md w-full'>Submit</button>
            <div className='flex items-center justify-center'>
                <p className='text-slate-400'>Don't have an account? <span className='text-blue-500'><Link to='/sign-up' className='font-medium'>Register</Link></span></p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}

export default Login