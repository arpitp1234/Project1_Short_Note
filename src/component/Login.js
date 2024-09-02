import React,{useState} from 'react'
import { useHistory } from 'react-router-dom';


import './file1.css'
import './file.js'


const Login = (props) => {
    const[credential,setcredential]=useState({email:"",password:""});
    let history=useHistory();
    const handleSubmit= async (e)=>{
        e.preventDefault();
        const response =await fetch("http://localhost:5000/api/auth/login",{
            method:'POST',
            headers:{
                'Content-Type':'application/json',  
            },
            body: JSON.stringify({email:credential.email,password:credential.password})
            
        });
     const json = await response.json();
     console.log(json);
     if(json.success){
          //redirect;
        localStorage.setItem('token',json.authtoken);
        props.showAlert("loggin to your Account Successfully","success");
        history.push("/");
     }else{
        props.showAlert("Invalid Credential","danger")
     }
    }

const onChange=(e)=>{
        setcredential({...credential,[e.target.name]:e.target.value})
}
  return (
    <body className="container01">
    <div className="container0">
    <h1>Please Login</h1>
    <form onSubmit={handleSubmit}>
      <div className="form-control0">
          <input type="email" name="email" value={credential.email} aria-describedby="emailHelp"  onChange={onChange} required />
           <label><span>Email</span></label>
      </div>
      <div className="form-control0">
          <input type="password" name="password"  id="password" value={credential.password}  onChange={onChange} required />
           <label><span>Password</span></label>
      </div>
      <button className="btn0" type='submit'>Login</button>
      <p className="text">Don't have a account ? SignUp above</p>
    </form>
</div>
</body>
  )
}

export default Login
