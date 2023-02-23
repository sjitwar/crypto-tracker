import React from 'react'
import './Homepage.css';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import Coin from "../components/Coin.js";

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

    <br></br>
    <h1>CT</h1>
    <br></br>
    
      <div className='displayCryptoH'> {listOfCoins.map((coin) => {
        return (<Coin 
        name = {coin.name} 
        symbol = {coin.symbol} 
        current_price = {coin.current_price}
        img = {coin.image}
        />
      );
      })}
      </div>  

    </div>

  )
}

export default Homepage
