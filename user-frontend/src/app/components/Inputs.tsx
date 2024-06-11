"use client";

import { useState } from "react";
import { Placeholders } from "./placeholders-and-vanish-input";

export function PlaceholdersAndVanishInput() {
  const placeholders = [
    "Add a title",
    "Which is the most clickable title?",
    "Which title you will most likely click?"
  ];


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.value);
    
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(titles);
    console.log("submitted");
  };
  return (
    <div className=" flex flex-col justify-center  items-center px-4">
      <Placeholders
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
