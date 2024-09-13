import React, { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import loadingLogo from '../assets/loading.png';

const CompressedImg = ({ url, index, setFocusedURL }) => {
    const [compressedSrc, setCompressedSrc] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [inView, setInView] = useState(false);
    const imgRef = useRef(null); // Reference for the image container

    const compressImage = async (url) => {
        const response = await fetch(url);
        const imageBlob = await response.blob();

        const options = {
            maxSizeMB: 0.5,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
        };
        try {
            const compressedFile = await imageCompression(imageBlob, options);

            const compressedUrl = URL.createObjectURL(compressedFile);
            setCompressedSrc(compressedUrl);
        } catch (error) {
            console.error('Image compression failed:', error);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setInView(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 } // Trigger when 10% of the element is visible
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => {
            if (observer && observer.unobserve && imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (inView && url) {
            compressImage(url);
        }
    }, [inView, url]);

    const handleImgLoad = () => {
        setLoaded(true);
    };

    return (
        <div
            ref={imgRef}
            className="gallery-img-container my-3 d-flex justify-content-center align-items-center"
        >
            {inView ? (
                compressedSrc ? (
                    <img
                        src={compressedSrc}
                        className={`gallery-img col-12 ${loaded ? 'loaded' : ''}`}
                        onLoad={handleImgLoad}
                        alt={`Compressed + ${url}`}
                        onClick={() => setFocusedURL({ url, index })}
                    />
                ) : (
                    <div className='spinner-container my-4'>
                        <img className='lg-img' src={loadingLogo} alt="loading logo" />
                    </div>
                )
            ) : (
                <div className='spinner-container my-4'>
                    <img className='lg-img' src={loadingLogo} alt="loading logo" />
                </div>
            )}
        </div>
    );
};

export default CompressedImg;
