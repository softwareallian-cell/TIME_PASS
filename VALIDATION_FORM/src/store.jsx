import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice'; // Ensure the path is correct

export const store = configureStore({
    reducer: {
        registration: formReducer,
    },
});