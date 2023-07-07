import { React, useContext, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import { NavLink } from 'react-router-dom';
import { Divider } from '@mui/material';
import { LoginContext } from '../../Context/ContextProvider';
import "./Hamburger.css"
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import pic from "./logo.png"


const Hamburger = ({ close, Logclose }) => {
  const { account, setAccount } = useContext(LoginContext);
  const [dropen, setdropen] = useState("");
  const navigate = useNavigate("");

  const logoutuser = async () => {

    const res2 = await fetch("/logout", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        withCredentials: true
      },
      credentials: "include"
    });
    const data2 = await res2.json();
    console.log(data2);

    if (res2.status !== 201) {
      console.log("error");
    } else {
      toast.success("user logout", {
        position: "top-center",
      })
      console.log("data valid");

      //alert("logout") 
      navigate('/');
      //window.location.href="./";
      setAccount(false);

      // alert("logout");
    }
  };

  return (
    <>
      <div className='hamburger1'>
        <img src={pic}></img>

        {
          account ? <Avatar className="avtar1">{account.fname[0].toUpperCase()}</Avatar> :
            <Avatar className="avtar1" />
        }


        {account ? <h2>Helloo, {account.fname.toUpperCase()}</h2> : ""}


        <div className='navbtn' onClick={() => close()}>
          <NavLink to="/" >Home</NavLink>
          <NavLink to="/category">Shop By Category</NavLink>
          <Divider style={{ width: "100%", marginLeft: "-20px" }} />
          <NavLink to="/viewAll">Today's Deal</NavLink>
          {
            account ? <NavLink to="/buynow">Cart Items</NavLink> : <NavLink to="/signin">Your orders</NavLink>
          }
          <Divider style={{ width: "100%", marginLeft: "-20px" }} />
          <NavLink to="/contact">Contact Us</NavLink>
          {
            account ? <div className='logout'>
              <LogoutIcon style={{ fontSize: 18, marginRight: 4 }} />
              <h3 style={{ cursor: "pointer", fontWeight: 500 }} onClick={logoutuser}>Logout</h3>
            </div> :
              <NavLink to="/signin">SignIn</NavLink>
          }


        </div>
      </div>
    </>
  )
}

export default Hamburger
