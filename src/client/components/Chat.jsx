import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client'
const socket = io();


export const Chat = () => {
  // access the currentUser contained within state
  // dispatch the changes to the input: access the current state of those changes
  // access current state of the input -> to send that text
  // access the state of messages
  const [value, updateValue] = useState('')



  // get the state of the current username
  // array of messages
  // let messages = useSelector(state => state.messages)
  // a dynamic input string
  // let value = useSelector(state => state.inputText)
  const dispatch = useDispatch()

  socket.on('message', (data) => {
    console.log('connected client side!')
    // dispatch({ type: 'addMessage', payload: { data } })

  })

  function handleChange(e) {
    // const data = {
    //   inputText: e.target.value
    // }
    updateValue(e.target.value)
    // dispatch({ type: 'handleChange', payload: data })
  }

  function handleSubmitChat(e) {
    console.log(e)

    e.preventDefault()
    const message = {
      text: value,
      username: 'iLoveDogs',
      createdAt: Date.now()
    }
    socket.emit('message', message)
  }

  return (
    <div>
      <h3>Chat Room</h3>
      <ul className='messageList'>
        {messages.map((message) => {
          return <li>{message.username} - {messsage.text}</li>
        })}
      </ul>
      <input value={value} onChange={handleChange} type="text" />
      <button onClick={handleSubmitChat}>Post!</button>
    </div>
  )
}