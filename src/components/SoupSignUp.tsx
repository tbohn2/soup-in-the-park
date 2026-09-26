"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { SOUP_AFTER, SOUP_EVENT, type SignupCategory } from "@/lib/events";
import type { SignupBoard } from "@/lib/signups";
import { CrossOutIcon, PencilIcon, PlusIcon, UndoIcon } from "./icons";
import { useSignupEditor } from "./useSignupEditor";

type Editor = ReturnType<typeof useSignupEditor>;

export default function SoupSignUp({ initialBoard }: { initialBoard: SignupBoard }) {
  const s = useSignupEditor(SOUP_EVENT, initialBoard);

  return (
    <>
      <svg width="0" height="0" aria-hidden="true" className="svg-defs">
        <filter id="paper-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .32  0 0 0 .22 0" />
        </filter>
      </svg>

      <section className="count wrap">
        <p className="patch" aria-live="polite">
          <span className="patch-label">Confirmed Attending:</span>
          <span className="count-number">{s.rsvped}</span>
        </p>
        <a href="#sheet-attendees" className="key key-add key-lg count-rsvp">
          <PlusIcon />
          RSVP
        </a>
        <p className="after-note">
          <strong>After:</strong> {SOUP_AFTER}
        </p>
      </section>

      <section className="sheets-intro wrap">
        <h2>Sign-up sheets</h2>
        <p>Write your family in on any sheet below.</p>
      </section>

      {/* Two independent columns so a short sheet rises to meet the one above it.
          Sheets alternate between them, so one never jumps columns while it's edited. */}
      <div className="sheets wrap">
        {[0, 1].map((column) => (
          <div key={column} className="sheet-column">
            {SOUP_EVENT.categories.map((card, i) =>
              i % 2 === column ? <Sheet key={card.key} card={card} index={i} s={s} /> : null,
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Sheet({ card, index, s }: { card: SignupCategory; index: number; s: Editor }) {
  const rows = s.rowsFor(index);
  const active = s.editCardNumber === index;
  const saving = s.savingCard === index;
  const titleId = `sheet-${card.key}-title`;
  const detailMode = card.numeric ? "numeric" : "text";
  // Counts only need a couple of digits, so the name gets the rest of the line
  const detailClass = card.numeric ? "line-input line-input-detail line-input-count" : "line-input line-input-detail";

  const addingHere = active && s.adding;

  // Cancelling a new line folds it shut first; the editor clears once the fold finishes
  const [closing, setClosing] = useState(false);

  // Opening a sheet puts the cursor in its first family name: the new line when
  // adding, the top line when editing. The inputs render synchronously so the
  // focus happens inside the tap itself, which phones require to raise the keyboard.
  const firstNameRef = useRef<HTMLInputElement>(null);
  const open = (add: boolean) => {
    setClosing(false);
    flushSync(() => s.toggleAddOrEdit(index, add));
    firstNameRef.current?.focus({ preventScroll: true });
  };

  const cancel = () => {
    if (closing) return;
    if (addingHere) setClosing(true);
    else s.clearStates();
  };

  const primaryLabels = [
    <>
      <PlusIcon />
      {card.addText}
    </>,
    "Save",
    "Save changes",
    "Saving...",
  ];
  const secondaryLabels = [
    <>
      <PencilIcon />
      Edit the list
    </>,
    "Cancel",
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void s.save();
  };

  return (
    <article className="stack" id={`sheet-${card.key}`} aria-labelledby={titleId} style={{ order: index }}>
      <form className="sheet" onSubmit={handleSubmit}>
        <svg className="grain" aria-hidden="true">
          <rect width="100%" height="100%" filter="url(#paper-grain)" />
        </svg>
        <span className="hole hole-top" aria-hidden="true" />
        <span className="hole hole-mid" aria-hidden="true" />
        <span className="hole hole-bottom" aria-hidden="true" />
        <span className="tape" aria-hidden="true" />

        <header className="sheet-head">
          <h3 id={titleId}>
            {card.title}
            <svg className="underline" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 8 C 40 3, 90 10, 130 5 S 185 4, 198 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            </svg>
          </h3>
        </header>

        <div className={`sheet-rows${rows.length === 0 ? " is-empty" : ""}`}>
          {active && s.editing
            ? s.draft.map((row, j) => {
                const struck = s.isMarked(j);
                const label = row.name || `row ${j + 1}`;
                return (
                  <div key={row.id ?? j} className={`sheet-row is-editing${struck ? " is-struck" : ""}`}>
                    <input
                      ref={j === 0 ? firstNameRef : undefined}
                      className="line-input"
                      aria-label={`${card.placeholder1}, row ${j + 1}`}
                      value={row.name}
                      maxLength={100}
                      disabled={struck || saving}
                      onChange={(e) => s.handleChange(j, "name", e.target.value)}
                    />
                    <input
                      className={detailClass}
                      aria-label={`${card.placeholder2}, row ${j + 1}`}
                      value={row.detail}
                      maxLength={100}
                      inputMode={detailMode}
                      disabled={struck || saving}
                      onChange={(e) => s.handleChange(j, "detail", e.target.value)}
                    />
                    <button
                      type="button"
                      className="cross-out"
                      aria-pressed={struck}
                      aria-label={struck ? `Keep ${label}` : `Cross out ${label}`}
                      disabled={saving}
                      onClick={() => s.toggleDelete(j)}
                    >
                      {struck ? <UndoIcon /> : <CrossOutIcon />}
                    </button>
                  </div>
                );
              })
            : rows.map((row) => (
                <div key={row.id} className="sheet-row">
                  <span>{row.name}</span>
                  <span className="sheet-detail">{row.detail}</span>
                </div>
              ))}

          {addingHere && (
            <div
              className={`sheet-row is-editing is-new${closing ? " is-closing" : ""}`}
              onAnimationEnd={(e) => {
                if (!e.animationName.startsWith("line-close")) return;
                setClosing(false);
                s.clearStates();
              }}
            >
              <input
                ref={firstNameRef}
                className="line-input"
                aria-label={card.placeholder1}
                placeholder={card.placeholder1}
                value={s.draft[s.draft.length - 1]?.name ?? ""}
                maxLength={100}
                disabled={saving}
                onChange={(e) => s.handleChange(s.draft.length - 1, "name", e.target.value)}
              />
              <input
                className={detailClass}
                aria-label={card.placeholder2}
                placeholder={card.placeholder2}
                value={s.draft[s.draft.length - 1]?.detail ?? ""}
                maxLength={100}
                inputMode={detailMode}
                disabled={saving}
                onChange={(e) => s.handleChange(s.draft.length - 1, "detail", e.target.value)}
              />
            </div>
          )}

        </div>

        {/* The same two keys stay put through every state; only their labels
            cross-fade. Each sizes to its widest label so it never resizes. The
            primary key is always a submit button: when it opens the sheet it
            cancels the submit itself, so the tap can't send an empty line. */}
        <div className="sheet-foot">
          <button
            type="submit"
            className="key key-add"
            disabled={saving}
            onClick={(e) => {
              if (active) return;
              e.preventDefault();
              open(true);
            }}
          >
            <KeyLabel options={primaryLabels} show={!active ? 0 : saving ? 3 : s.deleting ? 2 : 1} />
          </button>
          {(active || rows.length > 0) && (
            <button type="button" className="key key-edit" disabled={saving} onClick={active ? cancel : () => open(false)}>
              <KeyLabel options={secondaryLabels} show={active ? 1 : 0} />
            </button>
          )}
        </div>

        {active && s.error && (
          <p className="red-pen" role="alert">
            {s.error}
          </p>
        )}
      </form>
    </article>
  );
}

// Stacks every label a key can show in one cell and shows only the current one,
// so the key is always as wide as its widest label
function KeyLabel({ options, show }: { options: React.ReactNode[]; show: number }) {
  return (
    <span className="key-label">
      {options.map((option, i) => (
        <span key={i} className={i === show ? undefined : "key-label-ghost"} aria-hidden={i !== show || undefined}>
          {option}
        </span>
      ))}
    </span>
  );
}
