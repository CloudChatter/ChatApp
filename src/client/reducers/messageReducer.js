import * as types from '../actions/actionTypes';

const initialState = {
  messageCount: 0,
  usersOnline: 0,
  messages: [],
  lastMessageID: 0,
};

const messageReducer = (state = initialState, action) => {
  let messages;
  let messageCount;
  let usersOnline;

  switch (action.type) {
    case types.ADD_MESSAGE: {
      const newMessage = {
        messageID: state.lastMessageID += 1,
        text: action.payload,
        // userID: will this also be in the payload?
      };

      messages = state.messages.slice(); // make a shallow copy
      messages.push(newMessage);
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

    case types.ADD_USER: {
      usersOnline = state.usersOnline;
      usersOnline += 1;

      return {
        ...initialState,
        usersOnline,
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
