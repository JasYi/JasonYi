import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import uniqid from "uniqid";
import EntryList from "../components/EntryList";
import Papa from "papaparse";
import { restaurantData } from "../data";
const LOCAL_STORAGE_KEY = "GETLIST";

/*const fs = require("fs");
const { parse } = require("csv-parse");*/

export default function Home({ restaurantList }) {
  const [rests, setRests] = useState([]);
  const nameref = useRef();
  const addressref = useRef();
  const cuisineref = useRef();
  const radioref = useRef();
  const nameAddressRef = useRef();

  const restList = restaurantList;

  //gets information from local storage on start of app
  useEffect(() => {
    const storedRests = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedRests) setRests(storedRests);
    console.log(rests);
  }, []);

  //sets info in local storage whenever rests is changed
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rests));
  }, [rests]);

  //adds resturaunt
  function handleAddRestaurant(e) {
    //using the dropdown menu
    var name = "";
    var address = "";
    var longitude = "";
    var latitude = "";
    var restID;
    if (nameAddressRef.current.value != null)
      restID = nameAddressRef.current.value;
    console.log(restID.toString());
    restList.forEach((entry) => {
      if (entry.PermitID.toString() === restID.toString()) {
        name = entry.Name;
        address = entry.Address;
        longitude = entry.Longitude;
        latitude = entry.Lattitude;
      }
    });
    console.log(name + " " + address);

    //checking the form
    if (nameref.current.value != "") name = nameref.current.value;
    if (addressref.current.value != "") address = addressref.current.value;

    //checking cuisine and price
    var cuisine;
    if (cuisineref.current.value != "") cuisine = cuisineref.current.value;
    else cuisine = "???";
    console.log(cuisine);
    var price;
    if (document.querySelector('input[name="price"]:checked') != null) {
      price = document.querySelector('input[name="price"]:checked').value;
      console.log(price);
    } else price = "???";
    console.log(price + " price");

    //if (name === "" || cuisine === "" || price === null) return;
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
          longitude: longitude,
          latitude: latitude,
        },
      ];
    });

    console.log(rests);
    console.log(name + " " + longitude + " " + latitude);

    nameref.current.value = null;
    addressref.current.value = null;
    cuisineref.current.value = null;
    if (document.querySelector('input[name="price"]:checked') != null)
      document.querySelector('input[name="price"]:checked').checked = false;
    nameAddressRef.current.value = "";
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
          <div className="m-3">
            <label>Name and Address: </label>
            <select
              name="name-address"
              ref={nameAddressRef}
              className="border-2 border-black rounded"
            >
              <option value="">--Search for Restaurant Here--</option>
              {restList.map((restName) => {
                return (
                  <option value={restName.PermitID.toString()}>
                    {restName.Name} | {restName.Address}
                  </option>
                );
              })}
            </select>
          </div>

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
        <div className="mt-[7.5rem] mx-7">
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

//
export const getStaticProps = async () => {
  const dataOut = restaurantData.map((entry) => {
    let entryOut = { ...entry };
    entryOut.Name = toTitleCase(entry.Name);
    entryOut.Address = toTitleCase(entry.Address);
    return entryOut;
  });

  return { props: { restaurantList: dataOut } };
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
