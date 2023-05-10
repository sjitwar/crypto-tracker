import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CryptoDetailPage.css';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

import { HistoricalChart } from "../AppContext";
import { Card } from 'antd';
import { fontSize } from '@mui/system';

Chart.register(...registerables);

function CryptoDetailPage(props) {
  const [cryptoData, setCryptoData] = useState(null);
  const [chartData, setChartData] = useState();
  const [numOfCoins, setNumCoins] = useState(0);
  const [amount, setAmount] = useState(0);
  const [news, setNews] = useState([]);


  const [days, setDays] = useState(1);
  

  const {id} = useParams();

  const chartDays = [
    {label: "1 Day", value: 1,}, {label: "1 week", value: 7,}, {label: "1 Month", value: 30,},
    {label: "3 Months", value: 90,}, {label: "1 Year", value: 365,},
  ];

  const fetchChartData = async () => {
    const { data } = await axios.get(HistoricalChart(id, days));

    setChartData(data.prices);
  };

  useEffect(() => {
    fetchChartData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);


  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`)
      .then((response) => {
        setCryptoData(response.data);
        // const sparklineData = response.data.market_data.sparkline_7d.price;
        // const chartLabels = sparklineData.map(value => moment(value[0]).format('LT'));
        // const chartData = {
        //   labels: chartLabels,
        //   datasets: [
        //     {
        //       label: 'Price History',
        //       data: sparklineData,
        //       fill: true,
        //       //borderColor: 'rgb(75, 192, 192)',
        //       tension: 0.1
        //     }
        //   ]
        // };

        axios.get(`https://bing-news-search1.p.rapidapi.com/news/search?q=${encodeURIComponent(response.data.name)}&count=5&freshness=Day&textFormat=Raw&safeSearch=Off`, {
          headers: {
            'X-BingApis-SDK': 'true',
            'X-RapidAPI-Key': 'a9f30dce6fmshb8b06e33407f276p15905fjsn1071364ac8e5',
            'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
          }
        }).then((response) => {
          setNews(response.data.value);
        }).catch((error) => {
          console.log(error);
        });
      

      })
      .catch((error) => {
        console.log(error);
      });
      
  }, [id]);

  const calculateValue = () => {
    if (cryptoData) {
      const { market_data } = cryptoData;
      const value = market_data.current_price.usd * numOfCoins;
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
  };

  const calculateNumCoins = () => {
    if (cryptoData) {
      const { market_data } = cryptoData;
      const value = amount/market_data.current_price.usd;
      return value.toLocaleString();
    }
  };


  const handleAddToWatchlist = (parm) => {
    const selectedCrypto = parm;
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    localStorage.setItem("watchlist", JSON.stringify([...watchlist, selectedCrypto]));
  };


  

  if (!cryptoData || !chartData) {
    console.log("waiting for the data");
    return <div>loading</div>;
  }

  const { name, image, symbol, description, market_data } = cryptoData;

  return (
    <div>
    <div className="crypto-detail">
      <div className='top'>
        <img src={image.large} alt={name} />
        <div className='coin-symbol'>
            <h1> {name}</h1>
            <h2> {symbol.toUpperCase()}</h2>
        </div>

        
        <div className='details'>
            <p>Price: ${market_data.current_price.usd.toFixed(2)}</p>
            <p>Market Cap: ${market_data.market_cap.usd.toLocaleString()}</p>
            <p>Total Volume: ${market_data.total_volume.usd.toLocaleString()}</p>
            <p>24h High: ${market_data.high_24h.usd.toFixed(2)}</p>
            <p>24h Low: ${market_data.low_24h.usd.toFixed(2)}</p>
            <p>24h Change: {market_data.price_change_percentage_24h.toFixed(2)}%</p>

      </div>
      </div> 
      <div style={{marginLeft: '20px'}}>
      <select  value={days} onChange={(event) => setDays(event.target.value)}>
  {chartDays.map((day) => (
    <option key={day.value} value={day.value} selected={day.value === days}>
      {day.label}
    </option>
  ))}
</select>

          <button onClick={() => handleAddToWatchlist(cryptoData)} style={{marginLeft: '20px'}} >
            Add to Watchlist
          </button>


        </div>



      <div className="chart-container">
        {chartData &&             <Line
              data={{
                labels: chartData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),

                datasets: [
                  {
                    data: chartData.map((coin) => coin[1]),
                    label: `Price`,
                    borderColor: "aqua",
                    fill: true
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />}

{/* <div
              style={{
                display: "flex",
                marginTop: 20,
                justifyContent: "space-around",
                width: "100%",
              }}
            >
            </div> */}

        <div className="calculator">

  <Card title={symbol} bordered={true} style={{ width: 300, height: 400 }}>
  <label style={{fontSize: '20px'}} htmlFor="numCoins">Number of coins:</label>
        <input style={{fontSize: '20px'}} type="number" id="numCoins" value={numOfCoins} onChange={(e) => setNumCoins(e.target.value)} />
        <p style={{fontSize: '43px', display: 'flex', marginTop: '50px'}}>{calculateValue()}</p>
  </Card>
  <Card title="Converter" bordered={true} style={{ width: 300, height: 400, marginLeft: 20 }}>
  <label style={{fontSize: '20px'}} htmlFor="amount">Amount in USD:</label>
        <input style={{fontSize: '20px'}} type="number" id="numCoins" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <p style={{fontSize: '43px', display: 'flex', marginTop: '50px'}}>{calculateNumCoins()} {symbol}</p>
  </Card>

        </div>  











      </div>
      <div className='news-description'>
          <p dangerouslySetInnerHTML={{__html: description.en}}></p>

        </div>

        <h2 style={{marginLeft: '20px'}}>Related News:</h2>
        <div className="news" style={{display:'flex' ,float:'left', alignItems: 'left', marginLeft:'20px', marginRight:'20px' }}>
    
    {news.map((article) => (

      <div key={article.url} >
          <Card title={name} bordered={false} style={{ width: 300 }}>
          <a href={article.url} target="_blank" rel="noopener noreferrer">
          <img src={article.image?.thumbnail?.contentUrl} alt={article.name} />
          <h3>{article.name}</h3>
        </a>

         </Card>


      </div>
    ))}
  </div>
        

    </div>
    </div>
  );
}

export default CryptoDetailPage;


// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';

// function CryptoDetailPage() {
//   const [cryptoData, setCryptoData] = useState(null);
//   const { id } = useParams();
//   const chartRef = useRef();
  

//   useEffect(() => {
//     axios
//       .get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=7&interval=daily`)
//       .then((response) => {
//         setCryptoData(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [id]);

//   useEffect(() => {
//     if (cryptoData && chartRef.current) {
//         console.log(cryptoData.prices.map((data) => new Date(data[0]).toLocaleDateString()));
//         const chartData = {
//         labels: cryptoData.prices.map((data) => new Date(data[0]).toLocaleDateString()),
//         datasets: [
//           {
//             label: 'Price',
//             data: cryptoData.prices.map((data) => data[1]),
//             fill: false,
//             borderColor: '#007bff',
//             tension: 0.1,
//           },
//         ],
//       };
//       chartRef.current.data = chartData;
//       chartRef.current.update();
//     }
//   }, [cryptoData]);

//   if (!cryptoData) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="crypto-detail">
//       <h1>{cryptoData.name}</h1>
//       <div>
//         <img src={cryptoData.image} alt={cryptoData.name} />
//         <p>{cryptoData.description}</p>
//       </div>
//       <Line ref={chartRef} />
//     </div>
//   );
// }

// export default CryptoDetailPage;



// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import './CryptoDetailPage.css';
// import Chart from 'chart.js/auto';


// function CryptoDetailPage(props) {
//   const [cryptoData, setCryptoData] = useState(null);

//   const {id} = useParams();
//   useEffect(() => {
//     console.log("the id is " + {id});

//     axios
//       .get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=false`)
//       .then((response) => {
//         setCryptoData(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, [id]);
  

//   if (!cryptoData) {
//     return <div>Loading...</div>;
//   }

//   const { name, image, symbol, market_data } = cryptoData;

//   return (
//     <div className="crypto-detail">
//       <h1>{name}</h1>
//       <img src={image.large} alt={name} />
//       <p>Symbol: {symbol.toUpperCase()}</p>
//       <p>Price: ${market_data.current_price.usd.toFixed(2)}</p>
//       <p>Market Cap: ${market_data.market_cap.usd.toLocaleString()}</p>
//       <p>Total Volume: ${market_data.total_volume.usd.toLocaleString()}</p>
//       <p>24h High: ${market_data.high_24h.usd.toFixed(2)}</p>
//       <p>24h Low: ${market_data.low_24h.usd.toFixed(2)}</p>
//       <p>24h Change: {market_data.price_change_percentage_24h.toFixed(2)}%</p>
//     </div>
//   );
// }

// export default CryptoDetailPage;
