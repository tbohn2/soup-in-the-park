import React, { useState, useEffect } from 'react';
import axios from 'axios';
const DEPLOYMENT_ID = import.meta.env.VITE_DEPLOYMENT_ID;

const SignUp = ({ mobile }) => {

    // Send data as { category, newData: [[oldInfo], [newInfo]] } for post request

    const categories = ['soups', 'bread', 'beverages', 'desserts', 'misc', 'tables', 'attendees'];

    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editCardNumber, setEditCardNumber] = useState(null);
    const [newData, setNewData] = useState([[]]);

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
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`);
            const data = response.data;
            setLoading(false);
            setSoups(data.soups);
            setBread(data.bread);
            setBeverages(data.beverages);
            setDesserts(data.desserts);
            setMisc(data.misc);
            setTables(data.tables);
            setAttendees(data.attendees);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data; try again later');
        }
    };

    const toggleAdd = (i) => {
        if (adding) {
            setNewData([[]]);
            setEditCardNumber(null);
        } else {
            const newDataArray = cardInfo[i].data.map((item) => [item.familyName, item.itemName]);
            newDataArray.push(['', '']);
            setNewData(newDataArray);
            setEditCardNumber(i);
        }
        setAdding(!adding);
    }

    const toggleEdit = (i) => {
        if (editing) {
            setNewData([[]]);
            setEditCardNumber(null);
        } else {
            const newDataArray = cardInfo[i].data.map((item) => [item.familyName, item.itemName]);
            setNewData(newDataArray);
            setEditCardNumber(i);
        }
        setEditing(!editing);
    }

    const handleChange = (e, j, pos) => {
        const { value } = e.target;
        const newDataCopy = [...newData];
        newDataCopy[j][pos] = value;
        setNewData(newDataCopy);
    };

    const saveData = async () => {
        setLoading(true);
        setError('');
        try {
            const category = categories[editCardNumber];
            const reqData = JSON.stringify({ category, newData: newData });

            const response = await axios.post(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`, reqData);
            console.log('Response:', response.data);
            setLoading(false);
            setEditing(false);
            setAdding(false);
            setNewData([[]]);
            fetchSheetData();
        } catch (error) {
            console.error('Error saving data:', error);
            setError('Error saving data; try again later');
        }
    }

    return (
        <div className='d-flex flex-column align-items-center'>
            {loading && <div className='spinner-border text-primary' role='status'></div>}
            {error && <div className='alert alert-danger'>{error}</div>}
            {cardInfo.map((card, i) =>
                <div key={i} className='border my-3 p-2 rounded col-6 d-flex flex-column align-items-center'>
                    <h2 className='text-center'>{card.title}</h2>
                    {card.data.map((item, j) => {
                        return (
                            editing && editCardNumber === i ? (
                                <div key={j} className='fs-3 d-flex col-12'>
                                    <input type='text' value={newData[j][0]} onChange={(e) => handleChange(e, j, 0)} />
                                    <input type='text' value={newData[j][1]} onChange={(e) => handleChange(e, j, 1)} />
                                </div>
                            ) : (
                                <div key={j} className='fs-3 d-flex col-12'>
                                    <p className='col-6 text-center'>{item.familyName}</p>
                                    <p className='col-6 text-center'>{item.itemName}</p>
                                </div>
                            )
                        )
                    })}
                    {adding && editCardNumber === i && (
                        <div className='d-flex justify-content-evenly col-12'>
                            <input type='text' placeholder='Name' onChange={(e) => handleChange(e, newData.length - 1, 0)} />
                            <input type='text' placeholder='Item Name' onChange={(e) => handleChange(e, newData.length - 1, 1)} />
                        </div>
                    )}
                    {adding && editCardNumber === i || editing && editCardNumber === i ? (
                        <div className='d-flex col-12 justify-content-evenly'>
                            <button className='btn btn-success my-2' onClick={() => saveData()}>Save</button>
                            <button className='btn btn-primary my-2' onClick={() => { setAdding(false); setEditing(false) }}>Cancel</button>
                        </div>
                    ) : (
                        <div className='d-flex col-12 justify-content-evenly'>
                            <button className='btn btn-primary my-2' onClick={() => toggleEdit(i)}>Edit</button>
                            <button className='btn btn-primary my-2' onClick={() => toggleAdd(i)}>+ Add</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SignUp;