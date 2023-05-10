import React, { useState, useEffect } from 'react';
import axios from 'axios';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import "./portfolio.css";


const API_KEY = 'G8RRXCWNHPH1YDK9E71B2FUMJMIRXVRFMK';
const API_URL_BALANCE = `https://api.bscscan.com/api?module=account&action=balance&address=`;
const API_URL_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`;
const API_URL_TXLIST = `https://api.bscscan.com/api?module=account&action=txlist&sort=asc&apikey=${API_KEY}`;

// Initialize Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9Z-ONgh-JpX8r-F0LyQ7vsnYtFCCZ4O0",
  authDomain: "crypto-tracker-b6531.firebaseapp.com",
  projectId: "crypto-tracker-b6531",
  storageBucket: "crypto-tracker-b6531.appspot.com",
  messagingSenderId: "944906192412",
  appId: "1:944906192412:web:d6a63acda47363127b01d9"
};

firebase.initializeApp(firebaseConfig);


function Portfolio() {
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
  const [user, setUser] = useState(null);

  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [coinValue, setCoinValue] = useState(0);
  // const [priceChangePercent, setPriceChangePercent] = useState(0);
  const [txList, setTxList] = useState([]);


  const handleInputChange = event => {
    setAddress(event.target.value);
  };

  // useEffect(() => {
  //   fetch(API_URL_TICKER)
  //     .then(response => response.json())
  //     .then(data => {
  //       setPriceChangePercent(data.priceChangePercent);
  //     });
  // }, []);


  useEffect(() => {
    if (address !== '') {
      fetch(`${API_URL_BALANCE}${address}&apikey=${API_KEY}`)
        .then(response => response.json())
        .then(data => {
          setBalance(data.result);
          console.log(data.result);
          fetch(API_URL_TICKER)
            .then(response => response.json())
            .then(data => {
              setCoinValue(data.price);
            });
          fetch(`${API_URL_TXLIST}&address=${address}&startblock=0&endblock=99999999`)
            .then(response => response.json())
            .then(data => {
              setTxList(data.result);
              console.log(data.result);
            });
        });
    }
  }, [address]);

  // Effect to get the top 100 coins and their current prices from the Coingecko API
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

  // retrieve the user portfolio data from Firebase
  useEffect(() => {
    if (user) {
      const db = firebase.firestore();
      const portfolioRef = db.collection('portfolios').doc(user.uid);

      portfolioRef.get()
        .then(doc => {
          if (doc.exists) {
            setPortfolio(doc.data().portfolio);
          } else {
            console.log('No portfolio data found for user');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
    if (user) {
      const db = firebase.firestore();
      const addressRef = db.collection('addresses').doc(user.uid);

      addressRef.get()
        .then(doc => {
          if (doc.exists) {
            setAddress(doc.data().address);
          } else {
            console.log('No wallet address data found for user');
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [user]);



  // Effect to save the user's portfolio data to Firebase
  useEffect(() => {
    if (user && portfolio.length > 0) {
      const db = firebase.firestore();
      const portfolioRef = db.collection('portfolios').doc(user.uid);
  
      portfolioRef.set({portfolio: portfolio })
      .then(() => {
        console.log('Portfolio data saved successfully');       
      })
      .catch(error => {
        console.error(error);
      });
    }
    if (user) {
      const db = firebase.firestore();
      const addressRef = db.collection('addresses').doc(user.uid);
  
      addressRef.set({address: address })
      .then(() => {
        console.log('address data saved successfully');       
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [user, portfolio, address]);

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
    // const updatedPortfolio = portfolio.filter((coin) => coin.id !== index);
    // setPortfolio(updatedPortfolio);
  };
      
    //   // Function to handle portfolio update
    //   const handlePortfolioUpdate = () => {
    //   const existingCoinIndex = portfolio.findIndex(coin => coin.id === selectedCoin);
    //   if (existingCoinIndex !== -1) {
    //     // If the selected coin already exists in the portfolio, update the quantity
    //     const updatedPortfolio = [...portfolio];
    //     updatedPortfolio[existingCoinIndex].quantity += quantity;
      
    //     setPortfolio(updatedPortfolio);
    //   } else {
    //     // If the selected coin doesn't exist in the portfolio, add it with the selected quantity
    //     const selectedCoinData = coins.find(coin => coin.id === selectedCoin);
    //     const newCoin = {
    //       id: selectedCoin,
    //       name: selectedCoinData.name,
    //       symbol: selectedCoinData.symbol,
    //       price: selectedCoinData.price,
    //       quantity: quantity,
    //       image: selectedCoinData.image
    //     };
      
    //     setPortfolio([...portfolio, newCoin]);
    //   }
      
    //   setSelectedCoin('');
    //   setQuantity(0);
    // };


      // Function to handle user signup
  const handleSignup = (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        setUser(userCredential.user);
      })
      .catch(error => {
        console.error(error);
      });
  };


  // Function to handle user login
  const handleLogin = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        setUser(userCredential.user);
      })
      .catch(error => {
        console.error(error);
      });
  };


// Function to handle user logout
const handleLogout = () => {
  firebase.auth().signOut()
  .then(() => {
  setUser(null);
  setPortfolio([]);
  })
  .catch(error => {
  console.error(error);
  });
  };

// Function to handle user deletion
const handleDeleteUser = () => {
  if (user) {
    const db = firebase.firestore();
    const portfolioRef = db.collection('portfolios').doc(user.uid);

    portfolioRef.delete()
      .then(() => {
        console.log('Portfolio data deleted successfully');
        firebase.auth().currentUser.delete()
          .then(() => {
            console.log('User account deleted successfully');
            handleLogout();
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });
  }
};

  
  return (
  <div style={{marginLeft: '20px', marginRight: '20px'}} className="portfolio">
    {user ? (
    <div>
      <div className='top-right'>
      <button style={{marginRight: '10px'}} onClick={handleLogout}>Logout</button>
      <button style={{color: 'red'}} onClick={() => handleDeleteUser(user.id)}>Delete Account</button>
      </div>

      <h1>Crypto Portfolio Tracker</h1>
      {/* <p>Welcome, {user.displayName}!</p> */}

      <h2>Add Transaction:</h2>
      {isLoading ? (
      <p>Loading coins...</p>
      ) : (
      <div>
      <form onSubmit={handleAddPortfolio}>
        <label>
          
          <select style={{padding:'8px', border:'2px', borderRadius:'4px', borderColor:'solid #ddd', marginBottom:'10px', width:'100%'}} value={currency} onChange={handleCurrencyChange}>
        <option value="">Select a coin...</option>
        {coins.map(coin => (
        <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
        ))}
        </select>
        </label>
        <label style={{marginLeft: '20px'}} >
          Amount:
          <input type="number" value={amount} onChange={handleAmountChange} />
        </label>
        <label style={{marginLeft: '20px'}}>
          Date:
          <input type="date" value={date} onChange={handleDateChange} />
        </label>
        <button  style={{marginLeft: '20px'}} type="submit">Add to portfolio</button>
        <button style={{marginLeft: '20px'}} type="button" onClick={handleCombine}>
          {showCombined ? "Show individual records" : "Combine same currency"}
        </button>
      </form>
      </div>
      )}
      {showCombined ? (
    <div className='custom-port'>
      <div className='custom-text'>
      <h2>My Investments</h2>
      <p>Total Value: ${portfolioValue}</p>
      <p>Profit/Loss: ${pnl}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>Currency</th>
            <th>Amount</th>
            <th>Total Amount Spent</th>
            <th>Current Price (USD)</th>
        <th>Current Value (USD)</th>
        <th>Profit/Loss (USD)</th>
        <th></th>
          </tr>
        </thead>
        <tbody>
          {combinedPortfolio.map((item) => (
            <tr key={item.currency}>
              <td>{item.currency.toUpperCase()}</td>
              <td>{item.amount.toFixed(2)}</td>
              <td>${item.totalAmountSpent}</td>

              <td>
            ${currentPrices[item.currency] &&
              currentPrices[item.currency].usd.toFixed(2)}
          </td>
          <td>
            ${currentPrices[item.currency] &&
              (currentPrices[item.currency].usd * item.amount).toFixed(2)}
          </td>
          <td>
            ${currentPrices[item.currency] &&
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
    <div className='custom-port2'>
  <h2>My Investments</h2>
      <p>Total Value: ${portfolioValue}</p>
      <p>Profit/Loss: ${pnl}</p>
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
        <th></th>
      </tr>
    </thead>
    <tbody>
      {portfolio.map((item, index) => (
        <tr key={index}>
          <td>{item.currency.toUpperCase()}</td>
          <td>{item.amount}</td>
          <td>{item.date}</td>
          <td>${item.totalAmountSpent}</td>
          <td>
            ${currentPrices[item.currency] &&
              currentPrices[item.currency].usd.toFixed(2)}
          </td>
          <td>
            ${currentPrices[item.currency] &&
              (currentPrices[item.currency].usd * item.amount).toFixed(2)}
          </td>
          <td>
            ${currentPrices[item.currency] &&
              (currentPrices[item.currency].usd * item.amount -
                item.totalAmountSpent).toFixed(2)}
          </td>
                  <td>
                  <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
        </tr>
      ))}
    </tbody>
    {/* <tfoot>
      <tr>
        <td colSpan="3">Portfolio Value:</td>
        <td>{totalAmountSpent}</td>
        <td colSpan="2">{portfolioValue}</td>
        <td>{pnl}</td>

      </tr>
    </tfoot> */}
  </table>
    </div>
  )}
      
          <br></br>

          <div className='wallet-info'>
      <h1>Binance Smart Chain Wallet Data</h1>
      <form>
        <label>
          Enter your wallet address:
          <input type="text" value={address} onChange={handleInputChange} />
        </label>
      </form>
      {balance !== 0 && (
        <div>
          <p>Your wallet balance is: {balance / 10 ** 18} BNB</p>
          <p>Your total balance in USD is: {((balance / 10 ** 18) * coinValue).toFixed(2)} USD</p>
          {/* <p>24h change: {priceChangePercent.toFixed(1)}%</p> */}
          <table>
            <thead>
              <tr>
                <th>Transaction Hash</th>
                <th>From</th>
                <th>To</th>
                <th>Value (BNB)</th>
                <th>Value (USD)</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {txList.map((tx, index) => (
                <tr key={index}>
                  <td>{`${tx.hash.slice(0, 10)}...`}</td>
                  <td>{`${tx.from.slice(0, 10)}...`}</td>
                  <td>{`${tx.to.slice(0, 10)}...`}</td>
                  <td>{tx.value / 10 ** 18}</td>
                  <td>{((tx.value / 10 ** 18) * coinValue).toFixed(2)}</td>
                  <td>{new Date(tx.timeStamp * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>

      </div>
      
    ) : (
      <div className='user-form'>
        <div className='log-in'>
        <h1>Login</h1>
          <form onSubmit={event => {
            event.preventDefault();
            handleLogin(event.target.email.value, event.target.password.value);
            }}>
            <label>
              Email:
            <input type="email" name="email" required />
            </label>
            <label>
              Password:
            <input type="password" name="password" required />
            </label>
            <button type="submit">Login</button>
          </form>
        </div>
        <div className='sign-up'> 
        <h1>Signup</h1>
        <form onSubmit={event => {
              event.preventDefault();
              handleSignup(event.target.email.value, event.target.password.value);
            }}>
            <label>
              Email:
            <input type="email" name="email" required />
            </label>
            <label>
              Password:
            <input type="password" name="password" required />
            </label>
            <button type="submit">Signup</button>

          </form>

        </div>
        <p>Login or setup your account to manage your crypto</p>



      </div>
        )}
    </div>
    );
    }
    
    export default Portfolio;


 



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import "./exchanges.css";


// const API_KEY = 'G8RRXCWNHPH1YDK9E71B2FUMJMIRXVRFMK';
// const API_URL_BALANCE = `https://api.bscscan.com/api?module=account&action=balance&address=`;
// const API_URL_TICKER = `https://api.binance.com/api/v3/ticker/price?symbol=BNBUSDT`;
// const API_URL_TXLIST = `https://api.bscscan.com/api?module=account&action=txlist&sort=asc&apikey=${API_KEY}`;

// // Initialize Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB9Z-ONgh-JpX8r-F0LyQ7vsnYtFCCZ4O0",
//   authDomain: "crypto-tracker-b6531.firebaseapp.com",
//   projectId: "crypto-tracker-b6531",
//   storageBucket: "crypto-tracker-b6531.appspot.com",
//   messagingSenderId: "944906192412",
//   appId: "1:944906192412:web:d6a63acda47363127b01d9"
// };

// firebase.initializeApp(firebaseConfig);


// function Portfolio() {
//   const [coins, setCoins] = useState([]);
//   const [selectedCoin, setSelectedCoin] = useState('');
//   const [quantity, setQuantity] = useState(0);
//   const [portfolio, setPortfolio] = useState([]);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const [address, setAddress] = useState('');
//   const [balance, setBalance] = useState(0);
//   const [coinValue, setCoinValue] = useState(0);
//   const [priceChangePercent, setPriceChangePercent] = useState(0);
//   const [txList, setTxList] = useState([]);


//   const handleInputChange = event => {
//     setAddress(event.target.value);
//   };

//   useEffect(() => {
//     fetch(API_URL_TICKER)
//       .then(response => response.json())
//       .then(data => {
//         setPriceChangePercent(data.priceChangePercent);
//       });
//   }, []);


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

//   // Effect to get the top 100 coins and their current prices from the Coingecko API
//   useEffect(() => {
//     axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
//       .then(response => {
//         // Filter the top 100 coins by market cap
//         const topCoins = response.data.filter(coin => coin.market_cap_rank <= 100);

//         // Get the IDs of the top 100 coins
//         const coinIds = topCoins.map(coin => coin.id);

//         // Get the price data for the top 100 coins
//         axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`)
//           .then(response => {
//             // Map the price data to the coins array
//             const updatedCoins = topCoins.map(coin => ({
//               id: coin.id,
//               name: coin.name,
//               symbol: coin.symbol,
//               price: response.data[coin.id].usd,
//               image: coin.image
//             }));

//             setCoins(updatedCoins);
//             setIsLoading(false);
//           })
//           .catch(error => {
//             console.error(error);
//           });
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, []);

//   // Effect to update the current prices of the top 100 coins every hour
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.map(coin => coin.id).join(',')}&vs_currencies=usd`)
//         .then(response => {
//           const updatedCoins = coins.map(coin => ({
//             ...coin,
//             price: response.data[coin.id].usd
//           }));

//           setCoins(updatedCoins);
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }, 3600000); // Update every hour

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [coins]);

//   // Effect to retrieve the user's portfolio data from Firebase
//   useEffect(() => {
//     if (user) {
//       const db = firebase.firestore();
//       const portfolioRef = db.collection('portfolios').doc(user.uid);

//       portfolioRef.get()
//         .then(doc => {
//           if (doc.exists) {
//             setPortfolio(doc.data().portfolio);
//           } else {
//             console.log('No portfolio data found for user');
//           }
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }
//     if (user) {
//       const db = firebase.firestore();
//       const addressRef = db.collection('addresses').doc(user.uid);

//       addressRef.get()
//         .then(doc => {
//           if (doc.exists) {
//             setAddress(doc.data().address);
//           } else {
//             console.log('No wallet address data found for user');
//           }
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }
//   }, [user]);



//   // Effect to save the user's portfolio data to Firebase
//   useEffect(() => {
//     if (user && portfolio.length > 0) {
//       const db = firebase.firestore();
//       const portfolioRef = db.collection('portfolios').doc(user.uid);
  
//       portfolioRef.set({portfolio: portfolio })
//       .then(() => {
//         console.log('Portfolio data saved successfully');       
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     }
//     if (user) {
//       const db = firebase.firestore();
//       const addressRef = db.collection('addresses').doc(user.uid);
  
//       addressRef.set({address: address })
//       .then(() => {
//         console.log('address data saved successfully');       
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     }
//   }, [user, portfolio, address]);

//   // Function to handle coin deletion
// const handleDelete = (id) => {
//   const updatedPortfolio = portfolio.filter((coin) => coin.id !== id);
//   setPortfolio(updatedPortfolio);
// };

  

      
//       // Function to handle coin selection
//       const handleCoinChange = event => {
//       setSelectedCoin(event.target.value);
//       };
      
//       // Function to handle quantity input
//       const handleQuantityChange = event => {
//       setQuantity(parseFloat(event.target.value));
//       };
      
//       // Function to handle portfolio update
//       const handlePortfolioUpdate = () => {
//       const existingCoinIndex = portfolio.findIndex(coin => coin.id === selectedCoin);
//       if (existingCoinIndex !== -1) {
//         // If the selected coin already exists in the portfolio, update the quantity
//         const updatedPortfolio = [...portfolio];
//         updatedPortfolio[existingCoinIndex].quantity += quantity;
      
//         setPortfolio(updatedPortfolio);
//       } else {
//         // If the selected coin doesn't exist in the portfolio, add it with the selected quantity
//         const selectedCoinData = coins.find(coin => coin.id === selectedCoin);
//         const newCoin = {
//           id: selectedCoin,
//           name: selectedCoinData.name,
//           symbol: selectedCoinData.symbol,
//           price: selectedCoinData.price,
//           quantity: quantity,
//           image: selectedCoinData.image
//         };
      
//         setPortfolio([...portfolio, newCoin]);
//       }
      
//       setSelectedCoin('');
//       setQuantity(0);
//     };


//       // Function to handle user signup
//   const handleSignup = (email, password) => {
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         setUser(userCredential.user);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };


//   // Function to handle user login
//   const handleLogin = (email, password) => {
//     firebase.auth().signInWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         setUser(userCredential.user);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };


// // Function to handle user logout
// const handleLogout = () => {
//   firebase.auth().signOut()
//   .then(() => {
//   setUser(null);
//   setPortfolio([]);
//   })
//   .catch(error => {
//   console.error(error);
//   });
//   };

// // Function to handle user deletion
// const handleDeleteUser = () => {
//   if (user) {
//     const db = firebase.firestore();
//     const portfolioRef = db.collection('portfolios').doc(user.uid);

//     portfolioRef.delete()
//       .then(() => {
//         console.log('Portfolio data deleted successfully');
//         firebase.auth().currentUser.delete()
//           .then(() => {
//             console.log('User account deleted successfully');
//           })
//           .catch(error => {
//             console.error(error);
//           });
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }
// };

  
//   return (
//   <div className="portfolio">
//     {user ? (
//     <div>
//       <h1>Crypto Portfolio Tracker</h1>
//       <p>Welcome, {user.displayName}!</p>
//       <button onClick={handleLogout}>Logout</button>
//       <button onClick={() => handleDeleteUser(user.id)}>Delete Account</button>
//       <h2>Select a Coin:</h2>
//       {isLoading ? (
//       <p>Loading coins...</p>
//       ) : (
//       <div>
//         <select value={selectedCoin} onChange={handleCoinChange}>
//         <option value="">Select a coin...</option>
//         {coins.map(coin => (
//         <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
//         ))}
//         </select>
//         <input type="number" value={quantity} onChange={handleQuantityChange} />
//         <button onClick={handlePortfolioUpdate}>Add to Portfolio</button>
//       </div>
//       )}
//       <div className='portfolio-info'> 
//       <h2>Portfolio:</h2>
//       {portfolio.length > 0 ? (
//       <table>
//         <thead>
//           <tr>
//           <th>Name</th>
//           <th>Symbol</th>
//           <th>Price (USD)</th>
//           <th>Quantity</th>
//           <th>Value (USD)</th>
//           </tr>
//         </thead>
//         <tbody>
//         {portfolio.map(coin => (
//         <tr key={coin.id}>
//         <td>{coin.name}</td>
//         <td>{coin.symbol.toUpperCase()}</td>
//         <td>{coin.price.toFixed(2)}</td>
//         <td>{coin.quantity}</td>
//         <td>{(coin.price * coin.quantity).toFixed(2)}</td>
//         <td>{<button onClick={() => handleDelete(coin.id)}>Delete</button>}</td>
//         </tr>
//         ))}
//         <tr>
//         <td colSpan="4">Total
//         </td>
//         <td>{portfolio.reduce((total, coin) => total + (coin.price * coin.quantity), 0).toFixed(2)}</td>
//         </tr>
//         </tbody>
//       </table>
//           ) : (
//             <p>No coins in your portfolio yet.</p>
//           )}

//       </div>
      
//           <br></br>

//           <div className='wallet-info'>
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

//       </div>
      
//     ) : (
//       <div className='user-form'>
//         <div className='log-in'>
//         <h1>Login</h1>
//           <form onSubmit={event => {
//             event.preventDefault();
//             handleLogin(event.target.email.value, event.target.password.value);
//             }}>
//             <label>
//               Email:
//             <input type="email" name="email" required />
//             </label>
//             <label>
//               Password:
//             <input type="password" name="password" required />
//             </label>
//             <button type="submit">Login</button>
//           </form>
//         </div>
//         <div className='sign-up'> 
//         <h1>Signup</h1>
//         <form onSubmit={event => {
//               event.preventDefault();
//               handleSignup(event.target.email.value, event.target.password.value);
//             }}>
//             <label>
//               Email:
//             <input type="email" name="email" required />
//             </label>
//             <label>
//               Password:
//             <input type="password" name="password" required />
//             </label>
//             <button type="submit">Signup</button>
//           </form>
//         </div>

//       </div>
//         )}
//     </div>
//     );
//     }
    
//     export default Portfolio;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
// import "./portfolio.css";

// // import { getFirestore } from '@firebase/firestore';

// // const db = getFirestore(firebaseApp);


// // Initialize Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB9Z-ONgh-JpX8r-F0LyQ7vsnYtFCCZ4O0",
//   authDomain: "crypto-tracker-b6531.firebaseapp.com",
//   projectId: "crypto-tracker-b6531",
//   storageBucket: "crypto-tracker-b6531.appspot.com",
//   messagingSenderId: "944906192412",
//   appId: "1:944906192412:web:d6a63acda47363127b01d9"
// };

// firebase.initializeApp(firebaseConfig);


// function Portfolio() {
//   const [coins, setCoins] = useState([]);
//   const [selectedCoin, setSelectedCoin] = useState('');
//   const [quantity, setQuantity] = useState(0);
//   const [portfolio, setPortfolio] = useState([]);
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Effect to get the top 100 coins and their current prices from the Coingecko API
//   useEffect(() => {
//     axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
//       .then(response => {
//         // Filter the top 100 coins by market cap
//         const topCoins = response.data.filter(coin => coin.market_cap_rank <= 100);

//         // Get the IDs of the top 100 coins
//         const coinIds = topCoins.map(coin => coin.id);

//         // Get the price data for the top 100 coins
//         axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`)
//           .then(response => {
//             // Map the price data to the coins array
//             const updatedCoins = topCoins.map(coin => ({
//               id: coin.id,
//               name: coin.name,
//               symbol: coin.symbol,
//               price: response.data[coin.id].usd,
//               image: coin.image
//             }));

//             setCoins(updatedCoins);
//             setIsLoading(false);
//           })
//           .catch(error => {
//             console.error(error);
//           });
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }, []);

//   // Effect to update the current prices of the top 100 coins every hour
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.map(coin => coin.id).join(',')}&vs_currencies=usd`)
//         .then(response => {
//           const updatedCoins = coins.map(coin => ({
//             ...coin,
//             price: response.data[coin.id].usd
//           }));

//           setCoins(updatedCoins);
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }, 3600000); // Update every hour

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [coins]);

//   // Effect to retrieve the user's portfolio data from Firebase
//   useEffect(() => {
//     if (user) {
//       const db = firebase.firestore();
//       const portfolioRef = db.collection('portfolios').doc(user.uid);

//       portfolioRef.get()
//         .then(doc => {
//           if (doc.exists) {
//             setPortfolio(doc.data().portfolio);
//           } else {
//             console.log('No portfolio data found for user');
//           }
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }
//   }, [user]);



//   // Effect to save the user's portfolio data to Firebase
//   useEffect(() => {
//     if (user && portfolio.length > 0) {
//       const db = firebase.firestore();
//       const portfolioRef = db.collection('portfolios').doc(user.uid);
  
//       portfolioRef.set({portfolio: portfolio })
//       .then(() => {
//         console.log('Portfolio data saved successfully');       
//       })
//       .catch(error => {
//         console.error(error);
//       });
//     }
//   }, [user, portfolio]);

//   // Function to handle coin deletion
// const handleDelete = (id) => {
//   const updatedPortfolio = portfolio.filter((coin) => coin.id !== id);
//   setPortfolio(updatedPortfolio);
// };

  

      
//       // Function to handle coin selection
//       const handleCoinChange = event => {
//       setSelectedCoin(event.target.value);
//       };
      
//       // Function to handle quantity input
//       const handleQuantityChange = event => {
//       setQuantity(parseFloat(event.target.value));
//       };
      
//       // Function to handle portfolio update
//       const handlePortfolioUpdate = () => {
//       const existingCoinIndex = portfolio.findIndex(coin => coin.id === selectedCoin);
//       if (existingCoinIndex !== -1) {
//         // If the selected coin already exists in the portfolio, update the quantity
//         const updatedPortfolio = [...portfolio];
//         updatedPortfolio[existingCoinIndex].quantity += quantity;
      
//         setPortfolio(updatedPortfolio);
//       } else {
//         // If the selected coin doesn't exist in the portfolio, add it with the selected quantity
//         const selectedCoinData = coins.find(coin => coin.id === selectedCoin);
//         const newCoin = {
//           id: selectedCoin,
//           name: selectedCoinData.name,
//           symbol: selectedCoinData.symbol,
//           price: selectedCoinData.price,
//           quantity: quantity,
//           image: selectedCoinData.image
//         };
      
//         setPortfolio([...portfolio, newCoin]);
//       }
      
//       setSelectedCoin('');
//       setQuantity(0);
//     };


//       // Function to handle user signup
//   const handleSignup = (email, password) => {
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         setUser(userCredential.user);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };


//   // Function to handle user login
//   const handleLogin = (email, password) => {
//     firebase.auth().signInWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         setUser(userCredential.user);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };


// // Function to handle user logout
// const handleLogout = () => {
//   firebase.auth().signOut()
//   .then(() => {
//   setUser(null);
//   setPortfolio([]);
//   })
//   .catch(error => {
//   console.error(error);
//   });
//   };

// // Function to handle user deletion
// const handleDeleteUser = () => {
//   if (user) {
//     const db = firebase.firestore();
//     const portfolioRef = db.collection('portfolios').doc(user.uid);

//     portfolioRef.delete()
//       .then(() => {
//         console.log('Portfolio data deleted successfully');
//         firebase.auth().currentUser.delete()
//           .then(() => {
//             console.log('User account deleted successfully');
//           })
//           .catch(error => {
//             console.error(error);
//           });
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }
// };

  
//   return (
//   <div className="portfolio">
//     {user ? (
//     <div>
//       <h1>Crypto Portfolio Tracker</h1>
//       <p>Welcome, {user.displayName}!</p>
//       <button onClick={handleLogout}>Logout</button>
//       <button onClick={() => handleDeleteUser(user.id)}>Delete Account</button>
//       <h2>Select a Coin:</h2>
//       {isLoading ? (
//       <p>Loading coins...</p>
//       ) : (
//       <div>
//         <select value={selectedCoin} onChange={handleCoinChange}>
//         <option value="">Select a coin...</option>
//         {coins.map(coin => (
//         <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
//         ))}
//         </select>
//         <input type="number" value={quantity} onChange={handleQuantityChange} />
//         <button onClick={handlePortfolioUpdate}>Add to Portfolio</button>
//       </div>
//       )}
//       <h2>Portfolio:</h2>
//       {portfolio.length > 0 ? (
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Symbol</th>
//             <th>Price (USD)</th>
//             <th>Quantity</th>
//             <th>Value (USD)</th>
//           </tr>
//         </thead>
//         <tbody>
//           {portfolio.map(coin => (
//           <tr key={coin.id}>
//             <td>{coin.name}</td>
//             <td>{coin.symbol.toUpperCase()}</td>
//             <td>{coin.price.toFixed(2)}</td>
//             <td>{coin.quantity}</td>
//             <td>{(coin.price * coin.quantity).toFixed(2)}</td>
//             <td>{<button onClick={() => handleDelete(coin.id)}>Delete</button>}</td>
//           </tr>
//           ))}
//           <tr>
//             <td colSpan="4">Total
//             </td>
//             <td>{portfolio.reduce((total, coin) => total + (coin.price * coin.quantity), 0).toFixed(2)}</td>
//           </tr>
//         </tbody>
//       </table>
//           ) : (
//             <p>No coins in your portfolio yet.</p>
//           )}
//       </div>
//     ) : (
//       <div className='user-form'>
//         <div className='log-in'>
//         <h1>Login</h1>
//           <form onSubmit={event => {
//             event.preventDefault();
//             handleLogin(event.target.email.value, event.target.password.value);
//             }}>
//             <label>
//               Email:
//             <input type="email" name="email" required />
//             </label>
//             <label>
//               Password:
//             <input type="password" name="password" required />
//             </label>
//             <button type="submit">Login</button>
//           </form>
//         </div>
//         <div className='sign-up'> 
//         <h1>Signup</h1>
//         <form onSubmit={event => {
//               event.preventDefault();
//               handleSignup(event.target.email.value, event.target.password.value);
//             }}>
//             <label>
//               Email:
//             <input type="email" name="email" required />
//             </label>
//             <label>
//               Password:
//             <input type="password" name="password" required />
//             </label>
//             <button type="submit">Signup</button>
//           </form>
//         </div>

//       </div>
//         )}
//     </div>
//     );
//     }
    
//     export default Portfolio;




     // const handlePortfolioUpdate = () => {
      //   // Check if the selected coin is already in the portfolio
      //   const existingCoin = portfolio.find(coin => coin.id === selectedCoin);
      //   const selectedCoinData = coins.find(coin => coin.id === selectedCoin);
      
      //   // If the coin is already in the portfolio, add the quantity to the existing value
      //   if (existingCoin) {
      //     const updatedValue = existingCoin.value + selectedCoinData.current_price * quantity;
      //     const updatedQuantity = existingCoin.quantity + quantity;
      //     const updatedCoin = { ...existingCoin, value: updatedValue, quantity: updatedQuantity };
      
      //     setPortfolio(prevPortfolio =>
      //       prevPortfolio.map(coin => (coin.id === existingCoin.id ? updatedCoin : coin))
      //     );
      //   } else {
      //     // Otherwise, add the new coin to the portfolio
          
      //     const newCoin = {
      //       id: selectedCoin,
      //       name: selectedCoinData.name,
      //       symbol: selectedCoinData.symbol.toUpperCase(),
      //       price: selectedCoinData.current_price,
      //       quantity,
      //       value: selectedCoinData.current_price * quantity
      //     };
      
      //     setPortfolio(prevPortfolio => [...prevPortfolio, newCoin]);
      //   }
      
      //   // Reset the selection and quantity inputs
      //   setSelectedCoin('');
      //   setQuantity(0);
        
      //   // Save the updated portfolio in Firebase
      //   if (user) {
      //     usersRef.child(user.uid).set(portfolio);
      //   }
      // };


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

// // Initialize Firebase with your own configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB9Z-ONgh-JpX8r-F0LyQ7vsnYtFCCZ4O0",
//   authDomain: "crypto-tracker-b6531.firebaseapp.com",
//   projectId: "crypto-tracker-b6531",
//   storageBucket: "crypto-tracker-b6531.appspot.com",
//   messagingSenderId: "944906192412",
//   appId: "1:944906192412:web:d6a63acda47363127b01d9"
// };

// firebase.initializeApp(firebaseConfig);

// function Portfolio() {
//   const [user, setUser] = useState(null);
//   const [coins, setCoins] = useState([]);
//   const [selectedCoin, setSelectedCoin] = useState('');
//   const [quantity, setQuantity] = useState('');
//   const [portfolio, setPortfolio] = useState([]);

//   // Function to handle user login
//   const handleLogin = (email, password) => {
//     firebase.auth().signInWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         setUser(userCredential.user);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };

//   // Function to handle user signup
//   const handleSignup = (email, password) => {
//     firebase.auth().createUserWithEmailAndPassword(email, password)
//       .then(userCredential => {
//         setUser(userCredential.user);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };

//   // Function to handle user logout
//   const handleLogout = () => {
//     firebase.auth().signOut()
//       .then(() => {
//         setUser(null);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };

//   // Function to handle changes to the selected coin
//   const handleCoinChange = event => {
//     setSelectedCoin(event.target.value);
//   };

//   // Function to handle changes to the quantity
//   const handleQuantityChange = event => {
//     setQuantity(event.target.value);
//   };

//   // Function to handle submission of the portfolio form
//   const handlePortfolioSubmit = event => {
//     event.preventDefault();

//     // Find the selected coin in the coins array
//     const coin = coins.find(c => c.id === selectedCoin);

//     // Check if the coin is already in the portfolio
//     const existingCoinIndex = portfolio.findIndex(c => c.id === selectedCoin);

//     if (existingCoinIndex >= 0) {
//       // If the coin is already in the portfolio, update the quantity
//       const updatedPortfolio = [...portfolio];
//       updatedPortfolio[existingCoinIndex] = {
//         ...updatedPortfolio[existingCoinIndex],
//         quantity: Number(updatedPortfolio[existingCoinIndex].quantity) + Number(quantity)
//       };
//       setPortfolio(updatedPortfolio);
//     } else {
//       // If the coin is not in the portfolio, add it
//       setPortfolio([...portfolio, {
//         id: coin.id,
//         name: coin.name,
//         symbol: coin.symbol,
//         price: coin.current_price,
//         quantity: Number(quantity)
//       }]);
//     }

//     // Clear the form inputs
//     setSelectedCoin('');
//     setQuantity('');
//   };

//   // Function to calculate the total value of the portfolio
//   const calculatePortfolioValue = () => {
//     let totalValue = 0;

//     portfolio.forEach(coin => {
//       totalValue += coin.quantity * coin.price;
//     });

//     return totalValue;
//   };

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.map(coin => coin.id).join(',')}&vs_currencies=usd`)
//         .then(response => {
//           const updatedCoins = coins.map(coin => ({
//             ...coin,
//             price: response.data[coin.id].usd
//           }));

//           setCoins(updatedCoins);
//         })
//         .catch(error => {
//           console.error(error);
//         });
//     }, 3600000); // Update every hour

//     return () => {
//       clearInterval(intervalId);
//     };
//   }, [coins]);
  

// useEffect(() => {
//   if (user) {
//   const db = firebase.firestore();
//   const portfolioRef = db.collection('users').doc(user.uid).collection('portfolio');
//   portfolioRef.get()
//   .then(querySnapshot => {
//     const portfolioData = querySnapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     }));
//     setPortfolio(portfolioData);
//   })
//   .catch(error => {
//     console.error(error);
//   });
// }
// }, [user]);

// useEffect(() => {
//   if (user) {
//   const db = firebase.firestore();
//   const portfolioRef = db.collection('users').doc(user.uid).collection('portfolio');
//     // Delete all documents in the collection
//     portfolioRef.get()
//     .then(querySnapshot => {
//       querySnapshot.forEach(doc => {
//         doc.ref.delete();
//       });
//     })
//     .then(() => {
//       // Add new documents to the collection
//       portfolio.forEach(coin => {
//         portfolioRef.doc(coin.id).set({
//           name: coin.name,
//           symbol: coin.symbol,
//           price: coin.price,
//           quantity: coin.quantity
//         });
//       });
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }
// }, [user, portfolio]);

// return (
//   <div>
//     {user ? (
//     <div>
//       <h1>Portfolio ({calculatePortfolioValue()} USD)</h1>
//       <ul>
//       {portfolio.map(coin => (
//       <li key={coin.id}>
//       {coin.name} ({coin.symbol}) - {coin.quantity} @ {coin.price} USD = {coin.quantity * coin.price} USD
//       </li>
//       ))}
//       </ul>
//       <form onSubmit={handlePortfolioSubmit}>
//       <label>
//       Coin:
//       <select value={selectedCoin} onChange={handleCoinChange}>
//       <option value="">Select a coin</option>
//       {coins.map(coin => (
//       <option key={coin.id} value={coin.id}>
//       {coin.name} ({coin.symbol})
//       </option>
//       ))}
//       </select>
//       </label>
//       <label>
//       Quantity:
//       <input type="number" value={quantity} onChange={handleQuantityChange} />
//       </label>
//       <button type="submit">Add to Portfolio</button>
//       </form>
//       <button onClick={handleLogout}>Logout</button>
//     </div>
//     ) : (
//     <div>
//       <h1>Login or Signup</h1>
//       <form onSubmit={event => {
//       event.preventDefault();
//       handleLogin(event.target.email.value, event.target.password.value);
//       }}>
//       <label>
//       Email:
//       <input type="email" name="email" required />
//       </label>
//       <label>
//       Password:
//       <input type="password" name="password" required />
//       </label>
//       <button type="submit">Login</button>
//       </form>
//       <form onSubmit={event => {
//       event.preventDefault();
//       handleSignup(event.target.email.value, event.target.password.value);
//     }}>
//     <label>
//     Email:
//     <input type="email" name="email" required />
//     </label>
//     <label>
//     Password:
//     <input type="password" name="password" required />
//     </label>
//     <button type="submit">Signup</button>
//     </form>
//   </div>
//   )}
// </div>
// );
// }

// export default Portfolio;































// import React, { useState, useEffect } from "react";
// import './portfolio.css';

// const CryptoPortfolio = () => {
//   const [cryptos, setCryptos] = useState([]);
//   const [selectedCrypto, setSelectedCrypto] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [portfolio, setPortfolio] = useState([]);

//   useEffect(() => {
//     // Fetch top 100 cryptos from an API
//     fetch(
//       "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
//     )
//       .then((response) => response.json())
//       .then((data) => setCryptos(data));
//   }, []);

//   const handleAddCrypto = () => {
//     const selected = cryptos.find((crypto) => crypto.id === selectedCrypto);
//     if (selected) {
//       const newCrypto = {
//         ...selected,
//         quantity: parseFloat(quantity),
//       };
//       setPortfolio([...portfolio, newCrypto]);
//     }
//     setSelectedCrypto("");
//     setQuantity("");
//   };

//   const calculatePortfolioValue = () => {
//     let totalValue = 0;
//     portfolio.forEach((crypto) => {
//       totalValue += crypto.current_price * crypto.quantity;
//     });
//     return totalValue;
//   };

//   return (
//     <div>
//     <div className="portfolio">
//       <h1>Add Crypto to Portfolio</h1>
//       <select
//         value={selectedCrypto}
//         onChange={(e) => setSelectedCrypto(e.target.value)}
//       >
//         <option value="">Select a Crypto</option>
//         {cryptos.map((crypto) => (
//           <option key={crypto.id} value={crypto.id}>
//             {crypto.name}
//           </option>
//         ))}
//       </select>
//       <input
//         type="number"
//         value={quantity}
//         onChange={(e) => setQuantity(e.target.value)}
//         placeholder="Quantity"
//       />
//       <button onClick={handleAddCrypto}>Add to Portfolio</button>
//       <div>
//         <h2>Portfolio</h2>
//         <ul>
//           {portfolio.map((crypto) => (
//             <li key={crypto.id}>
//               {crypto.name} ({crypto.symbol}) - {crypto.quantity} @ $
//               {crypto.current_price.toFixed(2)} = $
//               {(crypto.quantity * crypto.current_price).toFixed(2)}
//             </li>
//           ))}
//         </ul>
//         <p>Total Value: ${calculatePortfolioValue().toFixed(2)}</p>
//       </div>
//     </div>

//     </div>

//   );
// };

// export default CryptoPortfolio;








// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import axios from 'axios';

// const Portfolio = () => {
//   const [walletAddress, setWalletAddress] = useState('');
//   const [portfolio, setPortfolio] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const balanceResponse = await axios.get(
//         `https://api.bscscan.com/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=YOUR_API_KEY_HERE`
//       );
//       const balance = balanceResponse.data.result / 10 ** 18;
//       const tokensResponse = await axios.get(
//         `https://api.bscscan.com/api?module=account&action=tokenlist&address=${walletAddress}&apikey=YOUR_API_KEY_HERE`
//       );
//       const tokens = Object.values(tokensResponse.data.result).filter(
//         (token) => token.balance > 0
//       );
//       const tokenPrices = await Promise.all(
//         tokens.map(async (token) => {
//           try {
//             const priceResponse = await axios.get(
//               `https://api.pancakeswap.info/api/v2/tokens/${token.contractAddress}`
//             );
//             if (!priceResponse.data || !priceResponse.data.data) {
//               return null;
//             }
//             const price = priceResponse.data.data.price;
//             if (price === undefined || price === null) {
//               return null;
//             }
//             return { symbol: token.symbol, price };
//           } catch (error) {
//             console.error(
//               `Error fetching price for token ${token.symbol} (${token.contractAddress}): ${error}`
//             );
//             return null;
//           }
//         })
//       );
//       const portfolio = [
//         { symbol: 'BNB', balance, value: balance * tokenPrices[0].price },
//         ...tokens
//           .map((token, index) => {
//             const price = tokenPrices[index]?.price;
//             if (price === undefined || price === null) {
//               return null;
//             }
//             const value = token.balance * price;
//             return { symbol: token.symbol, balance: token.balance, value };
//           })
//           .filter(Boolean),
//       ];
//       setPortfolio(portfolio.filter(Boolean));
//     };
//     if (walletAddress) {
//       fetchData();
//     }
//   }, [walletAddress]);

//   const handleChange = (event) => {
//     setWalletAddress(event.target.value);
//   };

//   return (
//     <Container>
//       <Row>
//         <Col>
//           <h1>Crypto Portfolio</h1>
//           <p>Enter your wallet address:</p>
//           <input type="text" onChange={handleChange} value={walletAddress} />
//         </Col>
//       </Row>
//       <Row>
//         <Col>
//           <h2>Portfolio:</h2>
//           <ul>
//             {portfolio.map((coin) => (
//               <li key={coin.symbol}>
//                 {coin.symbol}: {coin.balance} ({coin.value.toFixed(2)} USD)
//               </li>
//             ))}
//           </ul>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Portfolio;





// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import axios from 'axios';

// const Portfolio = () => {
//   const [walletAddress, setWalletAddress] = useState('');
//   const [portfolio, setPortfolio] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await axios.get(
//         `https://api.bscscan.com/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=YOUR_API_KEY_HERE`
//       );
//       const balance = response.data.result / 10 ** 18;
//       const tokensResponse = await axios.get(
//         `https://api.bscscan.com/api?module=account&action=tokenlist&address=${walletAddress}&apikey=YOUR_API_KEY_HERE`
//       );
//       const tokens = tokensResponse.data.result.filter(
//         (token) => token.balance > 0
//       );
//       const tokenPrices = await Promise.all(
//         tokens.map(async (token) => {
//           try {
//             const priceResponse = await axios.get(
//               `https://api.pancakeswap.info/api/v2/tokens/${token.contractAddress}`
//             );
//             const price = priceResponse.data.data.price;
//             return { symbol: token.symbol, price };
//           } catch (error) {
//             console.error(
//               `Error fetching price for token ${token.symbol} (${token.contractAddress}): ${error}`
//             );
//             return { symbol: token.symbol, price: null };
//           }
//         })
//       );
//       const portfolio = tokens.map((token, index) => {
//         const price = tokenPrices[index].price;
//         const value = price ? token.balance * price : 0;
//         return { symbol: token.symbol, balance: token.balance, value };
//       });
//       setPortfolio(portfolio);
//     };
//     if (walletAddress) {
//       fetchData();
//     }
//   }, [walletAddress]);

//   const handleChange = (event) => {
//     setWalletAddress(event.target.value);
//   };

//   return (
//     <Container>
//       <Row>
//         <Col>
//           <h1>Crypto Portfolio</h1>
//           <p>Enter your wallet address:</p>
//           <input type="text" onChange={handleChange} value={walletAddress} />
//         </Col>
//       </Row>
//       <Row>
//         <Col>
//           <h2>Portfolio:</h2>
//           <ul>
//             {portfolio.map((coin) => (
//               <li key={coin.symbol}>
//                 {coin.symbol}: {coin.balance} ({coin.value.toFixed(2)} USD)
//               </li>
//             ))}
//           </ul>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Portfolio;


// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col } from 'react-bootstrap';
// import axios from 'axios';

// const Portfolio = () => {
//   const [walletAddress, setWalletAddress] = useState('');
//   const [portfolio, setPortfolio] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const response = await axios.get(
//         `https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&address=${walletAddress}&tag=latest&apikey=YOUR_API_KEY_HERE`
//       );
//       const balance = response.data.result;
//       const priceResponse = await axios.get(
//         `https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd`
//       );
//       const price = priceResponse.data.binancecoin.usd;
//       const value = (balance / 10 ** 18) * price;
//       setPortfolio([{ symbol: 'BNB', balance: balance / 10 ** 18, value }]);
//     };
//     if (walletAddress) {
//       fetchData();
//     }
//   }, [walletAddress]);

//   const handleChange = (event) => {
//     setWalletAddress(event.target.value);
//   };

//   return (
//     <Container>
//       <Row>
//         <Col>
//           <h1>Crypto Portfolio</h1>
//           <p>Enter your wallet address:</p>
//           <input type="text" onChange={handleChange} value={walletAddress} />
//         </Col>
//       </Row>
//       <Row>
//         <Col>
//           <h2>Portfolio:</h2>
//           <ul>
//             {portfolio.map((coin) => (
//               <li key={coin.symbol}>
//                 {coin.symbol}: {coin.balance} BNB (${coin.value.toFixed(2)})
//               </li>
//             ))}
//           </ul>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Portfolio;



// import React from 'react';
// import './portfolio.css';

// const searchWallet = () => {
//   console.log("test");
// };


// const MyPortfolio = () => {


//   return (
//     <div className='portfolio-top'>
//       <h1>My Portfolio</h1>
//       <h2>Total Value: </h2>

//       <div className='portfolio-mid'>
//         <label htmlFor='walletAddress'>Wallet Address</label>
//         <input type="string" id="walletAddress"/>
//         <button onClick={searchWallet()}>Submit</button>
//       </div>

//     </div>
//   );
// }

// export default MyPortfolio



// import React, { useState, useEffect } from 'react';
// import { Table } from 'react-bootstrap';
// import axios from 'axios';

// const MyPortfolio = () => {
//   const [coins, setCoins] = useState([]);
//   const [myCoins, setMyCoins] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       const result = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
//         params: {
//           vs_currency: 'usd',
//           order: 'market_cap_desc',
//           per_page: 100,
//           page: 1,
//           sparkline: false,
//         },
//       });
//       setCoins(result.data);
//       setLoading(false);
//     };
//     fetchData();
//   }, []);

//   const handleAddCoin = (coin) => {
//     if (!myCoins.find((c) => c.id === coin.id)) {
//       setMyCoins([...myCoins, coin]);
//     }
//   };

//   const handleRemoveCoin = (coin) => {
//     setMyCoins(myCoins.filter((c) => c.id !== coin.id));
//   };

//   const getCoinValue = (coin) => {
//     const coinData = coins.find((c) => c.id === coin.id);
//     return coinData.current_price * coin.amount;
//   };

//   const getTotalValue = () => {
//     return myCoins.reduce((total, coin) => total + getCoinValue(coin), 0);
//   };

//   return (
//     <div>
//       <h1>My Portfolio</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <h2>Add Coins</h2>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Symbol</th>
//                 <th>Current Price</th>
//                 <th>Add</th>
//               </tr>
//             </thead>
//             <tbody>
//               {coins.map((coin) => (
//                 <tr key={coin.id}>
//                   <td>{coin.name}</td>
//                   <td>{coin.symbol.toUpperCase()}</td>
//                   <td>${coin.current_price.toFixed(2)}</td>
//                   <td>
//                     <button onClick={() => handleAddCoin(coin)}>Add</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <h2>My Coins</h2>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Symbol</th>
//                 <th>Current Price</th>
//                 <th>Amount</th>
//                 <th>Total Value</th>
//                 <th>Remove</th>
//               </tr>
//             </thead>
//             <tbody>
//               {myCoins.map((coin) => (
//                 <tr key={coin.id}>
//                   <td>{coin.name}</td>
//                   <td>{coin.symbol.toUpperCase()}</td>
//                   <td>${coins.find((c) => c.id === coin.id).current_price.toFixed(2)}</td>
//                   <td>{coin.amount}</td>
//                   <td>${getCoinValue(coin).toFixed(2)}</td>
//                   <td>
//                     <button onClick={() => handleRemoveCoin(coin)}>Remove</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           <p>Total Value: ${getTotalValue().toFixed(2)}</p>
//         </>
//       )}
//     </div>
//   );
// }

// export default MyPortfolio

