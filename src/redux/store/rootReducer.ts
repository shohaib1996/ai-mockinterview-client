import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '../feature/auth/authSlice';
import { baseApi } from '../api/baseApi';
const rootReducer = combineReducers({
  auth: authReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export default rootReducer;