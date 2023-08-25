import React, { useState } from 'react';
import axios from 'axios';
import './login-signup.css';
import logo from "./img/Achievers.png";
import signup from "./Signup";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/login', formData); // Send form data to the server
      // Assuming the server responds with a "message" field indicating login success
      if (response.data.message === 'Login successful') {
        // Perform the action you want after successful login, such as redirecting the user
        // Example: window.location.href = '/dashboard';
        localStorage.setItem('authenticated', 'true');
        const user = JSON.parse(localStorage.getItem('user'));
        console.log(user);
        console.log(typeof(user));
        console.log(response.data.result);

        window.location.href = '/gpt-app';
        console.log('Login successful');
      } 
      else {
        alert("Invalid credentials");
        console.log('Invalid credentials');
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
    }
  };

  return (
    <section className="Box">
        <div className="heading">
            <img src={logo} alt="logo" />
            <h1>LOG IN</h1>
        </div>
        
        <div className="form">
        <form onSubmit={handleSubmit}>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Login</button>

            <br/>
            <p>Not Signed Up? <a href='/signup'>Sign UP</a></p>
        </form>
        </div>
    </section>
  );
};

export default Login;
