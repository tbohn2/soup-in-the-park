import React, { useState, useEffect } from "react";
import axios from "axios";
import loadingLogo from "../assets/christmas/star.png";
import nativityPhoto from "../assets/christmas/nativity-1.jpeg";
import {
  ChristmasTree,
  TacoIcon,
  GiftIcon,
  SantaHatIcon,
  LawnChairIcon,
  ShepherdCrookIcon,
} from "../components/ChristmasIcons";
import "../styles/christmasSignUp.css";
const DEPLOYMENT_ID =
  "AKfycbypf8wZLgo5EwE_zCrxyjDQuuQSkzmMP2B_-vwTdegjrooHC00L0hlIce6IrTNu64s4SA";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=2326+N+32nd+St+Mesa+AZ+85213";

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
    <div className="xmas fade-in main-content d-flex flex-column align-items-center">
      {error && (
        <div className="alert alert-info fw-bold text-center fs-4">{error}</div>
      )}
      <section className="xmas-card xmas-invite">
        <div className="xmas-invite-photo">
          <img
            src={nativityPhoto}
            alt="Kids acting out the nativity at a past Christmas party"
          />
        </div>
        <div className="xmas-invite-body">
          <p className="xmas-greeting">The tradition is back!</p>
          <h1 id="christmas" className="xmas-display">
            <span className="xmas-tree">
              <ChristmasTree />
            </span>
            Christmas
            <span className="xmas-tree xmas-tree--flip">
              <ChristmasTree />
            </span>
          </h1>
          <p className="xmas-lede">at Alan and Marla's House</p>
        </div>
        <div className="xmas-when">
          <a
            className="xmas-when-link xmas-when-date"
            href={`${import.meta.env.BASE_URL}christmas-party.ics`}
            aria-label="Add December 20, 2026 at 6:00 PM to your calendar"
          >
            <span>December 20, 2026</span>
            <span className="xmas-when-time">6:00 PM</span>
            <i className="bi bi-calendar-plus xmas-when-icon" aria-hidden="true"></i>
          </a>
          <a
            className="xmas-when-link xmas-when-address"
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open 2326 N 32nd St, Mesa, AZ 85213 in maps"
          >
            <span>2326 N 32nd St</span>
            <span>
              Mesa, AZ 85213
              <i className="bi bi-geo-alt xmas-when-icon" aria-hidden="true"></i>
            </span>
          </a>
        </div>
      </section>
      <section className="xmas-card xmas-bring">
        <h2 className="xmas-title">What to Bring</h2>
        <ul>
          <li>
            <span className="xmas-bring-icon">
              <TacoIcon />
            </span>
            Mexican Dish
          </li>
          <li>
            <span className="xmas-bring-icon">
              <GiftIcon />
            </span>
            Ages 12+ - $20 or less white
            elephant gift
          </li>
          <li>
            <span className="xmas-bring-icon">
              <SantaHatIcon />
            </span>
            Ages 5-11 - $15 or less white
            elephant gift
          </li>
          <li>
            <span className="xmas-bring-icon">
              <LawnChairIcon />
            </span>
            Lawn chair (optional)
          </li>
          <li>
            <span className="xmas-bring-icon">
              <ShepherdCrookIcon />
            </span>
            Any nativity costumes you might
            have
          </li>
        </ul>
      </section>
      <h2 className="xmas-count">
        Confirmed Attending:{" "}
        <span className="xmas-count-number">{rsvped}</span>
      </h2>
      {cardInfo.map((card, i) => (
        <section key={i} id={card.title} className="xmas-card xmas-list">
          <h2 className="xmas-title">{card.title}</h2>
          {card.subtitle && <p className="xmas-subtitle">{card.subtitle}</p>}
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
          <div className="xmas-rows">
            {card.data.map((item, j) => {
              return editing && editCardNumber === i ? (
                <div key={j} className="xmas-edit-row fade-in">
                  <input
                    className={`xmas-input ${deleting && rowToDelete === j && "deleting"
                      }`}
                    type="text"
                    value={newData[j][0]}
                    onChange={(e) => handleChange(e, j, 0)}
                  />
                  <input
                    className={`xmas-input ${deleting && rowToDelete === j && "deleting"
                      }`}
                    type="text"
                    value={newData[j][1]}
                    onChange={(e) => handleChange(e, j, 1)}
                  />
                  <button
                    type="button"
                    className="xmas-trash"
                    aria-label={`Remove ${item[0]}`}
                    onClick={() => toggleDelete(j)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      aria-hidden="true"
                    >
                      <path
                        d="M9 3V2h6v1h5v2H4V3h5zm2 4h2v12h-2V7zm-4 0h2v12H7V7zm10 0h-2v12h2V7zM5 5v16h14V5H5z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div key={j} className="xmas-row truncated-container fade-in">
                  <p className="xmas-row-name truncated-text">{item[0]}</p>
                  <p
                    className={`xmas-row-value truncated-text truncated-text-e ${card.title === "Attendees" || card.title === "Tables"
                      ? "xmas-row-value--count"
                      : ""
                      }`}
                  >
                    {item[1]}
                  </p>
                </div>
              );
            })}
            {adding && editCardNumber === i && (
              <div className="xmas-edit-row">
                <input
                  className="xmas-input"
                  type="text"
                  placeholder="Name of Family"
                  onChange={(e) => handleChange(e, newData.length - 1, 0)}
                />
                <input
                  className="xmas-input"
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
          </div>
          {(adding && editCardNumber === i) ||
            (editing && editCardNumber === i) ? (
            <div className="xmas-actions">
              {deleting ? (
                <button
                  className="xmas-btn xmas-btn-danger"
                  onClick={() => saveData(false, i)}
                >
                  Delete Selected
                </button>
              ) : (
                <button
                  className="xmas-btn xmas-btn-primary"
                  onClick={() => checkIfNewAttendeeAndSave(i)}
                >
                  Save
                </button>
              )}
              <button
                className="xmas-btn xmas-btn-secondary"
                onClick={clearStates}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="xmas-actions">
              <button
                className="xmas-btn xmas-btn-primary"
                onClick={() => toggleAddOrEdit(i, true)}
              >
                Add to {card.title}
              </button>
              <button
                className="xmas-btn xmas-btn-secondary"
                onClick={() => toggleAddOrEdit(i, false)}
              >
                Make Change to{" "}
                {card.title === "Miscellaneous" ? "Misc." : card.title}
              </button>
            </div>
          )}
        </section>
      ))}
    </div>
  );
};

export default ChristmasSignUp;
