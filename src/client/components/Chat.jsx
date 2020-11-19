import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import WordCloudContainer from './WordCloudContainer';
import UsersDisplay from './UsersDisplay';
import io from 'socket.io-client';
// import dotenv from 'dotenv'
// dotenv.config();

// let socketPort;
// if (process && process.env && process.env.PORT) {
//   socketPort = process.env.PORT
// } else socketPort = 'http://localhost:3000'
// const socket = io(socketPort);
const socket = io("https://chatter-cloud.herokuapp.com/");

const Chat = ({ history }) => {
  console.log('history is', history);
  const [value, updateValue] = useState('');
  const dispatch = useDispatch();

  const listOfUsersOnline = useSelector(
    (state) => state.messages.listOfUsersOnline
  );
  const messages = useSelector((state) => state.messages.messages);
  const currUser = useSelector((state) => state.messages.currUser);

  // fetch('https://github.com/login/oauth/authorize')
  //   .then()

  // window.fbAsyncInit = function () {
  //   FB.init({
  //     appId: '820271622144617',
  //     autoLogAppEvents: true,
  //     xfbml: true,
  //     version: 'v9.0'
  //   });

  //   FB.login(function (response) {
  //     if (response.authResponse) {
  //       console.log('Welcome!  Fetching your information.... ');
  //       FB.api('/me', function (response) {
  //         console.log('Good to see you, ' + response.name + '.');
  //         dispatch({ type: 'LOGIN', payload: response.name })
  //       });
  //     } else {

  //       console.log('User cancelled login or did not fully authorize.');
  //     }
  //   });
  // };

  useEffect(() => {
    // this is an active listener for a new message (sent from any user)
    socket.on('newMessage', (data) => {
      console.log('connected client side!');
      dispatch({ type: 'ADD_MESSAGE', payload: data });
    });

    // get username from server
    fetch('/api/login/success')
      .then((res) => res.json())
      .then((data) => {
        console.log('response from api/login/success is', data);
        if (data.isAuth) dispatch({ type: 'LOGIN', payload: data.username });
        else history.push('/');
      })
      .catch((err) => console.log(err));

    // when a user joins, get the latest messages
    fetch('/api/messages')
      .then((res) => res.json())
      .then(({ data }) => {
        // here's where we have the latest 100 messages -  send them to state
        dispatch({ type: 'GET_MESSAGES', payload: data });
      })
      .catch((error) => {
        console.log(error);
      });
    // as the last step when data is loaded, we will get all user data (from the socket)
    // socket.emit('get all data');
  }, []);

  // send the fact that a new user has joined to everyone else
  useEffect(() => {
    socket.emit('new user', currUser);
  }, [currUser]);

  function addMessageToDB(msgData) {
    fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(msgData),
    })
      .then((res) => {
        console.log('server response', res);
        return JSON.parse(res);
      })
      .then((data) => {
        console.log('message added to db');
      })
      .catch((error) => {
        console.log('error in adding msg to DB', error);
      });
  }

  function handleChange(e) {
    updateValue(e.target.value);
  }

  function handleSubmitChat(e) {
    e.preventDefault();
    const message = {
      content: value,
      created_by: currUser,
      created_at: new Date().toISOString(),
    };
    updateValue('');
    // this sends the message to all users
    socket.emit('message', message);

    addMessageToDB(message);
  }

  function handleLogOut(e) {
    e.preventDefault();
    fetch('api/logout')
      .then((data) => data.json())
      .then((data) => {
        // data from server is {isAuth: false, username: undefined}
        dispatch({ type: 'LOGOUT', payload: data.username });
        history.push('/');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const messagesStyleObj = {
      'overflow-y': 'auto !important',
      'max-height': '850px'
  }

  const orderedMessages = messages.reverse()
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={messagesStyleObj}>
          <h3>Chat Room!</h3>
          <input value={value} onChange={handleChange} type="text" />
          <button onClick={handleSubmitChat}>Post!</button>
          <button onClick={handleLogOut}>Log Out</button>
          <ul className="messageList">
            {orderedMessages.map((message) => {
              return (
                <li>
                  {message.created_by} - {message.content}
                </li>
              );
            })}
          </ul>
          
        </div>
        {!!messages.length && <WordCloudContainer />}
        <UsersDisplay />
      </div>
      
    </div>
  );
};

export default withRouter(Chat);
