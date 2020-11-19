import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

const Register = ({ history }) => {
  const [email, updateEmail] = useState('');
  const [username, updateUsername] = useState('');
  const [password, updatePassword] = useState('');
  const dispatch = useDispatch();

  function handleClick(e) {
    e.preventDefault();
    const body = { email, username, password };
    fetch('api/register', {
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
          // dispatch({ type: 'LOGIN', payload: data.username });
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
        placeholder="username"
        onChange={(e) => updateUsername(e.target.value)}
      ></input>
      <input
        type="password"
        placeholder="password"
        onChange={(e) => updatePassword(e.target.value)}
      ></input>
      <button onClick={handleClick}>Submit</button>
      <a href="/auth/google">Google</a>
      <Link to={'/'}>
        <button>Sign-in Here</button>
      </Link>
    </>
  );
};

// export default Login;
export default withRouter(Register);
