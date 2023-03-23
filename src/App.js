import './App.css';
import React from 'react';
import {BrowserRouter, Route, Routes } from 'react-router-dom';
import CryptoPage from "./pages/Cryptocurrencies";
import PortfolioPage from "./pages/Portfolio";
import Header from "./components/Header";
import Homepage from './pages/Homepage';
import ExchangePage from "./pages/Exchanges";
import CryptoDetailPage from './pages/CryptoDetailPage';
import SigninPage from './pages/Signin';

function App() {

  return ( 

    <BrowserRouter>
    <div>
      <Header />

      <Routes>
        <Route path="/" element={<Homepage />}></Route>
        <Route path="/cryptocurrencies" element={<CryptoPage />}></Route>
        <Route path="/crypto/:id" element={<CryptoDetailPage />}></Route> 
        <Route path="/exchanges" element={<ExchangePage />}></Route>
        <Route path="/portfolio" element={<PortfolioPage />}></Route>
        <Route path="/signin" element={<SigninPage />}></Route>

      </Routes>
      
    </div>
    
    </BrowserRouter>

  );
}


export default App;
