import React, { useState, useEffect } from "react";
import axios from "axios";

const CryptoPortfolio = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState([]);
  // const [selectedCoin, setSelectedCoin] = useState('');
  const [currency, setCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [combinedPortfolio, setCombinedPortfolio] = useState([]);
  const [showCombined, setShowCombined] = useState(false);

  const [historicalPrice, setHistoricalPrice] = useState("");
  const [totalAmountSpent, setTotalAmountSpent] = useState("");

  const [currentPrices, setCurrentPrices] = useState({});
  const [portfolioValue, setPortfolioValue] = useState("");
  const [pnl, setPnl] = useState("");
  const [combinedPnl, setCombinedPnl] = useState("");

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then(response => {
        // Filter the top 100 coins by market cap
        const topCoins = response.data.filter(coin => coin.market_cap_rank <= 100);

        // Get the IDs of the top 100 coins
        const coinIds = topCoins.map(coin => coin.id);

        // Get the price data for the top 100 coins
        axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`)
          .then(response => {
            // Map the price data to the coins array
            const updatedCoins = topCoins.map(coin => ({
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol,
              // price: response.data[coin.id].usd,
              image: coin.image
            }));

            setCoins(updatedCoins);
            setIsLoading(false);
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const fetchCurrentPrices = async () => {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${portfolio
          .map((item) => item.currency)
          .join(",")}&vs_currencies=usd`
      );
      setCurrentPrices(response.data);
    };
    fetchCurrentPrices();
  }, [portfolio]);

  useEffect(() => {
    let value = 0;
    portfolio.forEach((item) => {
      value += item.amount * currentPrices[item.currency]?.usd;
    });
    setPortfolioValue(value.toFixed(2));
  }, [currentPrices, portfolio]);

  useEffect(() => {
    let value = 0;
    portfolio.forEach((item) => {
      value += item.amount * currentPrices[item.currency]?.usd;
      value -= item.totalAmountSpent;
    });
    setPnl(value.toFixed(2));
  }, [currentPrices, portfolio]);

  useEffect(() => {
    let value = 0;
    combinedPortfolio.forEach((item) => {
      value += item.amount * currentPrices[item.currency]?.usd;
      value -= item.totalAmountSpent;
    });
    setCombinedPnl(value.toFixed(2));
  }, [currentPrices, combinedPortfolio]);
 

  useEffect(() => {
    const fetchHistoricalPrice = async () => {
      if (currency && date) {
        const [year, month, day] = date.split("-");
        const formattedDate = `${day}-${month}-${year}`;
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${currency}/history?date=${formattedDate}`
        );
        setHistoricalPrice(response.data.market_data.current_price.usd);
      }
    };
    fetchHistoricalPrice();
  }, [currency, date]);

  useEffect(() => {
    if (amount && historicalPrice) {
      setTotalAmountSpent((amount * historicalPrice).toFixed(2));
    }
  }, [amount, historicalPrice]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleAddPortfolio = (e) => {
    e.preventDefault();
    setPortfolio([...portfolio, { currency, amount, date, totalAmountSpent }]);
    setCurrency("");
    setAmount("");
    setDate("");
    setTotalAmountSpent("");
  };

  const handleCombine = () => {
    if (showCombined) {
      setCombinedPortfolio([]);
      setShowCombined(false);
    } else {
      const combined = portfolio.reduce((acc, item) => {
        if (acc[item.currency]) {
          acc[item.currency].amount += parseFloat(item.amount);
          acc[item.currency].totalAmountSpent =
            parseFloat(acc[item.currency].totalAmountSpent) +
            parseFloat(item.totalAmountSpent);
        } else {
          acc[item.currency] = {
            currency: item.currency,
            amount: parseFloat(item.amount),
            totalAmountSpent: parseFloat(item.totalAmountSpent),
          };
        }
        return acc;
      }, {});
      setCombinedPortfolio(Object.values(combined));
      setShowCombined(true);
    }
  };

  const handleDelete = (index) => {
    const newPortfolio = [...portfolio];
    newPortfolio.splice(index, 1);
    setPortfolio(newPortfolio);
  };



  return (
    <div>
      <h1>Crypto Portfolio</h1>
      <form onSubmit={handleAddPortfolio}>
        <label>
          Currency:
          <select value={currency} onChange={handleCurrencyChange}>
        <option value="">Select a coin...</option>
        {coins.map(coin => (
        <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
        ))}
        </select>
        </label>
        <label>
          Amount:
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
        <label>
          Date:
          <input type="date" value={date} onChange={handleDateChange} />
        </label>
        <button type="submit">Add to portfolio</button>
        <button type="button" onClick={handleCombine}>
          {showCombined ? "Show individual records" : "Combine same currency"}
        </button>
      </form>
      {showCombined ? (
    <div>
      <h2>Combined Portfolio</h2>
      <table>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Amount</th>
            <th>Total Amount Spent</th>
            <th>Current Price (USD)</th>
        <th>Current Value (USD)</th>
        <th>Profit/Loss (USD)</th>
          </tr>
        </thead>
        <tbody>
          {combinedPortfolio.map((item) => (
            <tr key={item.currency}>
              <td>{item.currency.toUpperCase()}</td>
              <td>{item.amount.toFixed(8)}</td>
              <td>${item.totalAmountSpent}</td>

              <td>
            {currentPrices[item.currency] &&
              currentPrices[item.currency].usd.toFixed(2)}
          </td>
          <td>
            {currentPrices[item.currency] &&
              (currentPrices[item.currency].usd * item.amount).toFixed(2)}
          </td>
          <td>
            {currentPrices[item.currency] &&
              (currentPrices[item.currency].usd * item.amount -
                item.totalAmountSpent).toFixed(2)}
          </td>
          <td>
                <button onClick={handleDelete}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <div>
  <h2>Portfolio</h2>
  <table>
    <thead>
      <tr>
        <th>Currency</th>
        <th>Amount</th>
        <th>Date of Purchase</th>
        <th>Total Amount Spent (USD)</th>
        <th>Current Price (USD)</th>
        <th>Current Value (USD)</th>
        <th>Profit/Loss (USD)</th>
      </tr>
    </thead>
    <tbody>
      {portfolio.map((item, index) => (
        <tr key={index}>
          <td>{item.currency.toUpperCase()}</td>
          <td>{item.amount}</td>
          <td>{item.date}</td>
          <td>{item.totalAmountSpent}</td>
          <td>
            {currentPrices[item.currency] &&
              currentPrices[item.currency].usd.toFixed(2)}
          </td>
          <td>
            {currentPrices[item.currency] &&
              (currentPrices[item.currency].usd * item.amount).toFixed(2)}
          </td>
          <td>
            {currentPrices[item.currency] &&
              (currentPrices[item.currency].usd * item.amount -
                item.totalAmountSpent).toFixed(2)}
          </td>
                  <td>
                  <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan="3">Portfolio Value:</td>
        <td>{totalAmountSpent}</td>
        <td colSpan="2">{portfolioValue}</td>
        <td>{pnl}</td>

      </tr>
    </tfoot>
  </table>
    </div>
  )}
</div>
);
};

export default CryptoPortfolio;



           



// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CryptoPortfolio = () => {
//   const [currency, setCurrency] = useState("");
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState("");
//   const [portfolio, setPortfolio] = useState([]);

//   const [historicalPrice, setHistoricalPrice] = useState("");
//   const [totalAmountSpent, setTotalAmountSpent] = useState("");

//   const [selectedEntry, setSelectedEntry] = useState(null);

//   useEffect(() => {
//     const fetchHistoricalPrice = async () => {
//       if (currency && date) {
//         const [year, month, day] = date.split("-");
//         const formattedDate = `${day}-${month}-${year}`;
//         const response = await axios.get(
//           `https://api.coingecko.com/api/v3/coins/${currency}/history?date=${formattedDate}`
//         );
//         setHistoricalPrice(response.data.market_data.current_price.usd);
//       }
//     };
//     fetchHistoricalPrice();
//   }, [currency, date]);

//   useEffect(() => {
//     if (amount && historicalPrice) {
//       setTotalAmountSpent((amount * historicalPrice).toFixed(2));
//     }
//   }, [amount, historicalPrice]);

//   const handleCurrencyChange = (e) => {
//     setCurrency(e.target.value);
//   };

//   const handleAmountChange = (e) => {
//     setAmount(e.target.value);
//   };

//   const handleDateChange = (e) => {
//     setDate(e.target.value);
//   };

//   const handleAddPortfolio = (e) => {
//     e.preventDefault();

//     // Check if currency already exists in the portfolio
//     const existingItemIndex = portfolio.findIndex(
//       (item) => item.currency === currency
//     );

//     if (existingItemIndex === -1) {
//       // If currency does not exist in the portfolio, add a new entry
//       setPortfolio([
//         ...portfolio,
//         { currency, amount, date, totalAmountSpent },
//       ]);
//     } else {
//       // If currency already exists in the portfolio, update the quantity
//       const updatedPortfolio = [...portfolio];
//       updatedPortfolio[existingItemIndex].amount =
//         Number(updatedPortfolio[existingItemIndex].amount) + Number(amount);
//       updatedPortfolio[existingItemIndex].totalAmountSpent =
//         (
//           Number(updatedPortfolio[existingItemIndex].totalAmountSpent) +
//           Number(totalAmountSpent)
//         ).toFixed(2);
//       setPortfolio(updatedPortfolio);
//     }

//     setCurrency("");
//     setAmount("");
//     setDate("");
//     setTotalAmountSpent("");
//   };

//   const handleEntryClick = (index) => {
//     setSelectedEntry(portfolio[index]);
//   };

//   const renderTableRows = () => {
//     return portfolio.map((entry, index) => (
//       <tr key={index} onClick={() => handleEntryClick(index)}>
//         <td>{entry.currency.toUpperCase()}</td>
//         <td>{entry.amount}</td>
//         <td>{entry.date}</td>
//         <td>${entry.totalAmountSpent}</td>
//       </tr>
//     ));
//   };

//   return (
//     <div>
//       <h1>Crypto Portfolio</h1>
//       <form onSubmit={handleAddPortfolio}>
//         <label>
//           Currency:
//           <select value={currency} onChange={handleCurrencyChange}>
//             <option value="">Select a cryptocurrency</option>
//             <option          value="bitcoin">Bitcoin</option>
//         <option value="ethereum">Ethereum</option>
//         <option value="cardano">Cardano</option>
//         <option value="dogecoin">Dogecoin</option>
//       </select>
//     </label>
//     <label>
//       Amount:
//       <input type="number" value={amount} onChange={handleAmountChange} />
//     </label>
//     <label>
//       Date:
//       <input type="date" value={date} onChange={handleDateChange} />
//     </label>
//     <button type="submit">Add to Portfolio</button>
//   </form>
//   <table>
//     <thead>
//       <tr>
//         <th>Currency</th>
//         <th>Amount</th>
//         <th>Date</th>
//         <th>Total Amount Spent</th>
//       </tr>
//     </thead>
//     <tbody>{renderTableRows()}</tbody>
//   </table>
//   {selectedEntry && (
//     <div>
//       <h2>Selected Entry</h2>
//       <p>Currency: {selectedEntry.currency.toUpperCase()}</p>
//       <p>Amount: {selectedEntry.amount}</p>
//       <p>Date: {selectedEntry.date}</p>
//       <p>Total Amount Spent: ${selectedEntry.totalAmountSpent}</p>
//     </div>
//   )}
// </div>
// );
// };

// export default CryptoPortfolio;

            




// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CryptoPortfolio = () => {
//   const [currency, setCurrency] = useState("");
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState("");
//   const [portfolio, setPortfolio] = useState([]);

//   const [historicalPrice, setHistoricalPrice] = useState("");
//   const [totalAmountSpent, setTotalAmountSpent] = useState("");

//   useEffect(() => {
//     const fetchHistoricalPrice = async () => {
//       if (currency && date) {
//         const [year, month, day] = date.split("-");
//         const formattedDate = `${day}-${month}-${year}`;
//         const response = await axios.get(
//           `https://api.coingecko.com/api/v3/coins/${currency}/history?date=${formattedDate}`
//         );
//         setHistoricalPrice(response.data.market_data.current_price.usd);
//       }
//     };
//     fetchHistoricalPrice();
//   }, [currency, date]);

//   useEffect(() => {
//     if (amount && historicalPrice) {
//       setTotalAmountSpent((amount * historicalPrice).toFixed(2));
//     }
//   }, [amount, historicalPrice]);

//   const handleCurrencyChange = (e) => {
//     setCurrency(e.target.value);
//   };

//   const handleAmountChange = (e) => {
//     setAmount(e.target.value);
//   };

//   const handleDateChange = (e) => {
//     setDate(e.target.value);
//   };

//   const handleAddPortfolio = (e) => {
//     e.preventDefault();

//     // Check if currency already exists in the portfolio
//     const existingItemIndex = portfolio.findIndex(
//       (item) => item.currency === currency
//     );

//     if (existingItemIndex === -1) {
//       // If currency does not exist in the portfolio, add a new entry
//       setPortfolio([
//         ...portfolio,
//         { currency, amount, date, totalAmountSpent },
//       ]);
//     } else {
//       // If currency already exists in the portfolio, update the quantity
//       const updatedPortfolio = [...portfolio];
//       updatedPortfolio[existingItemIndex].amount =
//         Number(updatedPortfolio[existingItemIndex].amount) + Number(amount);
//       updatedPortfolio[existingItemIndex].totalAmountSpent =
//         (
//           Number(updatedPortfolio[existingItemIndex].totalAmountSpent) +
//           Number(totalAmountSpent)
//         ).toFixed(2);
//       setPortfolio(updatedPortfolio);
//     }

//     setCurrency("");
//     setAmount("");
//     setDate("");
//     setTotalAmountSpent("");
//   };


//   return (
//     <div>
//       <h1>Crypto Portfolio</h1>
//       <form onSubmit={handleAddPortfolio}>
//         <label>
//           Currency:
//           <select value={currency} onChange={handleCurrencyChange}>
//             <option value="">Select a cryptocurrency</option>
//             <option value="bitcoin">Bitcoin (BTC)</option>
//             <option value="ethereum">Ethereum (ETH)</option>
//             <option value="dogecoin">Dogecoin (DOGE)</option>
//           </select>
//         </label>
//         <label>
//           Amount:
//           <input type="number" value={amount} onChange={handleAmountChange} />
//         </label>
//         <label>
//           Date:
//           <input type="date" value={date} onChange={handleDateChange} />
//         </label>
//         <button type="submit">Add to portfolio</button>
//       </form>
//       <table>
//         <thead>
//           <tr>
//             <th>Currency</th>
//             <th>Amount</th>
//             <th>Date</th>
//             <th>Total amount spent</th>
//           </tr>
//         </thead>
//         <tbody>
//           {portfolio.map((item, index) => (
//             <tr key={index}>
//               <td>{item.currency}</td>
//               <td>{item.amount}</td>
//               <td>{item.date}</td>
//               <td>{item.totalAmountSpent}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CryptoPortfolio;





// import React, { useState, useEffect } from 'react';

// const API_KEY = 'G8RRXCWNHPH1YDK9E71B2FUMJMIRXVRFMK';
// const API_URL_BALANCE = `https://api.bscscan.com/api?module=account&action=balance&address=`;
// const API_URL_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`;
// const API_URL_TXLIST = `https://api.bscscan.com/api?module=account&action=txlist&sort=asc&apikey=${API_KEY}`;

// function App() {
//   const [address, setAddress] = useState('');
//   const [balance, setBalance] = useState(0);
//   const [coinValue, setCoinValue] = useState(0);
//   const [priceChangePercent, setPriceChangePercent] = useState(0);
//   const [txList, setTxList] = useState([]);

//   useEffect(() => {
//     if (address !== '') {
//       fetch(`${API_URL_BALANCE}${address}&apikey=${API_KEY}`)
//         .then(response => response.json())
//         .then(data => {
//           setBalance(data.result);
//           fetch(API_URL_TICKER)
//             .then(response => response.json())
//             .then(data => {
//               setCoinValue(data.price);
//             });
//           fetch(`${API_URL_TXLIST}&address=${address}&startblock=0&endblock=99999999`)
//             .then(response => response.json())
//             .then(data => {
//               setTxList(data.result);
//             });
//         });
//     }
//   }, [address]);

//   useEffect(() => {
//     fetch(API_URL_TICKER)
//       .then(response => response.json())
//       .then(data => {
//         setPriceChangePercent(data.priceChangePercent);
//       });
//   }, []);

//   const handleInputChange = event => {
//     setAddress(event.target.value);
//   };

//   return (
//     <div>
//       <h1>Binance Smart Chain Wallet Information</h1>
//       <form>
//         <label>
//           Enter your wallet address:
//           <input type="text" value={address} onChange={handleInputChange} />
//         </label>
//       </form>
//       {balance !== 0 && (
//         <div>
//           <p>Your wallet balance is: {balance / 10 ** 18} BNB</p>
//           <p>Your total balance in USD is: {((balance / 10 ** 18) * coinValue).toFixed(2)} USD</p>
//           <p>24h change: {priceChangePercent}%</p>
//           <table>
//             <thead>
//               <tr>
//                 <th>Transaction Hash</th>
//                 <th>From</th>
//                 <th>To</th>
//                 <th>Value (BNB)</th>
//                 <th>Value (USD)</th>
//                 <th>Time</th>
//               </tr>
//             </thead>
//             <tbody>
//               {txList.map((tx, index) => (
//                 <tr key={index}>
//                   <td>{tx.hash}</td>
//                   <td>{tx.from}</td>
//                   <td>{tx.to}</td>
//                   <td>{tx.value / 10 ** 18}</td>
//                   <td>{((tx.value / 10 ** 18) * coinValue).toFixed(2)}</td>
//                   <td>{new Date(tx.timeStamp * 1000).toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function App() {
//   const [coins, setCoins] = useState([]);
//   const [selectedCoin, setSelectedCoin] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [portfolio, setPortfolio] = useState([]);
//   const [timerID, setTimerID] = useState(null);

//   useEffect(() => {
//     axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
//       .then(response => {
//         setCoins(response.data);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }, []);

//   useEffect(() => {
//     if (timerID) {
//       clearInterval(timerID);
//     }
//     const newTimerID = setInterval(() => {
//       updatePortfolioPrices();
//     }, 3600000); // update prices every 10 seconds
//     setTimerID(newTimerID);
//     return () => {
//       clearInterval(newTimerID);
//     };
//   }, [portfolio]);

//   const updatePortfolioPrices = () => {
//     const symbols = portfolio.map(coin => coin.symbol);
//     axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join()}&vs_currencies=usd`)
//       .then(response => {
//         const updatedPortfolio = portfolio.map(coin => {
//           const price = response.data[coin.symbol].usd;
//           return {
//             ...coin,
//             value: price * coin.quantity
//           };
//         });
//         setPortfolio(updatedPortfolio);
//       })
//       .catch(error => {
//         console.log(error);
//       });
//   }

//   const handleCoinSelect = event => {
//     setSelectedCoin(event.target.value);
//   }

//   const handleQuantityChange = event => {
//     setQuantity(event.target.value);
//   }

//   const handleAddToPortfolio = event => {
//     event.preventDefault();
//     const selectedCoinData = coins.find(coin => coin.symbol === selectedCoin);
//     const value = selectedCoinData.current_price * quantity;
//     const existingCoin = portfolio.find(coin => coin.symbol === selectedCoin);
//     if (existingCoin) {
//       const updatedCoin = {
//         ...existingCoin,
//         quantity: Number(existingCoin.quantity) + Number(quantity),
//         value: existingCoin.value + value
//       };
//       const portfolioWithoutExistingCoin = portfolio.filter(coin => coin.symbol !== selectedCoin);
//       setPortfolio([...portfolioWithoutExistingCoin, updatedCoin]);
//     } else {
//       const newCoin = {
//         name: selectedCoinData.name,
//         symbol: selectedCoinData.symbol,
//         quantity: quantity,
//         value: value
//       };
//       setPortfolio([...portfolio, newCoin]);
//     }
//     setSelectedCoin('');
//     setQuantity('');
//   }

//   const portfolioTotal = portfolio.reduce((total, coin) => total + coin.value, 0);

//   return (
//     <div>
//       <h1>Crypto Portfolio</h1>
//       <form onSubmit={handleAddToPortfolio}>
//         <label>
//           Select a coin:
//           <select value={selectedCoin} onChange={handleCoinSelect}>
//             <option value="">--Please select a coin--</option>
//             {coins.map(coin => (
//               <option key={coin.symbol} value={coin.symbol}>
//                 {coin.name} ({coin.symbol.toUpperCase()})
//               </option>
//             ))}
//           </select>
//         </label>
//         <label>
//           Quantity:
//           <input type="number" value={quantity} onChange={handleQuantityChange} />
//         </label>
//         <button type="submit">Add to portfolio</button>
//   </form>
//   <h2>Portfolio</h2>
//   <table>
//     <thead>
//       <tr>
//         <th>Coin</th>
//         <th>Quantity</th>
//         <th>Value</th>
//       </tr>
//     </thead>
//     <tbody>
//       {portfolio.map(coin => (
//         <tr key={coin.symbol}>
//           <td>{coin.name} ({coin.symbol.toUpperCase()})</td>
//           <td>{coin.quantity}</td>
//           <td>{coin.value.toFixed(2)}</td>
//         </tr>
//       ))}
//     </tbody>
//     <tfoot>
//       <tr>
//         <td colSpan="2">Total:</td>
//         <td>{portfolioTotal.toFixed(2)}</td>
//       </tr>
//     </tfoot>
//   </table>
// </div>
// );
// }

// export default App;