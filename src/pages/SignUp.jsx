import React, { useState, useEffect } from 'react';
import axios from 'axios';
import loadingLogo from '../assets/loading.png';
import gmaGpaPic from '../assets/main-page-gma.jpg';
import mariePic from '../assets/main-page-marie.jpg';
import '../styles/signUp.css';
const DEPLOYMENT_ID = "AKfycbyN0yil3m_DANY2UEcWHkXhBAmg8nS2aUBcM_1EC5cRdA8S7uTqneF2Xk9SYNRfbHhjUA";

const SignUp = ({ mobile }) => {

    // Send data as { category, newData: [[oldInfo], [newInfo]] } for post request

    const categories = ['attendees', 'soups', 'bread', 'beverages', 'desserts', 'misc', 'tables', 'pickleballPlayers'];

    const [adding, setAdding] = useState(false);
    const [editing, setEditing] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sectionLoading, setSectionLoading] = useState(8); // 8 = all sections; otherwise, index of category to load
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
    const [pickleballPlayers, setpickleballPlayers] = useState([]);

    const cardInfo = [
        {
            title: 'Attendees',
            data: attendees,
            addText: 'RSVP',
            editText: 'Edit Attendees',
            placeholder1: 'Family Name',
            placeholder2: '# of People',
        },
        {
            title: 'Soups',
            data: soups,
            addText: 'Add a Soup',
            editText: 'Edit Soups',
            placeholder1: 'Name of Family',
            placeholder2: 'Soup',
        },
        {
            title: 'Bread',
            data: bread,
            addText: 'Add a Bread Item',
            editText: 'Edit Bread Items',
            placeholder1: 'Name of Family',
            placeholder2: 'Bread Item',
        },
        {
            title: 'Beverages',
            data: beverages,
            addText: 'Add a Beverage',
            editText: 'Edit Beverages',
            placeholder1: 'Name of Family',
            placeholder2: 'Beverage',
        },
        {
            title: 'Desserts',
            data: desserts,
            addText: 'Add a Dessert',
            editText: 'Edit Desserts',
            placeholder1: 'Name of Family',
            placeholder2: 'Dessert',
        },
        {
            title: 'Miscellaneous',
            data: misc,
            addText: 'Add a Misc. Item',
            editText: 'Edit Misc. Items',
            placeholder1: 'Name of Family',
            placeholder2: 'Misc. Item',
        },
        {
            title: 'Tables',
            data: tables,
            addText: 'Add Tables',
            editText: 'Edit Tables',
            placeholder1: 'Name of Family',
            placeholder2: '# of Tables',
        },
        {
            title: 'Pickleball Players',
            data: pickleballPlayers,
            addText: 'Sign Up to Play',
            editText: 'Edit Players',
            placeholder1: 'Name',
            placeholder2: '# of Players',
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
            setSoups(data.soups ?? []);
            setBread(data.bread ?? []);
            setBeverages(data.beverages ?? []);
            setDesserts(data.desserts ?? []);
            setMisc(data.misc ?? []);
            setTables(data.tables ?? []);
            setAttendees(data.attendees ?? []);
            setpickleballPlayers(data.pickleballPlayers ?? []);
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
        setSectionLoading(8);
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
                <h1 className='chewy fs-3'>October 19, 2026</h1>
                <h1 className='chewy fs-3'>5:00 PM</h1>
            </div>
            {/* <div className='d-flex flex-wrap justify-content-evenly col-xl-2 col-lg-8 col-md-9 col-11'>
                <img className='fade-in rounded mt-2 col-5 my-2 object-fit-cover' src={mariePic} alt="Marie" />
            </div> */}
            {error && <div className='alert alert-info fw-bold text-center fs-4'>{error}</div>}
            <div className='sign-up-card d-flex flex-column align-items-center gap-2 my-3 p-3 col-xl-6 col-lg-8 col-md-9 col-11 fs-3 fw-bold text-center'>
                <p className='mb-0'>The time has come again for our annual celebration!</p>
                {/* <br />
                <span id='shirley' className='my-1 fs-1 kaushan'>Shirley Martindale</span> */}
                <img className='fade-in rounded col-11 col-md-8 col-xl-6 object-fit-cover' src={gmaGpaPic} alt="Gma and Gpa" />
                <p className='mb-0'>We will be gathering at</p>
                <div className='col-12 rounded p-2 fw-bold bg-light-green d-flex flex-column align-items-center'>
                    <h1 className='my-1 fs-1 fw-bold'>Gene Autry Park</h1>
                    <p className='fs-3 mb-0'>New Location This Year! </p>
                    <a className='text-blue' href="https://maps.app.goo.gl/dFQU244ewSoQVw9C7" target="_blank" rel="noopener noreferrer"><i className="bi bi-geo-alt"></i>View Map</a>
                </div>
                <p className='mb-0'>In addition to our usual festivities, we will have a volleyball net set up for those who want to play. We have also reserved two pickleball courts (13A/B) from 8-9pm.
                    For those who want to stay and play, please sign up at the <a className='text-blue' href="#Pickleball Players">bottom of this page</a>.
                </p>
            </div>
            <h2 className='col-xl-6 col-lg-8 col-md-9 col-11 rounded p-2 my-2 text-center fw-bold bg-light-green'>Confirmed Attending: {rsvped}</h2>
            {cardInfo.map((card, i) =>
                <div key={i} id={card.title} className='sign-up-card my-3 px-2 py-4 col-xl-6 col-lg-8 col-md-9 col-11 d-flex flex-column align-items-center gap-4'>
                    <h2 className='chewy text-center'>{card.title}</h2>
                    {loading && sectionLoading === i || loading && sectionLoading === 8 ?
                        <div className='fade-in-out spinner-container my-4'>
                            <img className='lg-img' src={loadingLogo} alt="loading logo" />
                        </div> :
                        <div className='col-12 d-flex flex-column align-items-center'>
                            {card.data.map((item, j) => {
                                return (
                                    editing && editCardNumber === i ? (
                                        <div key={j} className='fade-in fs-3 d-flex align-items-center justify-content-between col-md-11 col-12'>
                                            <input className={`m-0 p-1 col-6 ${deleting && rowToDelete === j && 'deleting'}`} type='text' value={newData[j][0]} onChange={(e) => handleChange(e, j, 0)} />
                                            <input className={`m-0 p-1 col-5 ${deleting && rowToDelete === j && 'deleting'}`} type='text' value={newData[j][1]} onChange={(e) => handleChange(e, j, 1)} />
                                            <div className='d-flex align-items-center'>
                                                <svg className='trash' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="40" height="40" fill="var(--danger)" onClick={() => toggleDelete(j)}>
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                </svg>

                                            </div>
                                        </div>
                                    ) : (
                                        <div key={j} className='truncated-container px-1 fade-in border fs-3 d-flex justify-content-between col-md-11 col-12'>
                                            <p className='my-0 me-3 p-1 truncated-text'>{item[0]}</p>
                                            <p className={`m-0 p-1 truncated-text truncated-text-e  ${card.title === 'Attendees' || card.title === "Tables" || card.title === "Pickleball Players" ? 'text-end' : 'col-md-6'}`}>{item[1]}</p>
                                        </div>
                                    )
                                )
                            })}
                        </div>
                    }
                    {adding && editCardNumber === i && (
                        <div className='d-flex justify-content-between col-md-11 col-12 fs-3'>
                            <input className='col-7' type='text' placeholder={card.placeholder1} onChange={(e) => handleChange(e, newData.length - 1, 0)} />
                            <input className='col-5' type='text' placeholder={card.placeholder2} onChange={(e) => handleChange(e, newData.length - 1, 1)} />
                        </div>
                    )}
                    {adding && editCardNumber === i || editing && editCardNumber === i ? (
                        <div className='d-flex col-md-11 col-12 flex flex-wrap align-items-center gap-lg-4 gap-3'>
                            {deleting ?
                                <button className='custom-btn red-btn col-lg-5 col-12 flex-grow-1' onClick={() => saveData(false, i)}>Delete Selected</button>
                                :
                                <button className='custom-btn green-btn btn-success col-lg-5 col-12 flex-grow-1' onClick={() => checkIfNewAttendeeAndSave(i)}>Save</button>
                            }
                            <button className='custom-btn grey-btn col-lg-5 col-12 flex-grow-1' onClick={clearStates}>Cancel</button>
                        </div>
                    ) : (
                        <div className='d-flex col-md-11 col-12 flex flex-wrap align-items-center gap-lg-4 gap-3'>
                            <button className='custom-btn green-btn col-lg-5 col-12 flex-grow-1' onClick={() => toggleAddOrEdit(i, true)}><i class={`bi ${card.title === 'Pickleball Players' || card.title === 'Attendees' ? 'bi-person-plus' : 'bi-plus-circle'}`}></i> {card.addText}</button>
                            <button className='custom-btn blue-btn col-lg-5 col-12 flex-grow-1' onClick={() => toggleAddOrEdit(i, false)}><i class="bi bi-pencil-square"></i> {card.editText}</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SignUp;
