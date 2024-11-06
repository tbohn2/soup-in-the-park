import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Gallery from './pages/Gallery';
import ChristmasSignUp from './pages/ChrismasSignUp';
import ChristmasGallery from './pages/ChristmasGallery';
// import logo from './assets/logo.png';
import logo from './assets/trumpSanty.png';

import './App.css'

function App() {
  const [mobile, setMobile] = useState(false);
  const [signUp, setSignUp] = useState(true);

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

  const signUpClick = () => {
    setSignUp(true);
    const element = document.getElementById('Soups');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (

    <Router>
      <div className='bg-yellow text-blue'>
        <header className='py-2 d-flex align-items-center'>
          <img src={logo} alt="" />
          {mobile ?
            <nav className='chewy fs-2 d-flex justify-content-evenly'>
              <div className="dropdown">
                <span data-bs-toggle="dropdown" aria-expanded="false">&#9776;</span>
                <ul className="col-12 dropdown-menu m-0 p-0">
                  <li className='col-12 fs-3 bg-yellow'>
                    <Link to='/' onClick={signUpClick}>Sign-up</Link>
                  </li>
                  <li className='col-12 fs-3 bg-yellow'>
                    <Link to='/gallery' onClick={() => setSignUp(false)}>Gallery</Link>
                  </li>
                </ul>
              </div>
            </nav>
            :
            <nav className='chewy bg-yellow fs-3 d-flex justify-content-evenly'>
              <Link to='/' className={`nav-btn ${signUp ? 'text-decoration-underline' : ''}`} onClick={signUpClick}>Sign-up</Link>
              <Link to='/gallery' className={`nav-btn ${!signUp ? 'text-decoration-underline' : ''}`} onClick={() => setSignUp(false)}>Gallery</Link>
            </nav>
          }
        </header>
        <Routes>
          <Route path="/" element={<ChristmasSignUp mobile={mobile} />} />
          <Route path="/gallery" element={<ChristmasGallery mobile={mobile} />} />
          {/* <Route path="/" element={<SignUp mobile={mobile} />} />
          <Route path="/gallery" element={<Gallery mobile={mobile} />} /> */}
        </Routes>
      </div>
    </Router >
  )
}

export default App
