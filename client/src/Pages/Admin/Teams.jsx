import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Avatars from '../../Components/Avatars';
import { FaArrowLeft } from 'react-icons/fa';
import { GrDocumentText } from 'react-icons/gr';

const Teams = ({ handleBackToMenu }) => {
  const [teams, setAllteams] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(()=> {
      getAllTeams();
    }, []);
  const getAllTeams = async() => {
    try {
      setLoader(true)
     const {data} = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/allUsers`) 
     if(data.ok) {
      setAllteams(data.users)
     }
    } catch (error) {
      console.log(error)
    } finally {
      setLoader(false)
    }
    
  }
    const handleDownloadUsersReport = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/rep/users-reports`, { responseType: 'blob' });

      const url = window.URL.createObjectURL(data);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'users_report.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading user report:', err);
    }
  }

  return (
    <div className='h-full flex flex-col gap-3 items-center w-full p-2'>
      <div className=' w-full max-sm:fixed max-sm:bg-white max-sm:p-2 flex justify-between items-center gap-1'>
        <div className='flex items-center gap-2'>
          <div onClick={ handleBackToMenu } className='p-2 bg-blue-600 cursor-pointer hover:bg-cyan-400 group  active:bg-orange-300 rounded-full border sm:hidden '>
            <FaArrowLeft className='text-white group-hover:text-white'/>
          </div>
          <h3 className='text-xl font-medium'>Teams <span className='border px-1'>{teams.length}</span></h3>
        </div>
        <div onClick={handleDownloadUsersReport} className='flex cursor-pointer gap-2 rounded bg-green-200 p-1 items-center justify-center'>
          <GrDocumentText className='text-slate-500' />
          <p className='text-sm font-semibold'>Download Report</p>
        </div>
      </div>
      {
        loader && (
          <div className='pt-11 w-full flex items-center justify-center'>
            <div className='h-44 w-44 border-[5px] rounded-full  border-t-teal-400 animate-spin'></div>
          </div>
          
        )
      }
      {
        !loader && teams.length === 0 && (
          <div>No users Found</div>
        )
      }
      {
        !loader && teams.length > 0 &&  (
          <div className='grid grid-cols-3 overflow-y-auto scrollbar max-md:grid-cols-2 p-2 pt-14 max-sm:grid-cols-1 gap-2 w-full'>
            {
              teams.map((t,i)=> {
                return (
                  <div style={{ boxShadow: '0px 0px 5px 0px #94a3b8' }} className='w-full flex-col gap-2 flex p-2' key={i}>
                    <div className=' flex gap-2 items-center justify-between'>
                      <Avatars image={t?.image} height={60} width={60} name={(t?.firstname + " " + t?.lastname).toUpperCase() || ""}/>
                      <div className='w-full'>
                        <h3 className='font-bold text-sm'>{(t?.firstname + " " + t?.lastname).toUpperCase() || ""}</h3>
                        <p className='text-sm font-normal'>{t?.email}</p>
                      </div>
                    </div>
                    <div className='grid gap-1 grid-cols-3 w-full p-1'>
                      <div className='w-full p-1 bg-slate-100'>
                        <p className='text-xs font-medium'>{t?.taskCounts?.pending}</p>
                        <p className='text-xs font-semibold text-red-500'>Pending</p>
                      </div>
                      <div className='w-full p-1 bg-slate-100'>
                        <p className='text-xs font-medium'>{t?.taskCounts?.inProgress}</p>
                        <p className='text-xs font-semibold text-yellow-500'>In Progress</p>
                      </div>
                      <div className='w-full p-1 bg-slate-100'>
                        <p className='text-xs font-medium'>{t?.taskCounts?.completed}</p>
                        <p className='text-xs font-semibold text-green-500'>Completed</p>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        )
      }
      
    </div>
  )
}

export default Teams