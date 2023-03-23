import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CryptoDetailPage.css';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

function CryptoDetailPage(props) {
  const [cryptoData, setCryptoData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [numCoins, setNumCoins] = useState(0);

  const {id} = useParams();
  useEffect(() => {
    axios
      .get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`)
      .then((response) => {
        setCryptoData(response.data);
        const sparklineData = response.data.market_data.sparkline_7d.price;
        const chartLabels = sparklineData.map((_, i) => '');
        const chartData = {
          labels: chartLabels,
          datasets: [
            {
              label: 'Price History',
              data: sparklineData,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }
          ]
        };
        setChartData(chartData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  const calculateValue = () => {
    if (cryptoData) {
      const { market_data } = cryptoData;
      const value = market_data.current_price.usd * numCoins;
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }
  };
  

  if (!cryptoData) {
    return <div>Loading...</div>;
  }

  const { name, image, symbol, market_data } = cryptoData;

  return (
    <div className="crypto-detail">
      <h1>{name}</h1>
      <img src={image.large} alt={name} />
      <p>Symbol: {symbol.toUpperCase()}</p>
      <p>Price: ${market_data.current_price.usd.toFixed(2)}</p>
      <p>Market Cap: ${market_data.market_cap.usd.toLocaleString()}</p>
      <p>Total Volume: ${market_data.total_volume.usd.toLocaleString()}</p>
      <p>24h High: ${market_data.high_24h.usd.toFixed(2)}</p>
      <p>24h Low: ${market_data.low_24h.usd.toFixed(2)}</p>
      <p>24h Change: {market_data.price_change_percentage_24h.toFixed(2)}%</p>
      <div className='chart'>
        {chartData && <Line data={chartData} />}
      </div>
      

      <div className="calculator">
        <label htmlFor="numCoins">Number of coins:</label>
        <input type="number" id="numCoins" value={numCoins} onChange={(e) => setNumCoins(e.target.value)} />
        <p>Value: {calculateValue()}</p>
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
