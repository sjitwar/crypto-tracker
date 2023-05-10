import React, { useState, useEffect } from "react";

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    setWatchlist(savedWatchlist);
  }, []);

  return (
    <div>
      <h2>Watchlist</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
          </tr>
        </thead>
        <tbody>
          {watchlist.map((crypto) => (
            <tr key={crypto.id}>
              <td>{crypto.name}</td>
              <td>{crypto.symbol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Watchlist;
