import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

const Login = ({ history }) => {
  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');
  const dispatch = useDispatch();

  function handleClick(e) {
    e.preventDefault();
    const body = { email, password };
    fetch('api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('response from login POST', data);
        if (data.isAuth) {
          console.log('data is', data);
          dispatch({ type: 'LOGIN', payload: data.username });
          history.push('/chat');
        } else {
          // display login retry message
        }
      })
      .catch((err) => console.log(err));
  }

  function handleGoogleClick(e) {
    // e.preventDefault();
    console.log('hello from google button');
    fetch('/auth/google', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('response from google oauth', data);
        if (data.isAuth) {
          console.log('data is', data);
          dispatch({ type: 'LOGIN', payload: data.username });
          history.push('/chat');
        } else {
          // display login retry message
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <>
      <h1>Cloud Chatter</h1>
      <input
        type="text"
        placeholder="email"
        onChange={(e) => updateEmail(e.target.value)}
      ></input>
      <input
        type="text"
        placeholder="password"
        onChange={(e) => updatePassword(e.target.value)}
      ></input>
      <button onClick={handleClick}>Submit</button>
      {/* <button onClick={handleGoogleClick}>Google</button> */}
      <a href="/auth/google">Google</a>
      {/* <Link to={'/register'}>
        <button> Register Here</button>
      </Link> */}
    </>
  );
};

// export default Login;
export default withRouter(Login);
