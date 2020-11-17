
import { combineReducers } from 'redux';
import messageReducer from './messageReducer';

const reducers = combineReducers({
  messages: messageReducer,
});

export default reducers;
