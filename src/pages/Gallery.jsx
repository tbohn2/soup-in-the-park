import React, { useState, useEffect } from 'react';
import '../styles/gallery.css'

// Import all images
const pineImgs = import.meta.glob('../assets/Pines/*.jpg', { eager: true });
const pineImgUrls = Object.keys(pineImgs).map((key) => pineImgs[key].default);

const Gallery = () => {
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [focusedURL, setFocusedURL] = useState({
        url: null,
        index: null
    });

    const handleImageLoad = (index) => {
        setLoadedImages(prev => new Set(prev).add(index));
    };

    const handleNext = () => {
        setFocusedURL(prev => {
            const nextIndex = (prev.index + 1) % pineImgUrls.length;
            return { url: pineImgUrls[nextIndex], index: nextIndex };
        });
    };

    const handlePrev = () => {
        setFocusedURL(prev => {
            const prevIndex = (prev.index - 1 + pineImgUrls.length) % pineImgUrls.length;
            return { url: pineImgUrls[prevIndex], index: prevIndex };
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
            // Add event listener for keyboard navigation when focusedURL is set
            window.addEventListener('keydown', handleKeyDown);

            return () => {
                window.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [focusedURL]);

    // Create an array with staggered delay values based on index
    const imageDelays = pineImgUrls.map((_, index) => `${index * 1}s`);

    return (
        <div id='gallery' className='fade-in'>
            <h1>Gallery</h1>
            <div className='d-flex flex-wrap justify-content-evenly'>
                {pineImgUrls.map((url, index) => (
                    <img
                        key={index}
                        className={`gallery-img m-3 ${loadedImages.has(index) ? 'loaded' : ''}`}
                        src={url}
                        alt={`Pine ${index + 1}`}
                        onLoad={() => handleImageLoad(index)}
                        onClick={() => setFocusedURL({ url, index })}
                        style={{ '--transition-delay': imageDelays[index] }}
                    />
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
