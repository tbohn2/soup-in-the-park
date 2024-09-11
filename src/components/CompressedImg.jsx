import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';

const CompressedImg = ({ url, index, setFocusedURL }) => {
    const [compressedSrc, setCompressedSrc] = useState(null);
    const [loaded, setLoaded] = useState(false);

    const compressImage = async (url) => {
        const response = await fetch(url);
        const imageBlob = await response.blob();

        const options = {
            maxSizeMB: 1,
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

    React.useEffect(() => {
        if (url) {
            compressImage(url);
        }
    }, [url]);

    const handleImgLoad = () => {
        setLoaded(true);
    }

    return (
        <div className='gallery-img-container my-3 d-flex justify-content-center align-items-center'>
            {compressedSrc ? (
                <img src={compressedSrc} className={`gallery-img col-12 ${loaded ? 'loaded' : ''}`} onLoad={handleImgLoad} alt="Compressed" onClick={() => setFocusedURL({ url, index })} />
            ) : (
                <div className="spinner-border" role="status">Yo</div>
            )}
        </div>
    );
};

export default CompressedImg;
