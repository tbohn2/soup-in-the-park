import React, { useState, useEffect } from 'react';
import CompressedImg from '../components/CompressedImg.jsx';
// import '../styles/christmasGallery.css' // needs to be imported conditionally

const pics = import.meta.glob('../assets/christmas/*.jpeg', { eager: true });

const urlArray = [];

function addToUrlArray(picObj) {
    urlArray.push(...Object.keys(picObj).map((key) => picObj[key].default));
}

addToUrlArray(pics);

const ChristmasGallery = () => {

    const [loading, setLoading] = useState(false);
    const [picUrls, setPicUrls] = useState([]);
    const [focusedURL, setFocusedURL] = useState({
        url: null,
        index: null
    });

    useEffect(() => {
        setPicUrls(urlArray);
    }, []);

    const handleNext = () => {
        setLoading(true);
        setFocusedURL(prev => {
            const nextIndex = (prev.index + 1) % picUrls.length;
            return { url: picUrls[nextIndex], index: nextIndex };
        });
    };

    const handlePrev = () => {
        setLoading(true);
        setFocusedURL(prev => {
            const prevIndex = (prev.index - 1 + picUrls.length) % picUrls.length;
            return { url: picUrls[prevIndex], index: prevIndex };
        });
    };

    const handleKeyDown = (event) => {
        if (!focusedURL.url) return;

        switch (event.key) {
            case 'ArrowLeft':
                handlePrev();
                break;
            case 'ArrowRight':
                handleNext();
                break;
            case 'Escape':
                setFocusedURL({ url: null, index: null });
                break;
            default:
                break;
        }
    };

    const handleImageLoad = () => {
        setLoading(false);
    };

    useEffect(() => {
        if (focusedURL.url) {
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [focusedURL]);

    return (
        <div id='gallery' className='main-content fade-in d-flex flex-column align-items-center'>
            <h1 className='mountains-christmas'>Over the Years</h1>
            <div className='d-flex flex-wrap justify-content-evenly'>
                {picUrls.map((url, index) => (
                    <CompressedImg url={url} index={index} setFocusedURL={setFocusedURL} />
                ))}
            </div>
            {focusedURL.url &&
                <div id='focused-img' className={focusedURL ? 'show' : ''}>
                    {loading && <div className="spinner-border" role="status"></div>}
                    <button id='close-btn' onClick={() => setFocusedURL({ url: null, index: null })}>&times;</button>
                    <button id='prev-btn' className='gal-nav-btn' onClick={handlePrev}>&lt;</button>
                    <button id='next-btn' className='gal-nav-btn' onClick={handleNext}>&gt;</button>
                    <img className='fade-in' src={focusedURL.url} alt='' onLoad={handleImageLoad} />
                </div>}
        </div>
    );
};

export default ChristmasGallery;
