import { configureStore } from '@reduxjs/toolkit';
import conversationsReducer from './conversationsSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    conversations: conversationsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;