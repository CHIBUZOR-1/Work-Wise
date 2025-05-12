import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [dataz, setData] = useState({
    email: '',
    secret: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const [load, setLoad] = useState(false)
  const handleSubmit = async(e)=> {
    e.preventDefault()
    try {
      if(dataz.confirmNewPassword === dataz.newPassword) {
        setLoad(true)
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/reset-password`, dataz);
        if(data.ok) {
          toast.success(data.msg)
          navigate('/')
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoad(false)
    }
  }
   const handleChange = (e) => {
    setData({ ...dataz, [e.target.name]: e.target.value });
  }
  return (
    <div className='flex items-center p-3 justify-center w-full'>
        <div className='flex w-full flex-col gap-2 items-center justify-center'>
            <div className='w-full flex items-center justify-center '>
                <h2 className=' font-semibold border p-1 px-1 text-7xl text-slate-400'>w<span className='-ml-5 text-blue-400'>w</span></h2>
            </div>
            <div className='border p-3 flex flex-col items-center max-md:w-[80%] justify-center rounded-md md:w-[50%]'>
                <h2 className='font-bold text-2xl max-sm:text-xl text-center text-slate-600'>RESET PASSWORD</h2>
                <form className='flex flex-col w-full justify-center gap-2' onSubmit={handleSubmit}>
                    <div className='text-slate-600'>
                        <label htmlFor='email'>
                            <strong>Email</strong>
                        </label>
                        <br />
                        <input name='email' className='p-1 border border-slate-300 w-full outline-blue-300 rounded-md' value={dataz.email} type='email' id='email' onChange={handleChange} />
                    </div>
                    <br />
                    <div className='text-slate-600'>
                        <label htmlFor='secret'>
                            <strong>Your Secret keyword</strong>
                        </label>
                        <br />
                        <input name='secret' className='p-1 border border-slate-300 w-full outline-blue-300 rounded-md' value={dataz.secret} type='text'  id='secret' onChange={handleChange} required/>
                    </div>
                    <br />
                    <div className='text-slate-600'>
                        <label htmlFor='newPassword'>
                            <strong>New Password</strong>
                        </label>
                        <br />
                        <input name='newPassword' className='p-1 border border-slate-300 w-full outline-blue-300 rounded-md' value={dataz.newPassword}type='password' id='newPassword' onChange={handleChange} />
                    </div>
                    <br />
                    <div className='text-slate-600'>
                        <label  htmlFor='confirmNewPassword'>
                            <strong>Confirm New Password</strong>
                        </label>
                        <br />
                        <input name='confirmNewPassword' className='p-1 border border-slate-300 w-full outline-blue-300 rounded-md' value={dataz.confirmNewPassword} type='password' id='confirmNewPassword' onChange={handleChange} />
                    </div>
                    <br />
                    <div className='w-full flex items-center justify-center p-1'>
                        <button className='p-2 bg-blue-500 active:bg-orange-800 rounded-md w-[70%] text-white font-semibold' type='submit'>RESET</button>
                    </div>
                </form>
                
            </div>

       </div>
    </div>
  )
}

export default ForgotPassword