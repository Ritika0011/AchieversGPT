import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import the updated components

import Login from './Login';
import Signup from './Signup';
import GptApp from './GptApp';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Use 'element' prop instead of 'component' */}
        <Route path="/signup" element={<Signup />} /> {/* Use 'element' prop instead of 'component' */}
        {/*<Route path="/gpt-app" element={<GptApp />} />*/}
        <Route path="/gpt-app" element={localStorage.getItem('authenticated') ? <GptApp /> : <Navigate to="/login" />} />    
        {/* Use Navigate component to handle redirection based on authentication */}
        {/* ... (Other routes if any) */}
      </Routes>
    </Router>
  );
};

export default App;
