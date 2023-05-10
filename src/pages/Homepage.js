import React from 'react'
import './Homepage.css';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import Coin from "../components/Coin.js";
import { useNavigate } from 'react-router-dom';


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

const Homepage = () => {

    const navigate = useNavigate();


    const [listOfCoins, setListOfCoins] = useState([]);
    const [trendingCoins, setTrendingCoins] = useState([]);

    const [marketCap, setMarketCap] = useState('');
    const [volume, setVolume] = useState('');
    const [volumeChange, setVolumeChange] = useState(0);
    const [watchlist, setWatchlist] = useState([]);


 

    const fetchingCoins = async () => {
      const { data } = await Axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false")
      setListOfCoins(data); 
    };
    const fetchingTrendingCoins = async () => {
        const { data } = await Axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=gecko_desc&per_page=5&page=1&sparkline=false&price_change_percentage=24h")
        setTrendingCoins(data); 
      };

      useEffect(() => {
        async function fetchData() {
          const response = await Axios.get(
            'https://api.coingecko.com/api/v3/global'
          );
          setMarketCap(response.data.data.total_market_cap.usd.toLocaleString());
          setVolume(response.data.data.total_volume.usd.toLocaleString());
          setVolumeChange(response.data.data.market_cap_change_percentage_24h.toFixed(2));
        }
        fetchData();
      }, []);
  
    console.log(listOfCoins); 
  
    useEffect(() => {
      fetchingCoins();
      fetchingTrendingCoins();
    }, []);

    const handleCryptoClick = (id) => {
        navigate(`/crypto/${id}`);
      };

      const handleDeleteFromWatchlist = (id) => {
        const updatedWatchlist = watchlist.filter((crypto) => crypto.id !== id);
        setWatchlist(updatedWatchlist);
        localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));
      };


      useEffect(() => {
        const savedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
        setWatchlist(savedWatchlist);
      }, []);

  return (

    <div className="App">
        <div className='heading'>
        <h1>CryptoTracker</h1>
        </div>  



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
            <h2>Trending 🔥</h2>
            {trendingCoins.map((coin) => {
                return (
                    <h3> {<img style={{ width: '25px', height: '25px', marginRight: '5%'}} src={coin.image} alt="Coin img"></img>} 
                    {coin.name} ${coin.current_price}</h3>
                );
                })}    
            </div>

            <div className='trending'> 
            <h2>Top Market Cap 📈</h2>
            {listOfCoins.map((coin) => {
                return (
                    <h3> {<img style={{ width: '25px', height: '25px', marginRight: '5%'}} src={coin.image} alt="Coin img"></img>} 
                    {coin.name} ${coin.current_price}</h3>
                );
                })}    
            </div>    

        </div>



<div className="market-data" style={{ backgroundColor: '', display: 'flex', flexDirection: 'row', alignItems: 'left' }}>
      <h2>Total Crypto Market Cap: ${marketCap}</h2>
      <h2>24 Hour Volume: ${volume}</h2>
      <h2>24 Hour Volume Change: {volumeChange.toFixed(2)}%</h2>
    </div>

    <div>
      <h2>My Watchlist</h2>
      <table>
        <thead>
          <tr >
            <th>Name</th>
            <th>Symbol</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((crypto) => (
            <tr key={crypto.id} onClick={() => handleCryptoClick(crypto.id)}>
              <td>{crypto.name}</td>
              <td>{crypto.symbol}</td>
              <td>
                <button onClick={() => handleDeleteFromWatchlist(crypto.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


    </div>

    

  )
}

export default Homepage
