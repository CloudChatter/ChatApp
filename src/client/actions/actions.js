import * as types from './actionTypes';

export const addMessage = (messageObject) => ({
  type: types.ADD_MESSAGE,
  payload: messageObject,
});

// export const editMessage = (text) => ({
//   type: types.EDIT_MESSAGE,
//   payload: text,
// })

// export const setNewLocation = () => ({
//   type: types.DELETE_MESSAGE,
// })

// export a new action creator, which returns a delete card object
export const addUser = (userID) => ({
  type: types.ADD_USER,
  payload: userID,
});

export const deleteUser = (userID) => ({
  type: types.DELETE_USER,
  payload: userID,
});

// export const newCloud = () => ({
// How will the cloud work?
// How we will parse through the data to change the state?
// })
