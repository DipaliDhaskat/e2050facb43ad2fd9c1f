import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ParkingSpace from './components/ParkingSpace';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ParkingSpace" element={<ParkingSpace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
