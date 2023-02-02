import './App.css';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import Coin from "./components/Coin";
import {BrowserRouter as Router} from 'react-router-dom';

function App() {

  const [listOfCoins, setListOfCoins] = useState([]);

  const fetchingCoins = async () => {
    const { data } = await Axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
    setListOfCoins(data); 
  };

  console.log(listOfCoins); 

  useEffect(() => {
    fetchingCoins();
  }, []);

  return ( 
    <div className="App">
      <header className="App-header">
       <div className='top-section'>
         
          <div className="w3-top">
            
            <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-red" href="javascript:void(0);" onclick="myFunction()" title="Toggle Navigation Menu"><i class="fa fa-bars"></i></a>
            <a href="#" class="w3-bar-item w3-button w3-padding-large w3-white">Home</a>
            <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Cryptocurrencies</a>
            <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Exchanges</a>
            <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Portfolio Tracker</a>
            <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">News</a>
            <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Account</a>
            <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">SignUp</a>
              
          </div>
          <br></br>
          <h1>Crypto Tracker</h1>
      
      </div> 
        <br></br>
      
      <div className='displayCrypto'> {listOfCoins.map((coin) => {
        return (<Coin 
        name = {coin.name} 
        symbol = {coin.symbol} 
        current_price = {coin.current_price}
        />
      );
      })}
      </div>  

      </header>
    </div>
  );
}


export default App;
