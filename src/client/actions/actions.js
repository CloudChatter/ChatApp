import * as types from './actionTypes';

export const addMessage = (messageObject) => ({
  type: types.ADD_MESSAGE,
  payload: messageObject,
});

export const getMessages = (latestMessages) => ({
  type: types.GET_MESSAGES,
  payload: latestMessages,
})

export const newUser = (newUsername) => ({
  type: types.NEW_USER,
  payload: latestMessages,
})
export const userLeft = (socketID) => ({
  type: types.USER_LEFT,
  payload: socketID,
})
// export const buildUserData = (userData) => ({
//   type: types.BUILD_USER_DATA,
//   payload: userData,
// })

// export const editMessage = (text) => ({
//   type: types.EDIT_MESSAGE,
//   payload: text,
// })

// export const setNewLocation = () => ({
//   type: types.DELETE_MESSAGE,
// })

// export a new action creator, which returns a delete card object
export const login = (username) => ({
  type: types.LOGIN,
  payload: username,
});

export const logout = (username) => ({
  type: types.LOGOUT,
  payload: username,
});

// export const newCloud = () => ({
// How will the cloud work?
// How we will parse through the data to change the state?
// })
