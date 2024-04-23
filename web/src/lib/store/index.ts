'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import entityReducer from './entity/slice';

const rootReducer = combineReducers({
  entity: entityReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
