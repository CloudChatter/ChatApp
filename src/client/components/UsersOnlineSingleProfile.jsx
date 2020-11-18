import React from 'react'


const UsersOnlineSingleProfile = ({ username }) => {


  return (
    <li><h6>{username}</h6><span style={{color: 'green'}}>  O</span></li>
  )
}

export default UsersOnlineSingleProfile;