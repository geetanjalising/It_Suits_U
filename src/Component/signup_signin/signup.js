import React,{useState} from 'react'
 import {NavLink} from 'react-router-dom'
 import {ToastContainer, toast} from 'react-toastify';
 import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const [userdata,setuserdata]=useState({
    fname:"",
    email:"",
    mobile:"",
    password:"",
    cpassword:""
  });
  
  const adddata=(e)=>{
    const {name,value} = e.target;
    setuserdata(()=>{
      return {
        ...userdata,
        [name]:value
      }
    })
  };
  const handleSubmit=async(e)=>{
  e.preventDefault();
  const { fname, email, mobile, password, cpassword } = userdata;
  
      const res = await fetch("/register", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              withCredentials: true
          },
          body: JSON.stringify({
              fname, email, mobile, password, cpassword
          })
      });

      const data = await res.json();
      // console.log(data);  
       if(res.status===422||!data)
       {toast.warn("invalid details", {
        position: "top-center",
      })
       }
       else{
      // alert("data successfully added")
       toast.success("data successfully added", {
        position: "top-center",
       })
       setuserdata({...adddata,fname:"",email:"",mobile:"",password:"",cpassword:""});
       }
    };

  return (
    <>
      <section>
        <div className='sign_container'>
       
          <div className='sign_form'>
            <form method='POST'>
              <h1>Create Account</h1>
             
              <div className='form_data'>
                <label htmlFor='fname'>Your Name: &nbsp;</label>
                <input type="text" 
                 onChange={adddata}
                 value={userdata.fname}
                name="fname" id="fname"/>
              </div>
              <div className='form_data'>
                <label htmlFor='email'>Email:&nbsp;</label>
                <input type="text" 
                 onChange={adddata}
               value={userdata.email}
                name="email" id="email"/>
              </div>
              <div className='form_data'>
                <label htmlFor='number'>Mobile:&nbsp;</label>
                <input type="text" 
                 onChange={adddata}
                 value={userdata.mobile}
                name="mobile" id="mobile"/>
              </div>
             
              <div className='form_data'>
                <label htmlFor="password">Password:&nbsp;</label>
                <input type="password" 
                 onChange={adddata}
                 value={userdata.password}
                name="password" placeholder='At least 6 char' id="password"/>
              </div>
              
              <div className='form_data'>
                <label htmlFor="cpassword">Confirm Password:&nbsp;</label>
                <input type="password" 
                 onChange={adddata}
                 value={userdata.cpassword}
                name="cpassword" id="cpassword"/>
              </div>
              <button className='signin_btn' 
               onClick={handleSubmit}
              >Register</button>
              <div className='signin_info'>
                <p>Already have an account?<NavLink to="/signin" style={{textDecoration:"none"}}>Signin</NavLink></p>
                
              </div>
            </form>
          </div>
          <ToastContainer/>
        </div>
      </section>
   </>

  )
}

export default Signup