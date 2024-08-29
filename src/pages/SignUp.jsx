import React, { useState, useEffect } from 'react';
import axios from 'axios';
const DEPLOYMENT_ID = import.meta.env.VITE_DEPLOYMENT_ID;

const SignUp = ({ mobile }) => {

    // Send data as { category, newData: [[oldInfo], [newInfo]] } for post request

    const [soups, setSoups] = useState([]);
    const [bread, setBread] = useState([]);
    const [beverages, setBeverages] = useState([]);
    const [desserts, setDesserts] = useState([]);
    const [misc, setMisc] = useState([]);
    const [tables, setTables] = useState([]);
    const [attendees, setAttendees] = useState([]);

    const cardInfo = [
        {
            title: 'Soups',
            data: soups,
        },
        {
            title: 'Bread',
            data: bread,
        },
        {
            title: 'Beverages',
            data: beverages,
        },
        {
            title: 'Desserts',
            data: desserts,
        },
        {
            title: 'Miscellaneous',
            data: misc,
        },
        {
            title: 'Tables',
            data: tables,
        }
    ];

    useEffect(() => {
        fetchSheetData();
    }, []);

    const fetchSheetData = async () => {
        try {
            const response = await axios.get(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`);
            const data = response.data;
            setSoups(data.soups);
            setBread(data.bread);
            setBeverages(data.beverages);
            setDesserts(data.desserts);
            setMisc(data.misc);
            setTables(data.tables);
            setAttendees(data.attendees);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className='d-flex flex-column align-items-center'>
            {cardInfo.map((card, index) =>
                <div key={index} className='border my-3 p-2 rounded col-6 d-flex flex-column align-items-center'>
                    <h2 className='text-center'>{card.title}</h2>
                    {card.data.map((item, index) => {
                        return (
                            <div key={index} className='fs-3 d-flex col-12'>
                                <p className='col-6 text-center'>{item.familyName}</p>
                                <p className='col-6 text-center'>{item.itemName}</p>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default SignUp;