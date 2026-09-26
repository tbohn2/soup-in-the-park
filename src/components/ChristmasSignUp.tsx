"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import loadingLogo from "@/assets/christmas/star.png";
import { CHRISTMAS_EVENT } from "@/lib/events";
import type { SignupBoard } from "@/lib/signups";
import { useSignupEditor } from "./useSignupEditor";

export default function ChristmasSignUp({ initialBoard }: { initialBoard: SignupBoard }) {
  const s = useSignupEditor(CHRISTMAS_EVENT, initialBoard);
  const reminderTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(reminderTimer.current), []);

  const saveAndRemind = async () => {
    const isNewAttendee = await s.save();
    if (!isNewAttendee) return;
    s.setError("Thank you! Don't forget to enter how many people you are bringing!");
    clearTimeout(reminderTimer.current);
    reminderTimer.current = setTimeout(() => s.setError(null), 7000);
    document.getElementById("Attendees")?.scrollIntoView({ behavior: "smooth" });
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
      {s.error && <div className="alert alert-info fw-bold text-center fs-4">{s.error}</div>}
      <p className="welcome-text sign-up-card my-3 p-3 col-xl-6 col-lg-8 col-md-9 col-11 fs-3 fw-bold text-center d-flex flex-column align-items-center">
        The tradition continues! Come to Alan and Marla&apos;s House in celebration of
        <span id="christmas" className="my-1">
          Christmas
        </span>
        Please sign up for what you would like to bring and how many people are coming.
      </p>
      <div className="event-details text-center my-3 p-3 col-xl-6 col-lg-8 col-md-9 col-11 fs-3">
        <h2>What to Bring</h2>
        <ul>
          <li>
            <span className="emoji">🌮</span>Mexican Dish
          </li>
          <li>
            <span className="emoji">🎁</span>Ages 12+ - $15 or less white-elephant gift
          </li>
          <li>
            <span className="emoji">🎅🏻</span>Ages 5-11 - $10 or less white elephant gift
          </li>
          <li>
            <span className="emoji">🪑</span>Lawn Chair (optional)
          </li>
          <li>
            <span className="emoji">👗</span>Any nativity costumes you might have
          </li>
        </ul>
      </div>
      <h2 className="confirmed-count col-lg-6 col-md-8 col-11 rounded p-2 my-2 text-center fw-bold bg-light-green">
        Confirmed Attending: {s.rsvped}
      </h2>
      {CHRISTMAS_EVENT.categories.map((card, i) => {
        const isActive = s.editCardNumber === i;
        return (
          <div
            key={card.key}
            id={card.title}
            className="sign-up-card my-3 p-2 col-xl-6 col-lg-8 col-md-9 col-11 d-flex flex-column align-items-center"
          >
            <h2 className=" text-center">{card.title}</h2>
            {card.subtitle && <p className="text-center text-muted mb-3">{card.subtitle}</p>}
            {s.savingCard === i && (
              <div className="fade-in-out spinner-container my-4">
                <Image
                  className="img-fluid w-75 h-auto"
                  style={{ maxWidth: "100px", animation: "spinner-border 2s linear infinite" }}
                  src={loadingLogo}
                  alt="loading logo"
                />
              </div>
            )}
            {s.rowsFor(i).map((item, j) =>
              s.editing && isActive ? (
                <div key={item.id} className="fade-in fs-3 d-flex align-items-center col-md-11 col-12">
                  <input
                    className={`col-6 m-0 p-1 ${s.isMarked(j) ? "deleting" : ""}`}
                    type="text"
                    value={s.draft[j].name}
                    onChange={(e) => s.handleChange(j, "name", e.target.value)}
                  />
                  <input
                    className={`col-5 m-0 p-1 ${s.isMarked(j) ? "deleting" : ""}`}
                    type="text"
                    value={s.draft[j].detail}
                    onChange={(e) => s.handleChange(j, "detail", e.target.value)}
                  />
                  <div>
                    <svg
                      className="trash"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 32 32"
                      width="40"
                      height="40"
                      onClick={() => s.toggleDelete(j)}
                    >
                      <path d="M9 3V2h6v1h5v2H4V3h5zm2 4h2v12h-2V7zm-4 0h2v12H7V7zm10 0h-2v12h2V7zM5 5v16h14V5H5z" fill="red" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div key={item.id} className="truncated-container px-1 fade-in border fs-3 d-flex justify-content-between col-md-11 col-12">
                  <p className="my-0 me-3 p-1 truncated-text">{item.name}</p>
                  <p className={`m-0 p-1 truncated-text truncated-text-e ${card.numeric ? "text-end" : "col-md-6"}`}>{item.detail}</p>
                </div>
              ),
            )}
            {s.adding && isActive && (
              <div className="d-flex justify-content-between col-md-11 col-12 fs-3">
                <input
                  className="col-7"
                  type="text"
                  placeholder={card.placeholder1}
                  onChange={(e) => s.handleChange(s.draft.length - 1, "name", e.target.value)}
                />
                <input
                  className="col-5"
                  type="text"
                  placeholder={card.placeholder2}
                  onChange={(e) => s.handleChange(s.draft.length - 1, "detail", e.target.value)}
                />
              </div>
            )}
            {(s.adding || s.editing) && isActive ? (
              <div className="d-flex col-12 flex-column align-items-center">
                {s.deleting ? (
                  <button className="custom-btn green-btn red-btn my-2 col-sm-8 col-12" onClick={saveAndRemind}>
                    Delete Selected
                  </button>
                ) : (
                  <button className="custom-btn green-btn my-2 btn-success col-sm-8 col-12" onClick={saveAndRemind}>
                    Save
                  </button>
                )}
                <button className="custom-btn blue-btn my-2 col-sm-8 col-12" onClick={s.clearStates}>
                  Cancel
                </button>
              </div>
            ) : (
              <div className="d-flex col-12 flex-column align-items-center">
                <button className="custom-btn green-btn my-2 col-sm-8 col-12" onClick={() => s.toggleAddOrEdit(i, true)}>
                  {card.addText}
                </button>
                <button className="custom-btn blue-btn my-2 col-sm-8 col-12" onClick={() => s.toggleAddOrEdit(i, false)}>
                  {card.editText}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
