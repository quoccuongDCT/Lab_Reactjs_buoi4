import './App.css'
import MovieSeatBooking from './components/bookingTick';
import { Provider } from 'react-redux';
import store from './store';
function App() {
  return (
    <>
      <Provider store={store}>
         <MovieSeatBooking />
       </Provider>
     
    </>
  )
}

export default App
