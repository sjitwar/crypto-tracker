import React from "react";
import "./Coin.css";

function Coin({name, symbol, current_price, img}) {
    return (
        <div className="coin"> 
            <h2> Name: {name} </h2>
            <h3> Symbol: {symbol}</h3>
            <h4> Price: ${current_price}</h4>
            <img style={{ width: '100px', height: '100px'}} src={img} alt="Coin img"></img>
        </div>
    )
}

export default Coin