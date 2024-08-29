import React, { useState, useEffect } from 'react';
import axios from 'axios';
const DEPLOYMENT_ID = import.meta.env.VITE_DEPLOYMENT_ID;

const SignUp = ({ mobile }) => {

    // Send data as { category, newData: [[oldInfo], [newInfo]] } for post request

    const categories = ['soups', 'bread', 'beverages', 'desserts', 'misc', 'tables', 'attendees'];

    const [adding, setAdding] = useState(false);
    const [addingAttendee, setAddingAttendee] = useState(false);
    const [newQty, setNewQty] = useState(0);
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
    const [rsvped, setRsvped] = useState(0);

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

    useEffect(() => {
        setRsvped(0);
        attendees.forEach((attendee) => {
            setRsvped(prevRsvped => prevRsvped + attendee[1]);
        });
    }, [attendees]);

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

    const clearStates = () => {
        setAdding(false);
        setAddingAttendee(false);
        setNewQty(0);
        setEditing(false);
        setDeleting(false);
        setNewData([[]]);
        setEditCardNumber(null);
        setLoading(false);
        setError(null);
        setDeleting(false);
    }

    const toggleAddOrEdit = (i, adding) => {
        const newDataArray = cardInfo[i].data.map(item => [...item]); // deep copy of data
        if (adding) {
            newDataArray.push(['', '']);
            setAdding(true);
        } else {
            setEditing(true);
        }
        setNewData(newDataArray);
        setEditCardNumber(i);
    };


    const handleChange = (e, j, pos) => {
        const { value } = e.target;
        const newDataCopy = [...newData];
        newDataCopy[j][pos] = value;
        setNewData(newDataCopy);
    };

    const saveData = async () => {
        setLoading(true);
        setError('');
        if (addingAttendee) {
            try {
                const newAttendeeData = attendees.map(attendee => [...attendee]);
                newAttendeeData.push([newData[newData.length - 1][0], newQty]);
                const attendeeData = JSON.stringify({ category: 'attendees', newData: newAttendeeData });
                const response = await axios.post(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`, attendeeData);
                console.log('Response:', response.data);
            } catch (error) {
                console.error('Error saving data:', error);
                setError('Error saving data; try again later');
            }
        }

        try {
            const category = categories[editCardNumber];
            const reqData = JSON.stringify({ category, newData: newData });
            const response = await axios.post(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`, reqData);
            console.log('Response:', response.data);
            clearStates();
            fetchSheetData();
        } catch (error) {
            console.error('Error saving data:', error);
            setError('Error saving data; try again later');
        }
    }

    const checkIfNewAttendeeAndSave = () => {
        if (adding) {
            const familyName = newData[newData.length - 1][0]
            let newAttendee = true;

            attendees.forEach((attendee) => {
                if (attendee[0] === familyName) {
                    newAttendee = false;
                }
            });
            if (newAttendee && newQty < 1) {
                setAddingAttendee(true);
                setError('Please enter how many are attending');
                setTimeout(() => setError(''), 3000);
                return;
            }
        }
        saveData();

    }

    return (
        <div className='d-flex flex-column align-items-center'>
            {loading &&
                <div className='spinner-container'>
                    <div className='spinner-border text-primary' role='status'></div>
                </div>}
            {error && <div className='alert alert-info fs-4'>{error}</div>}
            People coming: {rsvped}
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
                                    <p className='col-6 text-center'>{item[0]}</p>
                                    <p className='col-6 text-center'>{item[1]}</p>
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
                    {addingAttendee && (
                        <div>
                            <h2 className='text-center'>How many are attending?</h2>
                            <input type='number' placeholder='Qty' value={newQty} onChange={(e) => setNewQty(e.target.value)} />
                        </div>
                    )}
                    {adding && editCardNumber === i || editing && editCardNumber === i ? (
                        <div className='d-flex col-12 justify-content-evenly'>
                            <button className='btn btn-success my-2' onClick={() => checkIfNewAttendeeAndSave()}>Save</button>
                            <button className='btn btn-primary my-2' onClick={clearStates}>Cancel</button>
                        </div>
                    ) : (
                        <div className='d-flex col-12 justify-content-evenly'>
                            <button className='btn btn-primary my-2' onClick={() => toggleAddOrEdit(i, false)}>Edit</button>
                            <button className='btn btn-primary my-2' onClick={() => toggleAddOrEdit(i, true)}>+ Add</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SignUp;