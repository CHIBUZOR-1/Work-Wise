import React from 'react'
import { pix } from './Pic'

const AppBar = () => {
  return (
    <div className='max-sm:hidden fixed border bg-white z-30 border-slate-100 w-full items-center gap-2 flex p-2'>
        <div className='h-9 w-9'>
            <img src={pix.work_wise} className='w-full flex flex-shrink-0 h-full object-fill' alt="work-wise" />
        </div>
        <p className='font-bold text-xl bg-gradient-to-r from-slate-500 to-blue-400 text-transparent bg-clip-text'>Work-Wise</p>
    </div>
  )
}

export default AppBar