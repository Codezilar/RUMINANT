"use client";
import Sidebar from "@/component/Sidebar";
import { IoIosNotifications } from "react-icons/io";
import { ReactNode, useState } from "react"
import { FaTimes } from "react-icons/fa";

import { FaBars } from "react-icons/fa6";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'


const RootLayout = ({children}:{children: ReactNode}) => {
  const [activeNav, setactiveNav] = useState(false)
  const toggle = () =>{
    setactiveNav(!activeNav);

  }
  return (
    <main className="dasss">
        <Sidebar activeNav={activeNav} toggle={toggle} />
        <div className="dass-right">
          <div className="dash-nav">
            <UserButton />
            <div className="dash-nav-content">
              <button onClick={toggle}>
                {activeNav === false ? (<FaBars />): (<FaTimes />)}      
              </button>
            </div>
          </div>
          {children}
        </div>
    </main>
  )
}

export default RootLayout