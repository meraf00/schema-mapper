'use client';

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import entityReducer from './entity/slice';
import generationReducer from './codegeneration/slice';

const rootReducer = combineReducers({
  entity: entityReducer,
  generation: generationReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: rootReducer,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
