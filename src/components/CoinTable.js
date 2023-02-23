import React from "react";
import "./CoinTable.css";

function CoinTable({name, symbol, current_price}) {
    return (
        <div className="coinT"> 
            <br></br>
            <br></br>
            <h2> {name} </h2>
            {/* <h3> {symbol}</h3>
            <h4> ${current_price}</h4> */}
        </div>
    )
}



export default CoinTable