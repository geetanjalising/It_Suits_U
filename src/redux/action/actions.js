export const getproducts=()=>async(dispatch)=>{
    try{
        const data = await fetch("/getallproducts",{
       // const data = await fetch("/getproducts",{ //using proxy,which helps to communicate frontened and backened
       method:"GET",
            headers:{
                "Content-Type":"application/json",
                withCredentials: true
            }
        });
        
        const res = await data.json();
       // console.log(res);
        dispatch({type:"SUCCESS_GET_PRODUCTS",payload:res})
    } catch (error) {
        dispatch({type:"FAIL_GET_PRODUCTS",payload:error.response})
    }
}

