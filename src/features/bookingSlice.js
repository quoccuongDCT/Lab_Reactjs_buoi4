import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { markSeatsBooked } from './seatsSlice';

export const confirmBookingAsync = createAsyncThunk(
    'booking/confirmAsync',
    async ({ name, seats, total }, { dispatch }) => {
        await new Promise(r => setTimeout(r, 500));
        dispatch(markSeatsBooked(seats));
        return {
            id: Date.now(),
            name,
            seats,
            count: seats.length,
            total,
            time: new Date().toLocaleString()
        };
    }
);


const bookingSlice = createSlice({
    name: 'booking',
    initialState: {
        name: '',
        selected: [],
        bookings: [],
        status: 'idle',
        error: null
    },
    reducers: {
        setName(state, action) { state.name = action.payload; },
        selectSeat(state, action) {
            const seat = action.payload;
            const exists = state.selected.find(s => s.soGhe === seat.soGhe);
            if (!exists) state.selected.push(seat);
        },
        deselectSeat(state, action) {
            const soGhe = action.payload;
            state.selected = state.selected.filter(s => s.soGhe !== soGhe);
        },
        clearSelected(state) { state.selected = []; },
        addBooking(state, action) { state.bookings.unshift(action.payload); },
        clearBookings(state) { state.bookings = []; }
    },
    extraReducers: builder => {
        builder
            .addCase(confirmBookingAsync.pending, state => { state.status = 'loading'; })
            .addCase(confirmBookingAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookings.unshift(action.payload);
                state.selected = [];
            })
            .addCase(confirmBookingAsync.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    }
});


export const { setName, selectSeat, deselectSeat, clearSelected, addBooking, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;