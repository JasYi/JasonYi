import { loadGetInitialProps } from "next/dist/shared/lib/utils";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import uniqid from "uniqid";
import EntryList from "../components/EntryList";
import Papa from "papaparse";
import { restaurantData } from "../data";
const LOCAL_STORAGE_KEY = "GETLIST";
const GEOCODE_KEY = "47c61b7956bd9c7c2f5774eaaff686b7";

const axios = require("axios");

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
    if (storedRests) {
      var tempRests = [...storedRests];

      setRests(tempRests);
      console.log(tempRests);

      //if (storedRests) setRests(storedRests);

      console.log(rests);
    }
    /*
    var tempRests = [...rests];

    tempRests.map(async function (rest) {
      if (longitude == 0 && latitude == 0) {
        await fetch(
          "http://api.positionstack.com/v1/forward?access_key=" +
            GEOCODE_KEY +
            "&query=" +
            address +
            "&output=json"
        )
          .then((response) => response.json())
          .then((data) => {
            longitude = data.data[0].longitude;
            latitude = data.data[0].latitude;
            console.log(longitude + " " + latitude + " adding");
            rest.longitude = longitude;
            rest.latitude = latitude;
          });
        //end of geocoding API call
      }
    });

    setRests(tempRests);
    console.log(tempRests);*/
  }, []);

  //sets info in local storage whenever rests is changed
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(rests));
    console.log(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)));
  }, [rests]);

  //adds resturaunt
  async function handleAddRestaurant(e) {
    //using the dropdown menu
    var name = "";
    var address = "";
    var longitude = 0;
    var latitude = 0;
    var idOut = uniqid();
    var restID;
    if (nameAddressRef.current.value != null)
      restID = nameAddressRef.current.value;
    console.log(restID.toString());
    restList.forEach((entry) => {
      if (entry.PermitID.toString() === restID.toString()) {
        name = entry.Name;
        address = entry.Address;
        longitude = parseFloat(entry.Longitude);
        latitude = parseFloat(entry.Lattitude);
      }
    });
    console.log(name + " " + address + " name address");

    //checking the form
    if (nameref.current.value != "") name = nameref.current.value;
    if (addressref.current.value != "") address = addressref.current.value;

    console.log(address + " address");

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

    //converting address to longitude and latitude
    if (address.length >= 1) {
      console.log("in if");
      const params = {
        access_key: "47c61b7956bd9c7c2f5774eaaff686b7",
        query: address,
      };
      await axios
        .get("http://api.positionstack.com/v1/forward", { params })
        .then((response) => {
          var arr = [1, 2, 3];
          const res = response.data;
          console.log(response.data.data[0]);
          console.log("response ^");
          longitude = response.data.data[0].longitude;
          latitude = response.data.data[0].latitude;
        })
        .catch((error) => {
          console.log(error);
        });
      /*await fetch(
        "http://api.positionstack.com/v1/forward?access_key=" +
          GEOCODE_KEY +
          "&query=" +
          address +
          "&output=json"

        http://api.positionstack.com/v1/forward?access_key= YOUR_ACCESS_KEY
    & query = 1600 Pennsylvania Ave NW, Washington DC
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            //LEFT OFF 1/13/23: data is not returning anything this is a problem
            longitude = data.data[0].longitude;
            latitude = data.data[0].latitude;
          }
          console.log(longitude + " " + latitude + " adding");
        });*/
      //end of geocoding API call
    }

    //if (name === "" || cuisine === "" || price === null) return;
    setRests((prevRests) => {
      return [
        ...prevRests,
        {
          id: idOut,
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

    nameref.current.value = "";
    addressref.current.value = "";
    cuisineref.current.value = "";
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
        <h1 className="text-center text-lg">Bytes</h1>
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
                  <option
                    key={restName.PermitID}
                    value={restName.PermitID.toString()}
                  >
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

function restNameCompare(a, b) {
  return a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
}

//
export const getStaticProps = async () => {
  var dataOut = restaurantData.map((entry) => {
    let entryOut = { ...entry };
    entryOut.Name = toTitleCase(entry.Name);
    entryOut.Address = toTitleCase(entry.Address);
    return entryOut;
  });

  const returnData = dataOut.sort(restNameCompare);

  return { props: { restaurantList: returnData } };
};

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
