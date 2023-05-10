const firebaseConfig = {
    apiKey: "AIzaSyB9Z-ONgh-JpX8r-F0LyQ7vsnYtFCCZ4O0",
    authDomain: "crypto-tracker-b6531.firebaseapp.com",
    projectId: "crypto-tracker-b6531",
    storageBucket: "crypto-tracker-b6531.appspot.com",
    messagingSenderId: "944906192412",
    appId: "1:944906192412:web:d6a63acda47363127b01d9"
  };

  import React, { useState, useEffect } from "react";
// import axios from "axios";

// const CryptoPortfolio = () => {
//   const [currency, setCurrency] = useState("");
//   const [amount, setAmount] = useState("");
//   const [date, setDate] = useState("");
//   const [portfolio, setPortfolio] = useState([]);
//   const [combinedPortfolio, setCombinedPortfolio] = useState([]);
//   const [showCombined, setShowCombined] = useState(false);

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
//     setPortfolio([...portfolio, { currency, amount, date, totalAmountSpent }]);
//     setCurrency("");
//     setAmount("");
//     setDate("");
//     setTotalAmountSpent("");
//   };

//   const handleCombine = () => {
//     if (showCombined) {
//       setCombinedPortfolio([]);
//       setShowCombined(false);
//     } else {
//       const combined = portfolio.reduce((acc, item) => {
//         if (acc[item.currency]) {
//           acc[item.currency].amount += parseFloat(item.amount);
//           acc[item.currency].totalAmountSpent =
//             parseFloat(acc[item.currency].totalAmountSpent) +
//             parseFloat(item.totalAmountSpent);
//         } else {
//           acc[item.currency] = {
//             currency: item.currency,
//             amount: parseFloat(item.amount),
//             totalAmountSpent: parseFloat(item.totalAmountSpent),
//           };
//         }
//         return acc;
//       }, {});
//       setCombinedPortfolio(Object.values(combined));
//       setShowCombined(true);
//     }
//   };

//   const handleDelete = (index) => {
//     const newPortfolio = [...portfolio];
//     newPortfolio.splice(index, 1);
//     setPortfolio(newPortfolio);
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
//         <button type="button" onClick={handleCombine}>
//           {showCombined ? "Show individual records" : "Combine same currency"}
//         </button>
//       </form>
//       {showCombined ? (
//     <div>
//       <h2>Combined Portfolio</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Currency</th>
//             <th>Amount</th>
//             <th>Total Amount Spent</th>
//           </tr>
//         </thead>
//         <tbody>
//           {combinedPortfolio.map((item) => (
//             <tr key={item.currency}>
//               <td>{item.currency.toUpperCase()}</td>
//               <td>{item.amount.toFixed(8)}</td>
//               <td>${item.totalAmountSpent}</td>
//               <td>
//                 <button onClick={handleDelete}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   ) : (
//     <div>
//       <h2>Individual Portfolio</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Currency</th>
//             <th>Amount</th>
//             <th>Date of Purchase</th>
//             <th>Total Amount Spent</th>
//           </tr>
//         </thead>
//         <tbody>
//           {portfolio.map((item, index) => (
//             <tr key={`${item.currency}-${item.date}`}>
//               <td>{item.currency.toUpperCase()}</td>
//               <td>{item.amount}</td>
//               <td>{item.date}</td>
//               <td>${item.totalAmountSpent}</td>
//               <td>
//                 <button onClick={() => handleDelete(index)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   )}
// </div>
// );
// };

// export default CryptoPortfolio;