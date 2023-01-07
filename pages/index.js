import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import uniqid from "uniqid";
import EntryList from "../components/EntryList";
const LOCAL_STORAGE_KEY = "GETLIST";

export default function Home() {
  const [rests, setRests] = useState([]);
  const nameref = useRef();
  const addressref = useRef();
  const cuisineref = useRef();
  const radioref = useRef();

  useEffect(() => {
    const storedRests = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedRests) setRests(storedRests);
    console.log(storedRests);
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rests));
  }, [rests]);

  function handleAddRestaurant(e) {
    const name = nameref.current.value;
    const address = addressref.current.value;
    const cuisine = cuisineref.current.value;
    const price = radioref.current.value;

    if (name === "" || cuisine === "" || price === null) return;
    setRests((prevRests) => {
      return [
        ...prevRests,
        {
          id: uniqid(),
          name: name,
          address: address,
          cuisine: cuisine,
          price: price,
          visited: false,
        },
      ];
    });
    nameref.current.value = null;
    addressref.current.value = null;
    cuisineref.current.value = null;
    document.querySelector('input[name="price"]:checked').checked = false;
  }

  function toggleVisited(id) {
    const newRests = [...rests];
    const rest = newRests.find((rest) => rest.id === id);
    rest.visited = !rest.visited;
    setRests(newRests);
  }

  /*function delReview(id) {
    const newRests = rests.filter((rest) => id === rest.id);
    setRests(newRests);
  }*/

  function delItem(id) {
    const newRests = rests.filter((rest) => !(rest.id === id));
    setRests(newRests);
  }

  return (
    <>
      <EntryList
        rests={rests}
        toggleVisited={toggleVisited}
        delItem={delItem}
      />{" "}
      {/*where all of the restaurants are displayed*/}
      <div>
        <label>Name</label>
        <input type="text" name="name" ref={nameref}></input>

        <label>Address</label>
        <input type="text" name="address" ref={addressref}></input>

        <label>Cuisine</label>
        <input type="text" name="cuisine" ref={cuisineref}></input>

        <label>Price</label>
        <label>$</label>
        <input type="radio" name="price" value="$" ref={radioref}></input>
        <label>$$</label>
        <input type="radio" name="price" value="$$" ref={radioref}></input>
        <label>$$$</label>
        <input type="radio" name="price" value="$$$" ref={radioref}></input>
        <button onClick={handleAddRestaurant}>Add Restaurant</button>
      </div>
    </>
  );
}
