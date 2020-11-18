import React from 'react'


const UsersOnlineSingleProfile = ({ username }) => {


  return (
    <li>
    <div>
    <span style={{color: 'green', display: 'inline'}}><h6>{username}</h6></span>
    </div>
    </li>
  )
}

export default UsersOnlineSingleProfile;