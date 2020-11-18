import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom'
import WordCloudContainer from './WordCloudContainer';
import io from 'socket.io-client'
const socket = io('http://localhost:3000');




export const Chat = () => {
  const [value, updateValue] = useState('')
  const dispatch = useDispatch()
   
  const messages = useSelector(state => state.messages.messages)
  const currUser = useSelector(state => state.messages.currUser)

  // fetch('https://github.com/login/oauth/authorize')
  //   .then()

  window.fbAsyncInit = function () {
    FB.init({
      appId: '820271622144617',
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v9.0'
    });

    FB.login(function (response) {
      if (response.authResponse) {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me', function (response) {
          console.log('Good to see you, ' + response.name + '.');
          dispatch({ type: 'LOGIN', payload: response.name })
        });
      } else {

        console.log('User cancelled login or did not fully authorize.');
      }
    });
  };

  useEffect(() => {

    // this is an active listener for a new message (sent from any user)
    socket.on('newMessage', (data) => {
      // any new message that comes in (from a different user), add it to state
      dispatch({ type: 'ADD_MESSAGE', payload: data })
    });

    // when a user joins, get the latest messages
    fetch('/api/messages')
      .then(res => res.json())
      .then(({ data }) => {
        console.log('data back from server, get messages', data)
        // here's where we have the 100 messages, back from the server
        // we should send them to state thru a redux action
        dispatch({ type: 'GET_MESSAGES', payload: data})
      })
      .catch(error => {
        console.log(error);
      });
  
  }, [])

  function addMessageToDB(msgData) {
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(msgData)
    })
      .then(res => {
        console.log('server response', res)
        return JSON.parse(res)
      })
      .then(data => {
        console.log('message added to db')
      })
      .catch(error => {
        console.log("error in adding msg to DB", error);
      });
  }

  function handleChange(e) {
    updateValue(e.target.value)
  }

  function handleSubmitChat(e) {
    e.preventDefault()
    const message = {
      content: value,
      created_by: currUser,
      created_at: new Date().toISOString()
    }
    updateValue('')
    // this sends the message to all users
    socket.emit('message', message)

    addMessageToDB(message)
  }



  return (
    <div>
      <div>
        <h3>Chat Room!</h3>
        <ul className='messageList'>
          {messages.map((message) => {
            return <li>{message.created_by} - {message.content}</li>
          })}
        </ul>
        <input value={value} onChange={handleChange} type="text" />
        <button onClick={handleSubmitChat}>Post!</button>
      </div>
      {!!messages.length && (
        <WordCloudContainer />

      )}
    </div>
  )
}


export default withRouter(Chat);
