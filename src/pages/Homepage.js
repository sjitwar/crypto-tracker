import React from 'react'
import './Homepage.css';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import Coin from "../components/Coin.js";

const Homepage = () => {

    const [listOfCoins, setListOfCoins] = useState([]);

    const fetchingCoins = async () => {
      const { data } = await Axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false")
      setListOfCoins(data); 
    };
  
    console.log(listOfCoins); 
  
    useEffect(() => {
      fetchingCoins();
    }, []);

  return (

    <div className="App">
        <div className='heading'>
        <h1>CT</h1>
        </div>    
    
    
        {/* <div className='displayCryptoH'> {listOfCoins.map((coin) => {
            return (<Coin 
            name = {coin.name} 
            symbol = {coin.symbol} 
            current_price = {coin.current_price}
            img = {coin.image}
            />
        );
        })}
        </div>   */}

        <div className='bottom-section' style={{ backgroundColor: '', display: 'flex', flexDirection: 'row', alignItems: 'left', marginLeft:'50px' }}>
            <div className='trending'> 
            <h2>Top 5 Coins</h2>
            {listOfCoins.map((coin) => {
                return (
                    <h3> {<img style={{ width: '25px', height: '25px', marginRight: '5%'}} src={coin.image} alt="Coin img"></img>} 
                    {coin.name} ${coin.current_price}</h3>
                );
                })}    
            </div>

            <div className='trending'> 
            <h2>Popular 🔥</h2>
            {listOfCoins.map((coin) => {
                return (
                    <h3> {<img style={{ width: '25px', height: '25px', marginRight: '5%'}} src={coin.image} alt="Coin img"></img>} 
                    {coin.name} ${coin.current_price}</h3>
                );
                })}    
            </div>

            <div className='trending'> 
            <h2>Top Gainers 📈</h2>
            {listOfCoins.map((coin) => {
                return (
                    <h3> {<img style={{ width: '25px', height: '25px', marginRight: '5%'}} src={coin.image} alt="Coin img"></img>} 
                    {coin.name} ${coin.current_price}</h3>
                );
                })}    
            </div>    

        </div>



    </div>

  )
}

export default Homepage
