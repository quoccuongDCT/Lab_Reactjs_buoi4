
import { createSlice } from '@reduxjs/toolkit';

import initialSeats from '../data/danhSachGhe.json';

const seatsSlice = createSlice({
  name: 'seats',
  initialState: {
    rows: initialSeats,
  },
  reducers: {
    markSeatsBooked(state, action) {
      const booked = new Set(action.payload);
      state.rows = state.rows.map(row => ({
        ...row,
        danhSachGhe: row.danhSachGhe.map(g =>
          booked.has(g.soGhe) ? { ...g, daDat: true } : g
        )
      }));
    },
    loadSeats(state, action) {
      state.rows = action.payload;
    },
    resetSeats(state) {
      state.rows = initialSeats;
    }
  }
});

export const { markSeatsBooked, loadSeats, resetSeats } = seatsSlice.actions;
export default seatsSlice.reducer;
