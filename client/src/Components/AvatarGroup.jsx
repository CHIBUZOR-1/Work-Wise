import React from 'react'
import Avatars from './Avatars'

const AvatarGroup = ({maxVisible, avatars,mod}) => {
  return (
    <div onClick={mod} className='flex hover:border items-center w-full p-1 cursor-pointer'>
        {
            avatars.slice(0, maxVisible).map((av, index) => {
                return(
                    <div key={index} className='-ml-2 first:ml-0'>
                        <Avatars width={35} height={35} s={15} image={av?.image} name={(av?.firstname + " " + av?.lastname).toUpperCase()}/>
                          
                    </div>
                    
                )
            })
        }
        {
            avatars.length > maxVisible && (
                <div className='flex flex-shrink-0 h-[35px] w-[35px] -ml-2 font-medium bg-blue-50 items-center justify-center text-sm rounded-full border'>
                    +{avatars.length - maxVisible}
                </div>
            )
        } 
    </div>
  )
}

export default AvatarGroup