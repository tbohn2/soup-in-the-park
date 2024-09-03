import React, { useState, useEffect } from 'react';

// Import all images
const pineImgs = import.meta.glob('../assets/Pines/*.jpg', { eager: true });
const pineImgUrls = Object.keys(pineImgs).map((key) => pineImgs[key].default);

const Gallery = () => {
    const [loadedImages, setLoadedImages] = useState(new Set());

    const handleImageLoad = (index) => {
        setLoadedImages(prev => new Set(prev).add(index));
    };

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
                        style={{ '--transition-delay': imageDelays[index] }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Gallery;
