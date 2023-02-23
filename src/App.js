import './App.css';
import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import CryptoPage from "./pages/Cryptocurrencies";
import PortfolioPage from "./pages/Portfolio";
import Header from "./components/Header";
import Homepage from './pages/Homepage';
import ExchangePage from "./pages/Exchanges";

function App() {

  return ( 

    <BrowserRouter>
    <div>
      <Header />
      <br></br>
      <br></br>
      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/cryptocurrencies" element={<CryptoPage />}></Route>
        <Route path="/exchanges" element={<ExchangePage />}></Route>
        <Route path="/portfolio" element={<PortfolioPage />}></Route>
      </Routes>
      
    </div>
    
    </BrowserRouter>

  );
}


export default App;
