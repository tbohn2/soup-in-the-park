import React, { useState, useEffect } from "react";
import axios from "axios";
import loadingLogo from "../assets/christmas/star.png";
import "../styles/christmasSignUp.css";
const DEPLOYMENT_ID =
  "AKfycbypf8wZLgo5EwE_zCrxyjDQuuQSkzmMP2B_-vwTdegjrooHC00L0hlIce6IrTNu64s4SA";

const ChristmasSignUp = ({ mobile }) => {
  const categories = ["attendees", "main", "side", "desserts"];

  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState(7); // 7 = all sections; otherwise, index of category to load
  const [error, setError] = useState(null);
  const [editCardNumber, setEditCardNumber] = useState(null);
  const [newData, setNewData] = useState([[]]);

  const [attendees, setAttendees] = useState([]);
  const [main, setMain] = useState([]);
  const [side, setSide] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [rsvped, setRsvped] = useState(0);

  const cardInfo = [
    {
      title: "Attendees",
      data: attendees,
    },
    {
      title: "Main Dishes",
      subtitle: "Mexican dishes",
      data: main,
    },
    {
      title: "Side Dishes",
      subtitle:
        "Chips, Salsa, Tortillas, sour cream, cheese, guacamole, fruit, etc...",
      data: side,
    },
    {
      title: "Desserts",
      data: desserts,
    },
  ];

  useEffect(() => {
    fetchAndClear();
  }, []);

  useEffect(() => {
    setRsvped(0);
    attendees.forEach((attendee) => {
      const qty = parseInt(attendee[1]);
      if (!isNaN(qty)) {
        setRsvped((prevRsvped) => prevRsvped + qty);
      }
    });
  }, [attendees]);

  const fetchSheetData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`
      );
      const data = response.data;
      setAttendees(data.attendees);
      setMain(data.main);
      setSide(data.side);
      setDesserts(data.desserts);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data; try again later");
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
  };

  const fetchAndClear = async () => {
    await fetchSheetData();
    clearStates();
  };

  const toggleAddOrEdit = (i, adding) => {
    setAdding(false);
    setEditing(false);
    setDeleting(false);
    setRowToDelete(null);
    const newDataArray = cardInfo[i].data.map((item) => [...item]); // deep copy of data
    if (adding) {
      newDataArray.push(["", ""]);
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
    setError("");

    try {
      setEditing(false); // reset to not cause issues with rendering editing inputs
      if (deleting) {
        newData.splice(rowToDelete, 1);
      }

      const category = categories[editCardNumber];
      const reqData = JSON.stringify({ category, newData: newData });
      const response = await axios.post(
        `https://script.google.com/macros/s/${DEPLOYMENT_ID}/exec`,
        reqData
      );
      console.log("Response:", response.data);
      await fetchAndClear();
      if (newAttendee) {
        setError(
          `Thank you! Don't forget to enter how many people you are bringing!`
        );
        setTimeout(() => setError(""), 7000);
        window.scrollTo({
          top: document.getElementById("Attendees"),
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setError("Error saving data; try again later");
    }
  };

  const checkIfNewAttendeeAndSave = (cardIndex) => {
    let newAttendee = false;
    const category = categories[editCardNumber];

    if (adding && "attendees" !== category) {
      const familyName = newData[newData.length - 1][0].toLowerCase().trim();
      newAttendee = !attendees.some(
        (attendee) => attendee[0].toLowerCase().trim() === familyName
      );
    }

    saveData(newAttendee, cardIndex);
  };

  return (
    <div className="fade-in main-content fw-light d-flex flex-column align-items-center">
      <div id="date-time" className="p-4 mb-4">
        <div className="date-time-item">December 23, 2024</div>
        <div className="date-time-item">6:00 PM</div>
        <div className="address-divider"></div>
        <div className="date-time-item">2326 N 32nd St</div>
        <div className="date-time-item">Mesa, AZ 85213</div>
      </div>
      {error && (
        <div className="alert alert-info fw-bold text-center fs-4">{error}</div>
      )}
      <p className="welcome-text sign-up-card my-3 p-3 col-xl-6 col-lg-8 col-md-9 col-11 fs-3 fw-bold text-center d-flex flex-column align-items-center">
        The tradition continues! Come to Alan and Marla's House in celebration
        of
        <span id="christmas" className="my-1">
          Christmas
        </span>
        Please sign up for what you would like to bring and how many people are
        coming.
      </p>
      <div className="event-details text-center my-3 p-3 col-xl-6 col-lg-8 col-md-9 col-11 fs-3">
        <h2>What to Bring</h2>
        <ul>
          <li>
            <span className="emoji">🌮</span>Mexican Dish
          </li>
          <li>
            <span className="emoji">🎁</span>Ages 12+ - $15 or less
            white-elephant gift
          </li>
          <li>
            <span className="emoji">🎅🏻</span>Ages 5-11 - $10 or less white
            elephant gift
          </li>
          <li>
            <span className="emoji">🪑</span>Lawn Chair (optional)
          </li>
          <li>
            <span className="emoji">👗</span>Any nativity costumes you might
            have
          </li>
        </ul>
      </div>
      <h2 className="confirmed-count col-lg-6 col-md-8 col-11 rounded p-2 my-2 text-center fw-bold bg-light-green">
        Confirmed Attending: {rsvped}
      </h2>
      {cardInfo.map((card, i) => (
        <div
          key={i}
          id={card.title}
          className="sign-up-card my-3 p-2 col-xl-6 col-lg-8 col-md-9 col-11 d-flex flex-column align-items-center"
        >
          <h2 className=" text-center">{card.title}</h2>
          {card.subtitle && (
            <p className="text-center text-muted mb-3">{card.subtitle}</p>
          )}
          {(loading && sectionLoading === i) ||
          (loading && sectionLoading === 7) ? (
            <div className="fade-in-out spinner-container my-4">
              <img
                className="img-fluid w-75"
                style={{
                  maxWidth: "100px",
                  animation: "spinner-border 2s linear infinite",
                }}
                src={loadingLogo}
                alt="loading logo"
              />
            </div>
          ) : (
            ""
          )}
          {card.data.map((item, j) => {
            return editing && editCardNumber === i ? (
              <div
                key={j}
                className="fade-in fs-3 d-flex align-items-center col-md-11 col-12"
              >
                <input
                  className={`col-6 m-0 p-1 ${
                    deleting && rowToDelete === j && "deleting"
                  }`}
                  type="text"
                  value={newData[j][0]}
                  onChange={(e) => handleChange(e, j, 0)}
                />
                <input
                  className={`col-5 m-0 p-1 ${
                    deleting && rowToDelete === j && "deleting"
                  }`}
                  type="text"
                  value={newData[j][1]}
                  onChange={(e) => handleChange(e, j, 1)}
                />
                <div>
                  <svg
                    className="trash"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    width="40"
                    height="40"
                    onClick={() => toggleDelete(j)}
                  >
                    <path
                      d="M9 3V2h6v1h5v2H4V3h5zm2 4h2v12h-2V7zm-4 0h2v12H7V7zm10 0h-2v12h2V7zM5 5v16h14V5H5z"
                      fill="red"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              <div
                key={j}
                className="truncated-container px-1 fade-in border fs-3 d-flex justify-content-between col-md-11 col-12"
              >
                <p className="my-0 me-3 p-1 truncated-text">{item[0]}</p>
                <p
                  className={`m-0 p-1 truncated-text truncated-text-e  ${
                    card.title === "Attendees" || card.title === "Tables"
                      ? "text-end"
                      : "col-md-6"
                  }`}
                >
                  {item[1]}
                </p>
              </div>
            );
          })}
          {adding && editCardNumber === i && (
            <div className="d-flex justify-content-between col-md-11 col-12 fs-3">
              <input
                className="col-7"
                type="text"
                placeholder="Name of Family"
                onChange={(e) => handleChange(e, newData.length - 1, 0)}
              />
              <input
                className="col-5"
                type="text"
                placeholder={
                  card.title === "Attendees" || card.title === "Tables"
                    ? "Number"
                    : "Item Name"
                }
                onChange={(e) => handleChange(e, newData.length - 1, 1)}
              />
            </div>
          )}
          {(adding && editCardNumber === i) ||
          (editing && editCardNumber === i) ? (
            <div className="d-flex col-12 flex-column align-items-center">
              {deleting ? (
                <button
                  className="custom-btn green-btn red-btn my-2 col-sm-8 col-12"
                  onClick={() => saveData(false, i)}
                >
                  Delete Selected
                </button>
              ) : (
                <button
                  className="custom-btn green-btn my-2 btn-success col-sm-8 col-12"
                  onClick={() => checkIfNewAttendeeAndSave(i)}
                >
                  Save
                </button>
              )}
              <button
                className="custom-btn blue-btn my-2 col-sm-8 col-12"
                onClick={clearStates}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="d-flex col-12 flex-column align-items-center">
              <button
                className="custom-btn green-btn my-2 col-sm-8 col-12"
                onClick={() => toggleAddOrEdit(i, true)}
              >
                Add to {card.title}
              </button>
              <button
                className="custom-btn blue-btn my-2 col-sm-8 col-12"
                onClick={() => toggleAddOrEdit(i, false)}
              >
                Make Change to{" "}
                {card.title === "Miscellaneous" ? "Misc." : card.title}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChristmasSignUp;
