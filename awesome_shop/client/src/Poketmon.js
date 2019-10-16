import React from "react";
import './shop.css'
import './App.js'


function Poketmon({id,poke_types,color,name,type,cost,onClick}) {
    return (
        <div class="pokemon" onClick={() => onClick(id,cost,name)} >
            <div class="img-container">
            <img src={`https://pokeres.bastionbot.org/images/pokemon/${id}.png`} alt={name} />
            </div>
             <div class="info">
                <span class="number">#{id.toString().padStart(3, '0')}</span>
                <h3 class="name">{name}</h3>
                <small class="type">Type: <span>{type}</span></small>
                <h3 class="name" >💰${cost/50} ETH</h3>
            </div>
        </div>
    );
}



export default Poketmon;