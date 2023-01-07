import React from "react";
import Entry from "../components/Entry";

export default function EntryList({ rests, toggleVisited, delItem }) {
  return rests.map((rest) => {
    return (
      <>
        <Entry
          key={rest.id}
          rest={rest}
          toggleVisited={toggleVisited}
          delItem={delItem}
        />
      </>
    );
  });
}
