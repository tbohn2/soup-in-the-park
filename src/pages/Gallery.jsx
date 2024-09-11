import React, { useState, useEffect } from 'react';
import CompressedImg from '../components/CompressedImg.jsx';
import '../styles/gallery.css'

const pics2005 = import.meta.glob('../assets/2005/*.jpg', { eager: true });
const pics2007 = import.meta.glob('../assets/2007/*.jpg', { eager: true });
const pics2009 = import.meta.glob('../assets/2009/*.jpg', { eager: true });
const pics2010 = import.meta.glob('../assets/2010/*.jpg', { eager: true });
const pics2011 = import.meta.glob('../assets/2011/*.jpg', { eager: true });
const pineImgs = import.meta.glob('../assets/Pines/*.jpg', { eager: true });
const pics2014 = import.meta.glob('../assets/2014/*.jpg', { eager: true });
const pics2015 = import.meta.glob('../assets/2015/*.jpg', { eager: true });
const pics2019 = import.meta.glob('../assets/2019/*.jpg', { eager: true });

const urlArray = [];

function addToUrlArray(picObj) {
    urlArray.push(...Object.keys(picObj).map((key) => picObj[key].default));
}

addToUrlArray(pics2005);
addToUrlArray(pics2007);
addToUrlArray(pics2009);
addToUrlArray(pics2010);
addToUrlArray(pics2011);
addToUrlArray(pineImgs);
addToUrlArray(pics2014);
addToUrlArray(pics2015);
addToUrlArray(pics2019);

const Gallery = () => {

    const [picUrls, setPicUrls] = useState([]);
    const [focusedURL, setFocusedURL] = useState({
        url: null,
        index: null
    });

    useEffect(() => {
        setPicUrls(urlArray);
    }, []);

    const handleNext = () => {
        setFocusedURL(prev => {
            const nextIndex = (prev.index + 1) % picUrls.length;
            return { url: picUrls[nextIndex], index: nextIndex };
        });
    };

    const handlePrev = () => {
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

    useEffect(() => {
        if (focusedURL.url) {
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [focusedURL]);

    return (
        <div id='gallery' className='fade-in d-flex flex-column align-items-center'>
            <h1>Gallery</h1>
            <div className='d-flex flex-wrap justify-content-evenly'>
                {picUrls.map((url, index) => (
                    <CompressedImg url={url} index={index} setFocusedURL={setFocusedURL} />
                ))}
            </div>
            {focusedURL.url &&
                <div id='focused-img' className={focusedURL ? 'show' : ''}>
                    <button id='close-btn' onClick={() => setFocusedURL({ url: null, index: null })}>&times;</button>
                    <button id='prev-btn' onClick={handlePrev}>&lt;</button>
                    <button id='next-btn' onClick={handleNext}>&gt;</button>
                    <img src={focusedURL.url} alt='' />
                </div>}
        </div>
    );
};

export default Gallery;
