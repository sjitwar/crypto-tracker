import './App.css';
import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import CryptoPage from "./pages/cryptocurrencies";
import Header from "./components/Header";
import Homepage from './pages/Homepage';

function App() {

  return ( 

    <BrowserRouter>
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/cryptocurrencies" element={<CryptoPage />}></Route>
      </Routes>
      
    </div>
    
    </BrowserRouter>

  );
}


export default App;
