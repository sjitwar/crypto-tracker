import './App.css';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import Coin from "./components/Coin";
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import CryptoPage from "./pages/cryptocurrencies";
import Header from "./components/Header";
import Homepage from './pages/Homepage';

function App() {

  return ( 

    

    <BrowserRouter>
    <div>
      {/* <Header /> */}
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/cryptocurrencies" element={<CryptoPage />}></Route>
      </Routes>
      
    </div>
    
    </BrowserRouter>

  );
}


export default App;
