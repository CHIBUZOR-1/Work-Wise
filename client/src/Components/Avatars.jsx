import React from 'react'

const Avatars = ({name}) => {
    let avatarName = "";
    if(name) {
        const splitName = name?.split(" ");

        if (splitName.length >= 2) {
            avatarName = splitName[0][0] + splitName[splitName.length - 1][0]
        } else {
            avatarName = splitName[0][0]
        }
    }
  return (
    <div>Avatars</div>
  )
}

export default Avatars