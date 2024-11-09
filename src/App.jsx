import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Gallery from './pages/Gallery';
import ChristmasSignUp from './pages/ChrismasSignUp';
import ChristmasGallery from './pages/ChristmasGallery';
import logo from './assets/logo.png';
import christmasLogo from './assets/christmas/nativity-1.jpeg';

function App() {
  const [mobile, setMobile] = useState(false);
  const [signUp, setSignUp] = useState(true);
  const [isChristmasSeason, setIsChristmasSeason] = useState(false);

  useEffect(() => {
    const loadSeasonalStyles = async () => {
      if (isChristmasSeason) {
        await import('./christmasApp.css');
      } else {
        await import('./App.css');
      }
    };

    const checkSeason = () => {
      const today = new Date();
      const month = today.getMonth();
      const day = today.getDate();

      if ((month === 9 && day >= 15) || month === 10 || month === 11) {
        setIsChristmasSeason(true);
      } else {
        setIsChristmasSeason(false);
      }
    };

    const handleResize = () => {
      setMobile(window.innerWidth <= 768);
    };

    checkSeason();
    loadSeasonalStyles();
    handleResize();

    const seasonInterval = setInterval(checkSeason, 86400000);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(seasonInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isChristmasSeason]);

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
          <img src={isChristmasSeason ? christmasLogo : logo} alt="" />
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
          <Route 
            path="/" 
            element={
              isChristmasSeason 
                ? <ChristmasSignUp mobile={mobile} /> 
                : <SignUp mobile={mobile} />
            } 
          />
          <Route 
            path="/gallery" 
            element={
              isChristmasSeason 
                ? <ChristmasGallery mobile={mobile} /> 
                : <Gallery mobile={mobile} />
            } 
          />
        </Routes>
      </div>
    </Router >
  )
}

export default App
