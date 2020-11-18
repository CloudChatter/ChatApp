import React from 'react'


const UsersOnlineSingleProfile = ({ username }) => {


  return (
    <li>
    <div style={{display: 'flex' justify-content: 'space-between'}}>
    <h6>{username}</h6><span style={{color: 'green', display: 'inline'}}>  O</span>
    </div>
    </li>
  )
}

export default UsersOnlineSingleProfile;