import React from "react";

export default function entry({ rest, toggleVisited, delItem }) {
  function handleToggleClick() {
    toggleVisited(rest.id);
  }

  function handleDelClick() {
    delItem(rest.id);
  }

  return (
    <>
      <div>
        <h3>{rest.name}</h3>
        <h2>{rest.address}</h2>
        <h2>{rest.cuisine}</h2>
        <h2>{rest.price}</h2>
        <label>Visited: </label>
        <input
          type="checkbox"
          checked={rest.visited}
          onChange={handleToggleClick}
        ></input>
        <button onClick={handleDelClick}>Delete</button>
      </div>
    </>
  );
}
