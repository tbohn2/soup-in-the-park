import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loadingLogo from '../assets/loading.png';
import gmaGpaPic from '../assets/main-page-gma.jpg';
import mariePic from '../assets/main-page-marie.jpg';
import '../styles/signUp.css';
const DEPLOYMENT_ID = import.meta.env.VITE_DEPLOYMENT_ID;

const SignUp = ({ mobile }) => {

    // Send data as { category, newData: [[oldInfo], [newInfo]] } for post request

    const categories = ['attendees', 'soups', 'bread', 'beverages', 'desserts', 'misc', 'tables'];

    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sectionLoading, setSectionLoading] = useState(7); // 7 = all sections; otherwise, index of category to load
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
            title: 'Attendees',
            data: attendees,
        },
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
        fetchAndClear();
    }, []);

    useEffect(() => {
        setRsvped(0);
        attendees.forEach((attendee) => {
            const qty = parseInt(attendee[1]);
            if (!isNaN(qty)) {
                setRsvped(prevRsvped => prevRsvped + qty);
            }
        });
    }, [attendees]);

    const fetchSheetData = async () => {
        setLoading(true);
        setError('');
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
            setError('Error fetching data; try again later');
        }
    };

    const clearStates = () => {
        setAdding(false);
        setEditing(false);
        setDeleting(false);
        setNewData([[]]);
        setEditCardNumber(null);
        setLoading(false);
        setSectionLoading(7);
        setError(null);
        setDeleting(false);
    }

    const fetchAndClear = async () => {
        await fetchSheetData();
        clearStates();
    };

    const toggleAddOrEdit = (i, adding) => {
        setAdding(false);
        setEditing(false);
        setDeleting(false);
        setRowToDelete(null);
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

    const toggleDelete = (j) => {
        setDeleting(true);
        setRowToDelete(j);
    };

    const handleChange = (e, j, pos) => {
        const { value } = e.target;
        const newDataCopy = [...newData];
        newDataCopy[j][pos] = value;
        setNewData(newDataCopy);
    };

    const saveData = async (newAttendee, cardIndex) => {
        setLoading(true);
        setSectionLoading(cardIndex);
        setError('');

        try {
            setEditing(false); // reset to not cause issues with rendering editing inputs
            if (deleting) {
                newData.splice(rowToDelete, 1);
            }

            const category = categories[editCardNumber];
            const reqData = JSON.stringify({ category, newData: newData });
            const response = await axios.post(`https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`, reqData);
            console.log('Response:', response.data);
            await fetchAndClear();
            if (newAttendee) {
                setError(`Thank you! Don't forget to enter how many people you are bringing!`);
                setTimeout(() => setError(''), 7000);
                window.scrollTo({ top: document.getElementById('Attendees'), behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error saving data:', error);
            setError('Error saving data; try again later');
        }
    }

    const checkIfNewAttendeeAndSave = (cardIndex) => {
        let newAttendee = false;
        const category = categories[editCardNumber];

        if (adding && "attendees" !== category) {
            const familyName = newData[newData.length - 1][0].toLowerCase().trim();
            newAttendee = !attendees.some((attendee) =>
                attendee[0].toLowerCase().trim() === familyName
            );
        }

        saveData(newAttendee, cardIndex);
    };

    return (
        <div className='fade-in main-content fw-light d-flex flex-column align-items-center'>
            <div id='date-time'>
                <h1 className='chewy fs-3'>October 20, 2025</h1>
                <h1 className='chewy fs-3'>5:00 PM</h1>
            </div>
            {error && <div className='alert alert-info fw-bold text-center fs-4'>{error}</div>}
            <div className='d-flex flex-wrap justify-content-evenly col-xl-6 col-lg-8 col-md-9 col-11'>
                <img className='fade-in rounded mt-2 col-5 my-2 object-fit-cover' src={gmaGpaPic} alt="Gma and Gpa" />
                <img className='fade-in rounded mt-2 col-5 my-2 object-fit-cover' src={mariePic} alt="Marie" />
            </div>
            <p className='sign-up-card my-3 p-3 col-xl-6 col-lg-8 col-md-9 col-11 fs-3 fw-bold text-center d-flex flex-column align-items-center'>
                The tradition continues! Come to Sheepherder's Park for our annual celebration of
                <span id='shirley' className='my-1 kaushan'>Shirley Martindale</span>
                This year will be extra special as we also remember and celebrate
                <span id='shirley' className='my-1 kaushan'>Marie Tate</span>
                who was the creator and organizer of Soup in the Park.
                Her love and generosity was felt by all of us. We honor both of these amazing women and are forever grateful for their legacy of love.
            </p>
            <h2 className='col-lg-6 col-md-8 col-11 rounded p-2 my-2 text-center fw-bold bg-light-green'>Confirmed Attending: {rsvped}</h2>
            {cardInfo.map((card, i) =>
                <div key={i} id={card.title} className='sign-up-card my-3 p-2 col-xl-6 col-lg-8 col-md-9 col-11 d-flex flex-column align-items-center'>
                    <h2 className='chewy text-center'>{card.title}</h2>
                    {loading && sectionLoading === i || loading && sectionLoading === 7 ?
                        <div className='fade-in-out spinner-container my-4'>
                            <img className='lg-img' src={loadingLogo} alt="loading logo" />
                        </div> : ''}
                    {card.data.map((item, j) => {
                        return (
                            editing && editCardNumber === i ? (
                                <div key={j} className='fade-in fs-3 d-flex align-items-center col-md-11 col-12'>
                                    <input className={`col-6 m-0 p-1 ${deleting && rowToDelete === j && 'deleting'}`} type='text' value={newData[j][0]} onChange={(e) => handleChange(e, j, 0)} />
                                    <input className={`col-5 m-0 p-1 ${deleting && rowToDelete === j && 'deleting'}`} type='text' value={newData[j][1]} onChange={(e) => handleChange(e, j, 1)} />
                                    <div>
                                        <svg className='trash' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="40" height="40" onClick={() => toggleDelete(j)}>
                                            <path d="M9 3V2h6v1h5v2H4V3h5zm2 4h2v12h-2V7zm-4 0h2v12H7V7zm10 0h-2v12h2V7zM5 5v16h14V5H5z" fill="red" />
                                        </svg>

                                    </div>
                                </div>
                            ) : (
                                <div key={j} className='truncated-container px-1 fade-in border fs-3 d-flex justify-content-between col-md-11 col-12'>
                                    <p className='my-0 me-3 p-1 truncated-text'>{item[0]}</p>
                                    <p className={`m-0 p-1 truncated-text truncated-text-e  ${card.title === 'Attendees' || card.title === "Tables" ? 'text-end' : 'col-md-6'}`}>{item[1]}</p>
                                </div>
                            )
                        )
                    })}
                    {adding && editCardNumber === i && (
                        <div className='d-flex justify-content-between col-md-11 col-12 fs-3'>
                            <input className='col-7' type='text' placeholder='Name of Family' onChange={(e) => handleChange(e, newData.length - 1, 0)} />
                            <input className='col-5' type='text' placeholder={card.title === 'Attendees' || card.title === "Tables" ? 'Number' : 'Item Name'} onChange={(e) => handleChange(e, newData.length - 1, 1)} />
                        </div>
                    )}
                    {adding && editCardNumber === i || editing && editCardNumber === i ? (
                        <div className='d-flex col-12 flex-column align-items-center'>
                            {deleting ?
                                <button className='custom-btn green-btn red-btn my-2 col-sm-8 col-12' onClick={() => saveData(false, i)}>Delete Selected</button>
                                :
                                <button className='custom-btn green-btn my-2 btn-success col-sm-8 col-12' onClick={() => checkIfNewAttendeeAndSave(i)}>Save</button>
                            }
                            <button className='custom-btn blue-btn my-2 col-sm-8 col-12' onClick={clearStates}>Cancel</button>
                        </div>
                    ) : (
                        <div className='d-flex col-12 flex-column align-items-center'>
                            <button className='custom-btn green-btn my-2 col-sm-8 col-12' onClick={() => toggleAddOrEdit(i, true)}>Add to {card.title}</button>
                            <button className='custom-btn blue-btn my-2 col-sm-8 col-12' onClick={() => toggleAddOrEdit(i, false)}>Make Change to {card.title === "Miscellaneous" ? "Misc." : card.title}</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SignUp;
