import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Gallery from './pages/Gallery';
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
      <header className='bg-light'>
        <h1 className='kaushan text-center col-12'>Soup In The Park</h1>
        <nav className='chewy fs-3 col-12 d-flex justify-content-evenly'>
          <Link to='/' className='navbar-brand'>Sign-up</Link>
          <Link to='/gallery' className='navbar-brand'>Gallery</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<SignUp mobile={mobile} />} />
        <Route path="/gallery" element={<Gallery mobile={mobile} />} />
      </Routes>
    </Router>
  )
}

export default App
