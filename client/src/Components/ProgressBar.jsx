import React from 'react'

const ProgressBar = ({progress, status}) => {
  const getColor = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Pending':
        return 'bg-gray-400';
      default:
        return 'bg-blue-500'; // fallback color
    }
  };
  return (
    <div className='w-full mt-1 bg-gray-100 rounded-full h-1.5'>
        <div className={`rounded-full h-1.5 ${getColor()}`} style={{width: `${progress}%`}}></div>
    </div>
  )
}

export default ProgressBar