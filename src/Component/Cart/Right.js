import {React, useState, useEffect} from 'react'
import "./Buynow.css"

const Right = ({item1}) => {
  const [price,setPrice]=useState(0);
  
  useEffect(()=>{
    totalAmount();  
  },[item1])

  const totalAmount =()=>{
    let price=0;
    item1.map((item)=>{
      price+=item.price.cost
    },[]);
    setPrice(price)
  }

  return (
    <div className='right_buy'>
     
      <div className='cost_right'>
        <p>Your order is eligible for FREE Delivery.</p><br/>
        <span style={{color:"#595959"}}>Select this option at checkout. Details
        </span>
        <h3>Subtotal ({item1.length} item):<span style={{fontweight:700}}>{price}.00</span></h3>
        <button className='rightbuy_btn' style={{backgroundColor:"black",color:"white"}}>Process to Buy</button>
        <div className='emi'>emi available</div>
      </div>
    </div>
  )
}

export default Right
