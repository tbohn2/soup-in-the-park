"use client";

import { useState } from "react";
import { saveSignups } from "@/app/actions/signups";
import type { EventConfig } from "@/lib/events";
import type { SignupBoard, SignupRow } from "@/lib/signups";

type DraftRow = { id?: string; name: string; detail: string };

// Shared add/edit/delete state machine for both sign-up pages. The markup
// differs per theme, so each page renders its own cards from this state.
export function useSignupEditor(event: EventConfig, initialBoard: SignupBoard) {
  const [board, setBoard] = useState(initialBoard);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState<Set<number>>(() => new Set());
  const [editCardNumber, setEditCardNumber] = useState<number | null>(null);
  const [savingCard, setSavingCard] = useState<number | null>(null);
  const [draft, setDraft] = useState<DraftRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const rowsFor = (i: number): SignupRow[] => board[event.categories[i].key] ?? [];

  const sumFor = (i: number) =>
    rowsFor(i).reduce((total, row) => {
      const qty = parseInt(row.detail);
      return isNaN(qty) ? total : total + qty;
    }, 0);

  const attendeesIndex = event.categories.findIndex((c) => c.key === "attendees");
  const rsvped = attendeesIndex === -1 ? 0 : sumFor(attendeesIndex);

  const clearStates = () => {
    setAdding(false);
    setEditing(false);
    setRowsToDelete(new Set());
    setDraft([]);
    setEditCardNumber(null);
    setError(null);
  };

  const toggleAddOrEdit = (i: number, add: boolean) => {
    clearStates();
    const rows: DraftRow[] = rowsFor(i).map((r) => ({ ...r }));
    if (add) {
      rows.push({ name: "", detail: "" });
      setAdding(true);
    } else {
      setEditing(true);
    }
    setDraft(rows);
    setEditCardNumber(i);
  };

  const handleChange = (j: number, field: "name" | "detail", value: string) => {
    setDraft((prev) => prev.map((row, k) => (k === j ? { ...row, [field]: value } : row)));
  };

  const toggleDelete = (j: number) => {
    setRowsToDelete((prev) => {
      const next = new Set(prev);
      if (next.has(j)) next.delete(j);
      else next.add(j);
      return next;
    });
  };

  // Returns true when the save added someone who hasn't RSVPed yet, so the
  // page can remind them to fill in attendees.
  const save = async (): Promise<boolean> => {
    if (editCardNumber === null) return false;
    const i = editCardNumber;
    const category = event.categories[i].key;
    const original = new Map(rowsFor(i).map((r) => [r.id, r]));

    const create = adding ? draft[draft.length - 1] : undefined;
    const deleteIds = [...rowsToDelete].map((j) => draft[j]?.id).filter((id): id is string => !!id);
    const updates = draft
      .filter((r): r is Required<DraftRow> => !!r.id && !deleteIds.includes(r.id))
      .filter((r) => {
        const before = original.get(r.id);
        return !before || before.name !== r.name || before.detail !== r.detail;
      })
      .map(({ id, name, detail }) => ({ id, name, detail }));

    const isNewAttendee =
      !!create &&
      category !== "attendees" &&
      !(board.attendees ?? []).some((a) => a.name.toLowerCase().trim() === create.name.toLowerCase().trim());

    setSavingCard(i);
    setError(null);
    try {
      const result = await saveSignups({
        event: event.key,
        category,
        create: create && { name: create.name, detail: create.detail },
        updates,
        deleteIds,
      });
      if (!result.ok) {
        setError(result.error);
        return false;
      }
      setBoard(result.board);
      clearStates();
      return isNewAttendee;
    } catch (err) {
      console.error("Error saving data:", err);
      setError("Error saving data; try again later");
      return false;
    } finally {
      setSavingCard(null);
    }
  };

  return {
    board,
    rowsFor,
    rsvped,
    adding,
    editing,
    deleting: rowsToDelete.size > 0,
    isMarked: (j: number) => rowsToDelete.has(j),
    editCardNumber,
    savingCard,
    draft,
    error,
    setError,
    clearStates,
    toggleAddOrEdit,
    toggleDelete,
    handleChange,
    save,
  };
}
