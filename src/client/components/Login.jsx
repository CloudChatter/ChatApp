import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { withRouter } from 'react-router-dom';

const Login = ({ history }) => {
  const [username, updateUsername] = useState('');
  const dispatch = useDispatch()

  function handleClick(e) {
    e.preventDefault();
    dispatch({ type: 'LOGIN', payload: username});
    history.push('/chat');
  }
  
  return (
    <>
      <h1>Cloud Chatter</h1>
      <input type='text' placeholder='username' onChange={(e) => updateUsername(e.target.value)} ></input>
      <button onClick={handleClick}>Submit</button>
    </>
  )
}

// export default Login;
export default withRouter(Login);