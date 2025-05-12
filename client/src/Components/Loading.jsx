import React from 'react'

const Loading = () => {
  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='h-44 w-44 border-[5px] rounded-full  border-t-teal-400 animate-spin'></div>
    </div>
  )
}

export default Loading