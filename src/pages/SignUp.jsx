import React, { useState, useEffect } from 'react';
import axios from 'axios';
const DEPLOYMENT_ID = import.meta.env.VITE_DEPLOYMENT_ID;

console.log('Deployment ID:', DEPLOYMENT_ID);


const SignUp = ({ mobile }) => {

    const [data, setData] = useState([]);

    useEffect(() => {
        fetchSheetData();
    }, []);

    const fetchSheetData = async () => {
        try {
            const response = await axios.get(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`);
            setData(response.data);
            console.log('Sheet Data:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <h1>Google Sheets API with React</h1>
            {data}
        </div>
    );
};

export default SignUp;