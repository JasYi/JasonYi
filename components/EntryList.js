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
    compA = 4;
    compB = 4;
    switch (a) {
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
    switch (b) {
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
    return compA - compB;
  }

  function compareVisited(a, b) {
    aComp = 0;
    bComp = 0;
    if (a.visited) aComp = 1;
    if (b.visited) bComop = 1;
    return aComp - bComop;
  }

  //filters out the entries
  function onFilterClick() {
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
    else setRestsOut(tempRestsOut);
  }

  return (
    <>
      {/*div for the filters*/}
      <div className="fixed w-1/6">
        {/*div for sort*/}
        <div className="mt-3">
          <label for="sort-by">Sort By:</label>
          <select name="sort" id="sort-by" ref={sortRef}>
            <option value="">--Choose an Option--</option>
            <option value="name">Name</option>
            <option value="cuisine">Cuisine</option>
            <option value="price">Price</option>
            <option value="visited">Visited</option>
          </select>
        </div>
        {/*div for visited or not*/}
        <div className="mt-3">
          <label for="visitedQuestion">Visited </label>
          <input type="checkbox" id="visitedQuestion" ref={visitedRef}></input>
          <label for="notVisitedQuestion">Not Visited</label>
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
          className="border-2 p-1 border-black rounded-full mt-3"
        >
          Apply Filters
        </button>
      </div>

      {/*div for the entries*/}
      <div className="inline-block w-5/6 float-right">
        {restsOut.map((rest) => {
          return (
            <>
              <Entry
                key={rest.id}
                rest={rest}
                toggleVisited={toggleVisited}
                delItem={delItem}
                changeNotes={changeNotes}
              />
            </>
          );
        })}
      </div>
    </>
  );
}
