import React,{useState} from 'react'
import {useHistory} from 'react-router-dom'

import './file1.css'
import './file.js'

const Signup = (props) => {
     const[credential,setcredential]=useState({name:"" ,email:"",password:"",cpassword:""});
    let history=useHistory();
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const {name,email,password}=credential;
        const response =await fetch("http://localhost:5000/api/auth/createUser",{
          
            method:'POST',
            headers:{
                'Content-Type':'application/json',  
            },
            body: JSON.stringify({name,email,password})
            
        });
     const json = await response.json();
     console.log(json);
     if(json.success){
        //Save the authtoken and redirect
      localStorage.setItem('token',json.authtoken);
      history.push("/");
      props.showAlert("Account Created Successfully","success");
    }else{
      //danger here is a type ,see different type of alert from bootstrap.
      props.showAlert("Invalid Credentials",'danger');
    }
  }
const onChange=(e)=>{
        setcredential({...credential,[e.target.name]:e.target.value})
}
  return (
     <body className="container01">
    <div className="container0">
    <h1>Create a Account</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-control0">
          <input type="text" id="name" aria-describedby="emailHelp" name='name' onChange={onChange} required />
           <label><span>Name</span></label>
      </div>
      <div className="form-control0">
          <input type="email" id="email" aria-describedby="emailHelp" name='email' onChange={onChange} required />
           <label><span>Email</span></label>
      </div>
      <div className="form-control0">
          <input type="password" id="password"   name='password' onChange={onChange} minLength={5} required />
           <label><span>Password</span></label>
      </div>
      <div className="form-control0">
          <input  type="password"  id="confirmpassword"  name='confirmpassword' onChange={onChange} minLength={5} required />
           <label><span>Confirm Password</span></label>
      </div>
      <button className="btn0" type='submit'>Submit</button>
    </form>
  </div>
  </body>
  )
}

export default Signup
