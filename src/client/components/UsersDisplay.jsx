import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import io from 'socket.io-client';
// import dotenv from 'dotenv'
// dotenv.config();

// let socketPort;
// if (process && process.env && process.env.PORT) {
//   socketPort = process.env.PORT
// } else socketPort = 'http://localhost:3000'

const socket = io("https://chatter-cloud.herokuapp.com/");

 const UsersDisplay = () => {
  const dispatch = useDispatch();
  const listOfUsersOnline = useSelector((state) => state.messages.listOfUsersOnline);
  const currUser = useSelector((state) => state.messages.currUser);
  const usersOnline = useSelector((state) => state.messages.usersOnline);

  useEffect(() => {
    socket.on('add user to state', (data) => {
      console.log('new user joined!', data);
      dispatch({ type: 'NEW_USER', payload: data})
    })

    socket.on('user left', (socketID) => {
      dispatch({ type: "USER_LEFT", payload: socketID})
    })

    // socket.on('all user data', (data) => {
    //   console.log('loading all websocket user data')
    //   dispatch({type: 'BUILD_USER_DATA', payload: data})
    // })

  }, [])

  const userList = Object.entries(listOfUsersOnline).map(([ key, value ]) => {
    const styleObj = {}
    if (!key) return
    styleObj['color'] = (key === currUser)? "green" : "blue"
    let name = (key === currUser) ? key : `${key} has joined!`
    return <li style={styleObj}>{key}</li>
  })

  return (
    <div>
      <h4> Users that have joined after you:</h4>
      <ul>
        {userList}
      </ul>
    </div>
  )
}

export default UsersDisplay;