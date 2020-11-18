import * as types from '../actions/actionTypes';

const initialState = {
  messageCount: 0,
  usersOnline: 0,
  messages: [],
  lastMessageID: 0,


  currUser: '',
};

const messageReducer = (state = initialState, action) => {
  let messages;
  let messageCount;
  let usersOnline;
  let currUser;

  switch (action.type) {
    case types.ADD_MESSAGE: {
      messages = state.messages.slice(); // make a shallow copy
      messages.push(action.payload);
      messageCount = messages.length;

      return {
        ...initialState,
        messageCount,
        messages,
      };
    }
    // case types.EDIT_MESSAGE: {

    // }

    // case types.DELETE_MESSAGE: {

    // }

    case types.CURR_USER: {
      usersOnline = state.usersOnline;
      usersOnline += 1;
      currUser = action.payload
      return {
        ...initialState,
        currUser,
        usersOnline
      };
    }

    case types.ADD_USER: {
      usersOnline = state.usersOnline;
      usersOnline += 1;
      return {
        ...initialState,
        usersOnline
      };
    }

    case types.DELETE_USER: {
      usersOnline = state.usersOnline;
      usersOnline -= 1;

      return {
        ...initialState,
        usersOnline,
      };
    }

    default: return state;
  }
};

export default messageReducer;
