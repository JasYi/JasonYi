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
      <div className="">
        <div className="mx-auto fixed inset-x-0 top-0 text-center bg-stone-200 py-5">
          <div className='inline-block mx-3'>
            <label>Name</label>
            <input type="text" name="name" ref={nameref} className='border-2 border-black rounded ml-1'></input>
          </div>
          <div className='inline-block mx-3'>
            <label>Address</label>
            <input type="text" name="address" ref={addressref} className='border-2 border-black rounded ml-1'></input>
          </div>
          <div className='inline-block mx-3'>
            <label>Cuisine</label>
            <input type="text" name="cuisine" ref={cuisineref} className='border-2 border-black rounded ml-1'></input>
          </div>
          <div className='inline-block mx-3'>
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
          <div className='inline-block mx-3'>
            <button onClick={handleAddRestaurant} className=" p-1 border-2 border-black rounded-full">Add Restaurant</button>
          </div>
        </div>

        {/*where all of the restaurants are displayed*/}
        <div className='mt-[4.5rem] mx-7'>
          <EntryList
            rests={rests}
            toggleVisited={toggleVisited}
            delItem={delItem}
            className="float-left inline-block w-1/2"
          />
        </div>
      </div>
    </>
  );
}
