import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client'
const socket = io();


export const Chat = () => {
  // get the state of the current username
  // array of messages
  let messages = useSelector(state => state.messages)
  // a dynamic input string
  let value = useSelector(state => state.inputText)
  const dispatch = useDispatch()

  socket.on('message', (data) => {
    console.log('connected client side!')
    console.log(data)
    dispatch({ type: 'addMessage', payload: { data } })
  })

  function handleChange(e) {
    const data = {
      inputText: e.target.value
    }
    dispatch({ type: 'handleChange', payload: { data } })
  }

  function handleSubmitChat(e) {
    console.log(e)

    e.preventDefault()
    const data = {
      text: value,
      dateCreated: Date.now()
    }


    socket.emit('message', data)
    // dispatch({ type: 'addNewChat', payload: { data } })
  }

  return (
    <div>
      <h3>Chat Room</h3>
      <ul className='messageList'>
        {/* {messages.map((message) => {
          return <li>{message.username} - {messsage.text}</li>
        })} */}
      </ul>
      <input value={value} onChange={handleChange} type="text" />
      <button onClick={handleSubmitChat}>Post!</button>
    </div>
  )
}