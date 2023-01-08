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

  //gets information from local storage on start of app
  useEffect(() => {
    const storedRests = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedRests) setRests(storedRests);
  }, []);

  //sets info in local storage whenever rests is changed
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rests));
  }, [rests]);

  //adds resturaunt
  function handleAddRestaurant(e) {
    const name = nameref.current.value;
    const address = addressref.current.value;
    const cuisine = cuisineref.current.value;
    var price = document.querySelector('input[name="price"]:checked').value;

    console.log(price);

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
          notes: "",
        },
      ];
    });
    nameref.current.value = null;
    addressref.current.value = null;
    cuisineref.current.value = null;
    document.querySelector('input[name="price"]:checked').checked = false;
  }

  //changes rest value when visited is checked
  function toggleVisited(id) {
    const newRests = [...rests];
    const rest = newRests.find((rest) => rest.id === id);
    rest.visited = !rest.visited;
    setRests(newRests);
  }

  //changes the notes information
  function changeNotes(id, notes) {
    const newRests = [...rests];
    const rest = newRests.find((rest) => rest.id === id);
    rest.notes = notes;
    console.log(notes);
    setRests(newRests);
    console.log(rests);
  }

  /*function delReview(id) {
    const newRests = rests.filter((rest) => id === rest.id);
    setRests(newRests);
  }*/

  //deletes items from rests
  function delItem(id) {
    const newRests = rests.filter((rest) => !(rest.id === id));
    setRests(newRests);
  }

  return (
    <>
      <div className="">
        {/*top navbar div*/}
        <div className="mx-auto fixed inset-x-0 top-0 text-center bg-stone-200 py-5">
          <div className="inline-block mx-3">
            <label>Name</label>
            <input
              type="text"
              name="name"
              ref={nameref}
              className="border-2 border-black rounded ml-1"
            ></input>
          </div>
          <div className="inline-block mx-3">
            <label>Address</label>
            <input
              type="text"
              name="address"
              ref={addressref}
              className="border-2 border-black rounded ml-1"
            ></input>
          </div>
          <div className="inline-block mx-3">
            <label>Cuisine</label>
            <input
              type="text"
              name="cuisine"
              ref={cuisineref}
              className="border-2 border-black rounded ml-1"
            ></input>
          </div>
          <div className="inline-block mx-3">
            <label>Price </label>
            <label> $</label>
            <input type="radio" name="price" value="$" ref={radioref}></input>
            <label> $$</label>
            <input type="radio" name="price" value="$$" ref={radioref}></input>
            <label> $$$</label>
            <input type="radio" name="price" value="$$$" ref={radioref}></input>
            <label> ???</label>
            <input type="radio" name="price" value="???" ref={radioref}></input>
          </div>
          <div className="inline-block mx-3">
            <button
              onClick={handleAddRestaurant}
              className=" p-1 border-2 border-black rounded-full"
            >
              Add Restaurant
            </button>
          </div>
        </div>

        {/*where all of the restaurants are displayed*/}
        <div className="mt-[4.5rem] mx-7">
          <EntryList
            rests={rests}
            toggleVisited={toggleVisited}
            delItem={delItem}
            changeNotes={changeNotes}
            className="float-left inline-block w-1/2"
          />
        </div>
      </div>
    </>
  );
}
