import { Divider } from "@mui/material"
import "./ItemDesc.css"
import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { LoginContext } from '../../Context/ContextProvider';
import CircularProgress from '@mui/material/CircularProgress';

const Cart = () => {
  const { id } = useParams("");
  //console.log(id);

  const { account, setAccount } = useContext(LoginContext);
  const [idxdata, setidxdata] = useState("");
  const history = useNavigate("");

  const getdata = async () => {
    const res = await fetch(`/getoneproductdata/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        withCredentials: true
      }
    });
    const data = await res.json();
    //console.log(data);

    if (res.status !== 201) {
      console.log("no data available");
    } else {
      console.log("data available");
      setidxdata(data);
    }
  }

  useEffect(() => {
    setTimeout(getdata, 15)
  }, [id]);


  const addtocart = async (id) => {
    console.log(id);
    const checkres = await fetch(`/addcart/${id}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        withCredentials: true

      },
      body: JSON.stringify({
        idxdata
      }),
      credentials: "include"
    });

    const data1 = await checkres.json();
    //  console.log(data1);
    // const a=checkres;
    // console.log(a);
    if (checkres.status === 401 || !data1) {
      console.log("user invalid");
      alert("user invalid");
    }
    else {
      //  alert("data added in your cart");
      history("/buynow")
      setAccount(data1);
    }

  }

  return (
    <div className='cart_section'>
      {idxdata && Object.keys(idxdata).length &&
        <div className='cart_container'>
          <div className='left_cart'>
            <img
              src={idxdata.detailUrl}
              alt="cart_img" />
          </div>

          <div className='right_cart'>
            <h3>{idxdata.title.shortTitle}</h3>
            <h4>{idxdata.title.longTitle}</h4>
            <Divider />
            <p className="mrp">M.R.P. : ₹{idxdata.price.mrp}</p>
            <p>{idxdata.tagline}<span style={{ color: "#B12704" }}> ₹{idxdata.price.cost}</span></p>
            <p>Your Save:<span style={{ color: "#B12704" }}>₹{idxdata.price.mrp - idxdata.price.cost}</span></p>

            <div className="discount_box">
              <h5>Discount : <span style={{ color: "#111" }}>{idxdata.discount}</span> </h5>
              <h4>FREE Delivery : <span style={{ color: "#111", fontWeight: "600" }}>Oct 8 - 21</span> Details</h4>
              <p style={{ color: "#111" }}>Fastest delivery: <span style={{ color: "#111", fontWeight: "600" }}> Tomorrow 11AM</span></p>
            </div>
            <p className="description">About the Iteam : <span style={{ color: "#565959", fontSize: "14px", fontWeight: "500", letterSpacing: "0.4px" }}>{idxdata.description}</span></p>
        <div className='cart_btn0'>
              <button className='cart_btn1' onClick={() => addtocart(idxdata.id)}>Add to Cart</button>
              <button className='cart_btn2'>Buy Now</button>
            </div>  </div>
        </div>
      }
      {!idxdata ? <div className='circle'>
        <CircularProgress />
        <h2>Loading...</h2>
      </div> : ""}
    </div>
  )
};

export default Cart