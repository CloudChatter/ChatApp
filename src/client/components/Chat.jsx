import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client'
const socket = io('http://localhost:3000');


export const Chat = () => {
  let messages = useSelector(state => state.messages)
  let value = useSelector(state => state.inputText)
  const dispatch = useDispatch()

  useEffect(() => {
    socket.on('connection', () => {
      console.log('connected client side!')
      socket.on('message', data => {
        dispatch({ type: 'addMessage', payload: { data } })
      })
    })
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
      newChat: value,
      user: messages.username
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