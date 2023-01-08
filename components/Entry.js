import React, { useState, useRef, useEffect } from "react";

export default function entry({ rest, toggleVisited, delItem, changeNotes }) {
  const notesRef = useRef();

  function handleToggleClick() {
    toggleVisited(rest.id);
  }

  function handleDelClick() {
    delItem(rest.id);
  }

  function handleNotesChange() {
    const notesIn = notesRef.current.value;
    changeNotes(rest.id, notesIn);
  }

  return (
    <>
      <div className=" border-b-2 border-black py-2">
        <div className="inline-block">
          <h3>{rest.name}</h3>
          <h2>{rest.address}</h2>
          <h2>Cuisine: {rest.cuisine}</h2>
          <h2>Price: {rest.price}</h2>
          <div>
            <label>Visited: </label>
            <input
              type="checkbox"
              checked={rest.visited}
              onChange={handleToggleClick}
            ></input>
          </div>
          <button
            onClick={handleDelClick}
            className="border-2 border-black rounded-full p-1"
          >
            Delete
          </button>
        </div>
        {/*Notes Div*/}
        <div className="inline-block align-top p-3">
          <label className="block">Notes:</label>
          <textarea
            rows="4"
            cols="50"
            className="border-2 border-black"
            onChange={handleNotesChange}
            ref={notesRef}
          >
            {rest.notes}
          </textarea>
        </div>
      </div>
    </>
  );
}
