import { createSlice } from '@reduxjs/toolkit'

const initialStateValue = "";

export const loginInfoSlice = createSlice({
  name: 'loginInfo',
  //need to modify later 
  initialState: {
    //value: initialStateValue,
    value: initialStateValue
  },
  //initialState,
  reducers: {
    getLoginInfo: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { getLoginInfo } = loginInfoSlice.actions

export default loginInfoSlice.reducer