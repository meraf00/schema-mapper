'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import entityReducer from './entity/slice';

const rootReducer = combineReducers({
  entity: entityReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
