import React from 'react'
import './Homepage.css';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import Coin from "/Users/jitwarsingh/Documents/University/Year3/CryptoWebapp/crypto-tracker/src/components/Coin.js";

const Homepage = () => {

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



      
      <div className='displayCrypto'> {listOfCoins.map((coin) => {
        return (<Coin 
        name = {coin.name} 
        symbol = {coin.symbol} 
        current_price = {coin.current_price}
        />
      );
      })}
      </div>  

    </div>

  )
}

export default Homepage
