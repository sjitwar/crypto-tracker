import React from 'react';
import { Link } from 'react-router-dom';
import "./Header.css";

function Header() {
  return (
    <div className='header'>
      <Link to="/" style={{ marginLeft: '20px' }}>Home</Link>
      <Link to="/cryptocurrencies" style={{ marginLeft: '20px' }}>Cryptocurrencies</Link>
      <Link to="/exchanges" style={{ marginLeft: '20px' }}>Exchanges</Link>
      <Link to="/portfolio" style={{ marginLeft: '20px' }}>portfolio</Link>
      {/* <Link to="/signin" style={{ marginLeft: '1000px' }}>Sign in</Link> */}
    </div>
  );
}

export default Header;

// import React from 'react'

// const Header = () => {
//   return (
//     <div>
//     <header className="App-header">
//        <div className='top-section'>
         
//           <div className="w3-top">
            
//             <a class="w3-bar-item w3-button w3-hide-medium w3-hide-large w3-right w3-padding-large w3-hover-white w3-large w3-red" href="javascript:void(0);" onclick="myFunction()" title="Toggle Navigation Menu"><i class="fa fa-bars"></i></a>
//             <a href="#" class="w3-bar-item w3-button w3-padding-large w3-white">Home</a>
//             <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Cryptocurrencies</a>
//             <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Exchanges</a>
//             <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Portfolio Tracker</a>
//             <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">News</a>
//             <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">Account</a>
//             <a href="#" class="w3-bar-item w3-button w3-hide-small w3-padding-large w3-hover-white">SignUp</a>
              
//           </div>
//           <br></br>
//           {/* <h1>Crypto Tracker</h1> */}
//           <h1>............</h1>

//       </div> 
//         <br></br>
//     </header>
//     </div>
//   )
// }

// export default Header