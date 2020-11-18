import React from 'react'
import { useSelector } from 'react-redux'
import UsersOnlineSingleProfile from './UsersOnlineSingleProfile'

 const UsersOnlineDisplay = () => {

  const listOfUsersOnline = useSelector((state) => state.messages.listOfUsersOnline);
  const currUser = useSelector((state) => state.messages.currUser);

  const userList = Object.keys(listOfUsersOnline).map((username) => {
    // if (username === currUser) return;
   
    return <UsersOnlineSingleProfile  username={username}/>
  })

  return (
    <div>
      <h4> Users Currently Online:</h4>
      <ul>
        {userList}
      </ul>
    </div>
  )
}

export default UsersOnlineDisplay;