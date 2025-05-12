import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Avatars from '../../Components/Avatars'
import { useState } from 'react';
import { FaArrowLeft, FaCamera } from "react-icons/fa";
import { toast } from 'react-toastify';
import axios from 'axios';
import { updateProfilez } from '../../Redux/UserSlice';

const Profile = ({ handleBackToMenu }) => {
  const user = useSelector(state=> state?.user?.user);
  const dispatch = useDispatch();
  const profileImgRef = useRef(null);
  const [load, setLoad] = useState(false);
  const [det, setDet] = useState({
    first: user?.firstname || '',
    last: user?.lastname || '',
    email:  user?.email || '',
    phone:  user?.phone || '',
    image: '',
  })
  const handleChange = (e) => {
    setDet({ ...det, [e.target.name]: e.target.value });
  }
  const uploadImg = (e) => {
    const file = e.target.files[0]
    setDet(prev => ({...prev, image: file}))
  }
  const handleFileUpload = async (file) => { 
    const formData = new FormData(); 
    formData.append('file', file); 
    try { 
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/uploadProfilePhoto`, formData); 
        return data; 
    } catch (error) { 
        console.error('Error uploading file:', error); 
        return null; 
    } 
};
 const handleUpdate = async(e) => {
    e.preventDefault()
    let imageUrl = null;
    let image_id = null;
    if (det.image) { 
      const result = await handleFileUpload(det.image);
      imageUrl = result.secure_url;
      image_id = result.public_id
    }
    const newDetails = { firstname: det.first, lastname: det.last, email: det.email, phone: det.phone, image: imageUrl, image_id};
    try {
      setLoad(true)
      const {data} = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/update-user`, newDetails) 
      if(data.ok) {
        dispatch(updateProfilez(data.updatedUser));
        setDet({
          first: data.updatedUser.firstname,
          last: data.updatedUser.lastname,
          email:  data.updatedUser.email,
          phone:  data.updatedUser.phone,
          image: ''
        })
        toast.success(data.message)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoad(false)
    }
 }
  return (
    <div className='w-full h-screen flex flex-col sm:pt-14 gap-2 items-center p-2'>
      <div className="w-full max-sm:flex max-sm:w-full max-sm:gap-2 max-sm:items-center">
        <div onClick={ handleBackToMenu } className='p-2 cursor-pointer hover:bg-cyan-400 group  active:bg-orange-300 rounded-full border sm:hidden '>
          <FaArrowLeft className='text-slate-500 group-hover:text-white'/>
        </div>
        <h3 className='text-xl font-semibold'>My Profile</h3>
      </div>
      <div className='w-full flex items-center justify-center'>
        <div className=' relative w-fit rounded-full '>
          <Avatars height={300} image={!det?.image?  user?.photo : URL.createObjectURL(det.image)} width={300} s={50} name={(user?.firstname + " " + user?.lastname).toUpperCase() || ""}/>
          <div onClick={()=> profileImgRef.current.click()} className={`absolute hover hover:text-slate-50  cursor-pointer rounded-full w-8 h-8 p-2 bg-slate-200 flex items-center justify-center right-10 bottom-2 shadow`}><FaCamera /></div>
          <input onChange={uploadImg} ref={profileImgRef} hidden accept='image/*' type="file" />
        </div>
      </div>
      
      <div className='w-full space-y-1 border p-1'>
        <div className='w-full gap-2 flex items-center justify-center'>
          <p>Firstname:</p>
          <input className='w-full border font-semibold p-1' onChange={handleChange} value={det.first} type="text" name="first"/> 
        </div>
        <div className='w-full gap-2 flex items-center justify-center'>
          <p>Lastname:</p>
          <input className='w-full border font-semibold p-1' onChange={handleChange} value={det?.last} type="text" name="last" /> 
        </div>
        <div className='w-full gap-2 flex items-center justify-center'>
          <p>Email:</p>
          <input className='w-full border font-semibold p-1' onChange={handleChange} value={det?.email} type="email" name="email"/> 
        </div>
        <div className='w-full gap-2 flex items-center justify-center'>
          <p>Phone:</p>
          <input className='w-full border font-semibold p-1' onChange={handleChange} value={det?.phone} type="text" name="phone" /> 
        </div>
        
      </div>
      <div className='w-full flex items-center justify-center p-1'>
        <button onClick={handleUpdate}  className='p-2 w-[70%] flex gap-2 justify-center items-center active:bg-blue-400 bg-blue-600 text-slate-50 font-semibold rounded-md'>Update {load && <span className='h-5 w-5 border-[2px] rounded-full  border-t-teal-400 animate-spin'></span>}</button>
      </div>
    </div>
  )
}

export default Profile