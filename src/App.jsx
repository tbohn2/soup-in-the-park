import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Gallery from './pages/Gallery';
import logo from './assets/logo.png';
import './App.css'

function App() {
  const [mobile, setMobile] = useState(false);
  const [signUp, setSignUp] = useState(true);

  const checkNav = () => {
    if (window.location.pathname === '/gallery') {
      setSignUp(false);
    } else {
      setSignUp(true);
    }
  }

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
      <div className='bg-yellow text-blue'>
        <header className='d-flex flex-column align-items-center'>
          <img src={logo} alt="" />
          <nav className='chewy fs-3 d-flex justify-content-evenly'>
            <Link to='/' className={`nav-btn ${signUp ? 'text-decoration-underline' : ''}`} onClick={() => setSignUp(true)}>Sign-up</Link>
            <Link to='/gallery' className={`nav-btn ${!signUp ? 'text-decoration-underline' : ''}`} onClick={() => setSignUp(false)}>Gallery</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<SignUp mobile={mobile} />} />
          <Route path="/gallery" element={<Gallery mobile={mobile} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
