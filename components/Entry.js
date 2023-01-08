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
      <div className=" border-y-2 border-black py-2">
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
        <button onClick={handleDelClick} className='border-2 border-black rounded-full p-1'>Delete</button>
      </div>
    </>
  );
}
