"use client";
import React, { useState } from "react";
import Navbar from "./components/navbar";
import { PlaceholdersAndVanishInput } from "./components/Inputs";

export default function Home() {

  return (
  <>
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
    </div>
    <div className="flex-col items-center font-semibold relative rounded-2xl dark:bg-black border dark:border-white/[0.2]  border-black/[0.2] bg-white shadow-input flex justify-around space-x-4 px-8 py-5 max-h-max top-32 max-w-full ml-5 mr-5 mb-5">
      <div>
        Welcome to ClickMagnet
      </div>

      <div className="mt-5">
        The place to get your most clickable titles  
      </div>

      <div className="mt-10 w-full">
      <PlaceholdersAndVanishInput/>
      </div>
    </div>
  </>
  );
}

