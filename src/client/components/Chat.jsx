import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client'
const socket = io('http://localhost:3000');

export const Chat = () => {
  const [value, updateValue] = useState('')
  const dispatch = useDispatch()
  let messages = useSelector(state => state.messages.messages)

  useEffect(() => {
    socket.on('newMessage', (data) => {
      console.log('connected client side!')
      dispatch({ type: 'ADD_MESSAGE', payload: data })
    })

    fetch('/api/messages')
      .then(res => JSON.parse(res))
      .then(data => {
        const newMessages = []
        for (let i = 0; i < data.length; i += 1) {
          if (i === 20) return;
          newMessages.push(data[i])
        }
        messages = newMessages
      })
  }, [])


  function handleChange(e) {
    updateValue(e.target.value)
  }

  function handleSubmitChat(e) {
    e.preventDefault()
    const message = {
      content: value,
      created_by: 'iLoveDogs',
      created_at: Date.now()
    }
    updateValue('')
    socket.emit('message', message)

    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })
      .then(res => JSON.parse(res))
      .then(data => {
        console.log('message added to db')
      })
  }

  return (
    <div>
      <h3>Chat Room</h3>
      <ul className='messageList'>
        {messages.map((message) => {
          return <li>{message.created_by} - {message.content}</li>
        })}
      </ul>
      <input value={value} onChange={handleChange} type="text" />
      <button onClick={handleSubmitChat}>Post!</button>
    </div>
  )
}