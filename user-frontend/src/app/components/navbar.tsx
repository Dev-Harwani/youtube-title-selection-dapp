"use client"

import { cn } from "../utils/cn";
import { Menu } from "./navbar-menu";
import { useState } from "react";

export default function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    return (
      <div
        className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
      >
        <Menu setActive={setActive}>
          <div className="flex flex-col justify-center">
          <button onClick={() => {
            window.location.href = "/"
          }} className="mr-4">
          <img src="https://i.postimg.cc/L4x3Vfxf/clickmagnet-high-resolution-logo-white.png" alt="logo" className=" h-18 w-28 rounded-lg"/>  
          </button>
          
          </div>
          <div className="flex flex-col justify-center font-bold">
            Connect Wallet
          </div>
        </Menu>
      </div>
    );
  }
  