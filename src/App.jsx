import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './pages/SignUp';
import './App.css'

function App() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMobile(true);
    }
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    });
  }, []);

  return (
    <Router basename='/soup-in-the-park'>
      <Routes>
        <Route path="/" element={<SignUp mobile={mobile} />} />
      </Routes>
    </Router>
  )
}

export default App
