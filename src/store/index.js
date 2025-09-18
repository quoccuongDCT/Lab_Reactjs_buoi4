
import { configureStore } from '@reduxjs/toolkit';
import seatsReducer from '../features/seatsSlice';
import bookingReducer from '../features/bookingSlice';

export const store = configureStore({
    reducer: {
        seats: seatsReducer,
        booking: bookingReducer,
    },
});

export default store;
