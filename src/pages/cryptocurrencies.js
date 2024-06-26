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

function CryptoTable() {
  const [cryptos, setCryptos] = useState([]);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
      .then((response) => {
        setCryptos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredCryptos = cryptos.filter((crypto) =>
    crypto.name.toLowerCase().includes(search.toLowerCase()) || crypto.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const sortedCryptos = filteredCryptos.sort((a, b) => {
    const sortFactor = sortOrder === 'asc' ? 1 : -1;
    switch (sortBy) {
      case 'price':
        return sortFactor * (a.current_price - b.current_price);
      case 'marketCap':
        return sortFactor * (a.market_cap - b.market_cap);
      default:
        return 0;
    }
  });

  const handleCryptoClick = (id) => {
    navigate(`/crypto/${id}`);
  };

  return (
    <div className='page' style={{ backgroundColor: '', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className='title'>Cryptocurrencies</div>
      <SearchBar setSearch={setSearch} />
      <table style={{ maxWidth: '800px' }}>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>
              <button onClick={() => handleSort('price')}>
                Price {sortBy === 'price' && sortOrder === 'asc' && <span>(asc)</span>}
                {sortBy === 'price' && sortOrder === 'desc' && <span>(dsc)</span>}
              </button>
            </th>
            <th>
              <button onClick={() => handleSort('marketCap')}>
                Market Cap {sortBy === 'marketCap' && sortOrder === 'asc' && <span>(asc)</span>}
                {sortBy === 'marketCap' && sortOrder === 'desc' && <span>(dsc)</span>}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedCryptos.map((crypto) => (
            <tr key={crypto.id} onClick={() => handleCryptoClick(crypto.id)}>
              <td><img style={{ width: '50px', height: '50px'}} src={crypto.image} alt="Coin img"></img></td>
              <td>{crypto.name} </td>
              <td>{crypto.symbol.toUpperCase()}</td>
              <td>${crypto.current_price.toFixed(2)}</td>
              <td>${crypto.market_cap.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CryptoTable;










// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import "./cryptocurrencies.css"
// import { useNavigate } from 'react-router-dom';

// function SearchBar(props) {
//   const handleSearch = (event) => {
//     props.setSearch(event.target.value);
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Search..."
//         onChange={handleSearch}
//         style={{
//           padding: '10px',
//           borderRadius: '5px',
//         //   border: 'none',
//           boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
//           width: '800px',
//           maxWidth: '100%',
//           margin: '10px'
//         }}
//       />    
//       </div>
//   );
// }

// function CryptoTable() {
//   const [cryptos, setCryptos] = useState([]);
//   const [search, setSearch] = useState('');

//   const navigate = useNavigate();


//   useEffect(() => {
//     axios
//       .get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
//       .then((response) => {
//         setCryptos(response.data);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }, []);

//   const filteredCryptos = cryptos.filter((crypto) =>
//     crypto.name.toLowerCase().includes(search.toLowerCase()) || crypto.symbol.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleCryptoClick = (id) => {
//     navigate(`/crypto/${id}`);
//   };

//   return (
 
//     <div className='page' style={{ backgroundColor: '', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//         <div className='title'>Top 100 Coins</div>
//       <SearchBar setSearch={setSearch} />
//       <table style={{ maxWidth: '800px' }}>
//         <thead>
//           <tr>
//             <th>Image</th>
//             <th>Name</th>
//             <th>Symbol</th>
//             <th>Price</th>
//             <th>Market Cap</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredCryptos.map((crypto) => (
//             <tr key={crypto.id} onClick={() => handleCryptoClick(crypto.id)}>
//               <td><img style={{ width: '50px', height: '50px'}} src={crypto.image} alt="Coin img"></img></td>
//               <td>{crypto.name} </td>
//               <td>{crypto.symbol.toUpperCase()}</td>
//               <td>${crypto.current_price.toFixed(2)}</td>
//               <td>${crypto.market_cap.toLocaleString()}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default CryptoTable;



// import React from 'react'
// import Coin from "../components/CoinTable";
// import Axios from 'axios';
// import { useEffect, useState } from 'react';

// const Cryptocurrencies = () => {
//     const [listOfCoins, setListOfCoins] = useState([]);

//     const fetchingCoins = async () => {
//       const { data } = await Axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false")
//       setListOfCoins(data);
//     };
  
//     console.log(listOfCoins); 
  
//     useEffect(() => {
//       fetchingCoins();
//     }, []);

//   return (
                               
//     <div className="App">
//     <br></br>
//     <br></br>
//     <br></br>
//       <div className='displayCrypto'> {listOfCoins.map((coin) => {
//         return (<Coin 
//         name = {coin.name} 
//         symbol = {coin.symbol} 
//         current_price = {coin.current_price}
//         />
//       );
//       })} 
//       </div>  
      
//     </div>

//   )
// }

// export default Cryptocurrencies
