import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { pix } from '../Components/Pic';
import { toast } from 'react-toastify';


const SignUp = () => {
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
    const [info, setInfo] = useState({
        firstname: '',
        lastname: '',
        email: '',
        username: '',
        password: '',
        confirm: '',
        phone: ''
      });
      
      const handleChange = (e) => {
        setInfo({ ...info, [e.target.name]: e.target.value });
      }

      const handleSubmit = async(e)=> {
        try {
          e.preventDefault();
          setLoad(true)
          if (info.confirm !== info.password) {
            toast.error("Passwords do not match.");
            return setLoad(false);
          }
          const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/register`, info);
          if (data.ok) {
            toast.success(data.msg);
            setInfo({
                firstname: "",
                lastname: "",
                username: "",
                email: "",
                phone: "",
                password: "",
                confirm: ""
            });
            navigate('/');
          } else {
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
    <div className='flex h-screen items-center justify-center'>
          <div className='flex bg-green-400 h-screen max-md:hidden w-full items-center justify-center'>
            <div className='h-full w-full'>
              <img src={pix.work_wise} className='w-full flex flex-shrink-0 h-full object-fill' alt="work-wise" />
            </div>
          </div>
          <div className='w-full flex flex-col gap-1 items-center'>
            <div className='w-full md:hidden flex items-center justify-center'>
                <img src={pix.work_wise} style={{ boxShadow: '0px 0px 10px 0px #22d3ee' }} className='h-16' alt="logo" />
              </div>
            <div className='flex w-[80%] gap-3 flex-col items-center border p-3'>
              <div>
                <h2 className='text-3xl max-sm:text-xl text-center font-medium'>Welcome Back!</h2>
                <p className='font-medium text-center max-sm:text-sm'>Log in with your details.</p>
              </div>
              <div className='space-y-2'>
                <input onChange={handleChange} value={info.firstname} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='Firstname' type="text" name="firstname" />
                <input onChange={handleChange} value={info.lastname} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='Lastname' type="text" name="lastname" />
                <input onChange={handleChange} value={info.email} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='email' type="text" name="email" />
                <input onChange={handleChange} value={info.username} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='username' type="text" name="username" />
                <input onChange={handleChange} value={info.phone} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='Phone' type="text" name="phone" />
                <input onChange={handleChange} value={info.password} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='Password' type="password" name="password" />
                <input onChange={handleChange} value={info.confirm} className='w-full p-2 border max-md:text-sm font-medium rounded-md border-slate-300' placeholder='Confirm Password' type="password" name="confirm" />
                <button onClick={handleSubmit}  className='p-2 border flex items-center justify-center gap-2 bg-blue-800 font-semibold text-white rounded-md w-full'>Submit {load && <span className='h-5 w-5 border-[2px] rounded-full  border-t-teal-400 animate-spin'></span>}</button>
              </div>
              <div className='flex items-center justify-center'>
                    <p className='text-slate-400 max-sm:text-sm'>Already have an account? <span className='text-blue-600 font-semibold'><Link to='/' style={{ textDecoration: 'none '}}>Login</Link></span></p>
                </div>
            </div>
            
          </div>
    </div>
  )
}

export default SignUp