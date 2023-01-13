import React, { useState, useRef, useEffect } from "react";
import Entry from "../components/Entry";

export default function EntryList({
  rests,
  toggleVisited,
  delItem,
  changeNotes,
}) {
  const price1Ref = useRef();
  const price2Ref = useRef();
  const price3Ref = useRef();
  const price4Ref = useRef();
  const visitedRef = useRef();
  const notVisitedRef = useRef();
  const sortRef = useRef();

  const [location, setLocation] = useState({ longitude: 0, latitude: 0 });

  const [restsOut, setRestsOut] = useState([...rests]);

  //handles whenever the rests changes aka whenever someone adds something
  useEffect(() => {
    setRestsOut([...rests]);
    onFilterClick();
    console.log("useEffectCalled");
  }, [rests]);

  //comparison functions for the sort
  function compareName(a, b) {
    console.log(a.name.toLowerCase() - b.name.toLowerCase());
    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  function compareCuisine(a, b) {
    return a.cuisine.toLowerCase().localeCompare(b.name.toLowerCase());
  }

  function comparePrice(a, b) {
    var compA = 4;
    var compB = 4;
    switch (a.price) {
      case "$":
        compA = 1;
        break;
      case "$$":
        compA = 2;
        break;
      case "$$$":
        compA = 3;
        break;
    }
    switch (b.price) {
      case "$":
        compB = 1;
        break;
      case "$$":
        compB = 2;
        break;
      case "$$$":
        compB = 3;
        break;
    }
    console.log(compA + " " + compB);
    console.log(a + " " + b);
    return compA - compB;
  }

  function compareVisited(a, b) {
    var aComp = 0;
    var bComp = 0;
    if (a.visited) aComp = 1;
    if (b.visited) bComp = 1;
    return aComp - bComp;
  }

  function compareLocation(a, b) {
    console.log(
      location.longitude + " " + location.latitude + " curr location"
    );

    var distA = Math.sqrt(
      Math.pow(parseFloat(a.longitude) - parseFloat(location.longitude), 2) +
        Math.pow(parseFloat(a.latitude) - parseFloat(location.latitude), 2)
    );
    var distB = Math.sqrt(
      Math.pow(parseFloat(b.longitude) - parseFloat(location.longitude), 2) +
        Math.pow(parseFloat(b.latitude) - parseFloat(location.latitude), 2)
    );
    console.log(a.name + " 1 " + distA);
    console.log(b.name + " 2 " + distB);
    return distA - distB;
  }

  //filters out the entries
  function onFilterClick() {
    console.log(rests + " onFilterClick");

    var checked1 = price1Ref.current.checked;
    var checked2 = price2Ref.current.checked;
    var checked3 = price3Ref.current.checked;
    var checked4 = price4Ref.current.checked;
    var visitedQ = visitedRef.current.checked;
    var notVisitedQ = notVisitedRef.current.checked;

    //checks to see if they are all checked, if so then displays everything
    if (!checked1 && !checked2 && !checked3 && !checked4) {
      checked1 = true;
      checked2 = true;
      checked3 = true;
      checked4 = true;
    }

    if (!visitedQ && !notVisitedQ) {
      visitedQ = true;
      notVisitedQ = true;
    }

    var tempRestsOut = [...rests];

    tempRestsOut = tempRestsOut.filter((entry) => {
      return (
        ((checked1 && entry.price == "$") || //checking for price filter
          (checked2 && entry.price == "$$") ||
          (checked3 && entry.price == "$$$") ||
          (checked4 && entry.price == "???")) &&
        (entry.visited == visitedQ || !entry.visited == notVisitedQ) //checking for visited question filter
      );
    });

    //code for the sorting stuff
    var sortCategory = sortRef.current.value;
    if (sortCategory == "name") {
      setRestsOut(tempRestsOut.sort(compareName));
      console.log(tempRestsOut);
    } else if (sortCategory == "cuisine")
      setRestsOut(tempRestsOut.sort(compareCuisine));
    else if (sortCategory == "price")
      setRestsOut(tempRestsOut.sort(comparePrice));
    else if (sortCategory == "visited")
      setRestsOut(tempRestsOut.sort(compareVisited));
    else if (sortCategory == "location") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          //this gets current location then sorts based on that
          var currLat = position.coords.latitude;
          var currLong = position.coords.longitude;
          //alert(rests[0].latitude + " " + rests[0].longitude);
          setLocation({ longitude: currLong, latitude: currLat });
          setRestsOut(tempRestsOut.sort(compareLocation));
        }, geolocationError);
      }
    } else setRestsOut(tempRestsOut);
  }

  //handles if error
  function geolocationError(error) {
    console.log(error);
  }

  return (
    <>
      {/*div for the filters*/}
      <div className="fixed w-1/6 top-52 sm:top-32">
        {/*div for sort*/}
        <div className="text-sm sm:text-base sm:mt-3">
          <select
            name="sort"
            id="sort-by"
            ref={sortRef}
            className="border-2 border-black rounded"
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="cuisine">Cuisine</option>
            <option value="price">Price</option>
            <option value="visited">Visited</option>
            <option value="location">Location</option>
          </select>
        </div>
        {/*div for visited or not*/}
        <div className="mt-3">
          <label htmlFor="visitedQuestion">Visited </label>
          <input type="checkbox" id="visitedQuestion" ref={visitedRef}></input>
          <label htmlFor="notVisitedQuestion">Not Visited</label>
          <input type="checkbox" id="notVisitedQuestion" ref={notVisitedRef} />
        </div>
        {/*div for price range selector*/}
        <div className="mt-3">
          <h3 className="inline-block align-top">Price Range: </h3>
          <div className="inline-block">
            <div>
              <label>$</label>
              <input type="checkbox" value="$" ref={price1Ref} />
            </div>
            <div>
              <label>$$</label>
              <input type="checkbox" value="$$" ref={price2Ref} />
            </div>
            <div>
              <label>$$$</label>
              <input type="checkbox" value="$$$" ref={price3Ref} />
            </div>
            <div>
              <label>???</label>
              <input type="checkbox" value="???" ref={price4Ref} />
            </div>
          </div>
        </div>
        <button
          onClick={onFilterClick}
          className="border-2 sm:p-1 border-black rounded-full mt-3"
        >
          Apply Filters
        </button>
      </div>

      {/*div for the entries*/}
      <div className="inline-block w-3/6 sm:w-5/6 mt-20 sm:mt-0 float-right">
        {restsOut.map((rest) => (
          <Entry
            rest={rest}
            toggleVisited={toggleVisited}
            delItem={delItem}
            changeNotes={changeNotes}
          />
        ))}
      </div>
    </>
  );
}
