import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'


function Signup(props) {
    const host = "http://localhost:5000"
    const [credentials, setCredentials] = useState({name: "", email: "", password: "", cpassword: ""});
    let navigate = useNavigate()

    const onSubmit = async(e)=>{
        e.preventDefault();
        const {name, email, password} = credentials;
        const response = await fetch(`${host}/api/auth/createuser`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({name, email, password})
          });
          const json =  await response.json();
          console.log(json)
          if(json.success){
            // redirect save the auth token and redirect
            localStorage.setItem('token', json.authToken);
            navigate("/login")
            props.showAlert("Account Created successfully", "success")
          } else{
            props.showAlert("Invalid credentials", "danger")
          }
    }

    const onchange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }
  return (
    <div>
        <h2>Create an account to use iNotebook</h2>
        <form onSubmit={onSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" className="form-control" onChange={onchange} minLength={3}
             value={credentials.name} id="name" name="name" required/>
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" onChange={onchange}
             value={credentials.email} name="email" aria-describedby="emailHelp" required/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" onChange={onchange} minLength={5} required
             value={credentials.password} id="password" name="password"/>
        </div>
        <div className="mb-3">
            <label htmlFor="cpassword" className="form-label">Confirm Password</label>
            <input type="password" className="form-control" onChange={onchange} minLength={5} required
            value={credentials.cpassword} id="cpassword" name="cpassword"/>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
        </form>
    </div>
  )
}

export default Signup