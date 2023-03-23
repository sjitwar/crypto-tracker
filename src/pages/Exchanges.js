import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./cryptocurrencies.css"
import { useNavigate } from 'react-router-dom';

function SearchBar(props) {
  const handleSearch = (event) => {
    props.setSearch(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        onChange={handleSearch}
        style={{
          padding: '10px',
          borderRadius: '5px',
        //   border: 'none',
          boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
          width: '800px',
          maxWidth: '100%',
          margin: '10px'
        }}
      />    
      </div>
  );
}

function Exchanges() {
  const [cryptos, setCryptos] = useState([]);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();


  useEffect(() => {
    axios
      .get('https://api.coingecko.com/api/v3/exchanges?per_page=100')
      .then((response) => {
        setCryptos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(search.toLowerCase()));

  const handleCryptoClick = (id) => {
    navigate(`/crypto/${id}`);
  };

  return (
    <div style={{ backgroundColor: '', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className='title'>Top 100 Exchanges</div>
      <SearchBar setSearch={setSearch} />
      <table style={{ maxWidth: '800px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>trade_volume_24h_btc</th>
          </tr>
        </thead>
        <tbody>
          {filteredCryptos.map((crypto) => (
            <tr key={crypto.id} onClick={() => handleCryptoClick(crypto.id)}>
              <td>{crypto.name} </td>
              <td>{crypto.trade_volume_24h_btc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Exchanges;

