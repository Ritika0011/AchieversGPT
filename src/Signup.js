import React, { useState } from 'react';
import axios from 'axios';
import './login-signup.css';
import logo from "./img/Achievers.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
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
      const response = await axios.post('/signup', formData); // Send form data to the server
      // Assuming the server responds with a "message" field indicating successful signup
      if (response.data.message === 'Signup successful') {
        // Perform the action you want after successful signup, such as redirecting the user
        window.location.href = '/';
        alert("Signup successful");
        console.log('Signup successful');
      } else {
        console.log('Signup failed');
      }
    } catch (error) {
      alert("Signup failed");
      console.error('An error occurred during signup:', error);
    }
  };

  return (
    <section className="Box">
    <div className='heading'>
      <img src={logo} alt="logo" />
      <h1>Signup</h1>
    </div>
    <div className="form">
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <button type="submit">Signup</button>
      </form>
      <br />
        <a href="/">Already have an account? Login</a>
    </div>


    </section>
  );
};

export default Signup;
