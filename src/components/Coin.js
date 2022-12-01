import React from "react";
import "./Coin.css";

function Coin({name, symbol, current_price}) {
    return (
        <div className="coin"> 
            <h2> Name: {name} </h2>
            <h3> Symbol: {symbol}</h3>
            <h4> Price: ${current_price}</h4>
        </div>
    )
}

export default Coin