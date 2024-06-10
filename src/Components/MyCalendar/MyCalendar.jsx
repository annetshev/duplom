import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import { format } from "date-fns";
import { uk } from "date-fns/locale";
import "react-calendar/dist/Calendar.css";
import "./Calendar.scss";

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [currentNote, setCurrentNote] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || {};
    setNotes(savedNotes);
  }, []);

  const onDateChange = (date) => {
    setDate(date);
    setCurrentNote(notes[date.toDateString()] || "");
    setIsEditing(true);
  };

  const handleNoteChange = (event) => {
    setCurrentNote(event.target.value);
  };

  const saveNote = () => {
    const newNotes = {
      ...notes,
      [date.toDateString()]: currentNote,
    };
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
    setIsEditing(false);
  };

  const deleteNote = () => {
    const newNotes = { ...notes };
    delete newNotes[date.toDateString()];
    setNotes(newNotes);
    localStorage.setItem("notes", JSON.stringify(newNotes));
    setCurrentNote("");
    setIsEditing(false);
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const note = notes[date.toDateString()];
      return note ? <div className="tile-note">{note}</div> : null;
    }
    return null;
  };

  return (
    <div className="calendar-page">
      <Calendar
        onChange={onDateChange}
        value={date}
        locale="uk-UA"
        formatShortWeekday={(locale, date) =>
          format(date, "EEEEEE", { locale: uk })
        }
        formatMonthYear={(locale, date) =>
          date
            .toLocaleString("uk-UA", { month: "long", year: "numeric" })
            .charAt(0)
            .toUpperCase() +
          date
            .toLocaleString("uk-UA", { month: "long", year: "numeric" })
            .slice(1)
        }
        className="calendar"
        tileContent={tileContent}
      />
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setIsEditing(false)}>
              &times;
            </span>
            <h2>Подія на {format(date, "PPPP", { locale: uk })}</h2>
            <textarea
              value={currentNote}
              onChange={handleNoteChange}
              placeholder="Введіть подію тут..."
            />
            <button onClick={saveNote}>Зберегти</button>
            {currentNote && (
              <button onClick={deleteNote} style={{ marginLeft: "10px" }}>
                Видалити
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
