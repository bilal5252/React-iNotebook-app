import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login(props) {
    const host = "http://localhost:5000"
    const [credential, setCredential] = useState({email: "", password: ""});
    let navigate = useNavigate()

    const onSubmit = async(e)=>{
        e.preventDefault();
        const response = await fetch(`${host}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: credential.email, password:credential.password})
          });
          const json =  await response.json();
          console.log(json)
          if(json.success){
            // redirect save the auth token and redirect
            localStorage.setItem('token', json.authToken);
            navigate("/")
            props.showAlert("Logged in  successfully", "success")
          } else{
            props.showAlert("Invalid credentials", "danger")
          }
    }

    const onChange = (e)=>{
        setCredential({...credential, [e.target.name]: e.target.value})
    }

  return (
    <div>
        <h2>Login to continue to iNotebook</h2>
        <form onSubmit={onSubmit}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" onChange={onChange} value={credential.email}
             id="email" name="email" aria-describedby="emailHelp"/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" onChange={onChange} value={credential.password}
            name="password" id="password"/>
        </div> 
        <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Login