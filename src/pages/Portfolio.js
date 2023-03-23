import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

const MyPortfolio = () => {
  const [coins, setCoins] = useState([]);
  const [myCoins, setMyCoins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1,
          sparkline: false,
        },
      });
      setCoins(result.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleAddCoin = (coin) => {
    if (!myCoins.find((c) => c.id === coin.id)) {
      setMyCoins([...myCoins, coin]);
    }
  };

  const handleRemoveCoin = (coin) => {
    setMyCoins(myCoins.filter((c) => c.id !== coin.id));
  };

  const getCoinValue = (coin) => {
    const coinData = coins.find((c) => c.id === coin.id);
    return coinData.current_price * coin.amount;
  };

  const getTotalValue = () => {
    return myCoins.reduce((total, coin) => total + getCoinValue(coin), 0);
  };

  return (
    <div>
      <h1>My Portfolio</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Add Coins</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Current Price</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {coins.map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.name}</td>
                  <td>{coin.symbol.toUpperCase()}</td>
                  <td>${coin.current_price.toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleAddCoin(coin)}>Add</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <h2>My Coins</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Current Price</th>
                <th>Amount</th>
                <th>Total Value</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {myCoins.map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.name}</td>
                  <td>{coin.symbol.toUpperCase()}</td>
                  <td>${coins.find((c) => c.id === coin.id).current_price.toFixed(2)}</td>
                  <td>{coin.amount}</td>
                  <td>${getCoinValue(coin).toFixed(2)}</td>
                  <td>
                    <button onClick={() => handleRemoveCoin(coin)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p>Total Value: ${getTotalValue().toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

export default MyPortfolio

