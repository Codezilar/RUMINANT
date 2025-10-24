"use client";

import React, { useState, useEffect } from 'react'
import { IoIosHome } from "react-icons/io";
import { MdAccountBalance } from "react-icons/md";
import { IoMdSwap } from "react-icons/io";
import { FaBtc } from "react-icons/fa6";
import { FaWallet } from "react-icons/fa6";
import { FaChartLine } from "react-icons/fa";
import { FaRegChartBar } from "react-icons/fa";
import { IoSendSharp } from "react-icons/io5";
import { MdContactSupport } from "react-icons/md";
import { FaRegUserCircle } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { FaPersonRifle } from "react-icons/fa6";
import { FaCreditCard } from "react-icons/fa6";
import { LuBrain } from "react-icons/lu";
import { BsBank } from "react-icons/bs";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GiShinyPurse } from "react-icons/gi";
import { GiHouse } from "react-icons/gi";
import { MdInventory, MdAllInbox } from "react-icons/md";

type SidebarProps = {
  activeNav: boolean;
  toggle: () => void;
};

const Sidebar = ({ activeNav, toggle }: SidebarProps) => {
  const { isLoaded, userId, sessionClaims } = useAuth();
  const [isClient, setIsClient] = useState(false);
  const adminUserId = "user_34Tjmx39Y0O10fEoerQewh7eao9";
  const adminUserId2 = "user_34TLn8AymL7VJ4BgS1zGcJROukk";

  // This ensures we only render after client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show minimal loading state during SSR and initial client render
  if (!isClient || !isLoaded) {
    return (
      <div className={`sidebar ${activeNav ? "activeNav" : "inactiveNav"}`}>
        <div className="sidebar-container">
          <div className="side-top">
            <span className="theme-gradient">Ruminant Bank</span>
          </div>
          {/* Minimal static content that matches the final structure */}
          <div className="banking">
            <h1>BANKING</h1>
            <div className="banking-content">
              <span><IoIosHome /><h3>Dashboard</h3></span>
              <span><MdAccountBalance /><h3>Account</h3></span>
              <span><IoMdSwap /><h3>Transactions</h3></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sidebar ${activeNav ? "activeNav" : "inactiveNav"}`}>
        <div className="sidebar-container">
            <div className="side-top">
                <span className="theme-gradient">
                    Ruminant Bank
                </span>
            </div>
            <div className="bank-wrap">
              <div className="banking">
                  <h1>BANKING</h1>
                  <div className="banking-content">
                      <Link href={'/dashboard'}>
                          <span onClick={toggle}><IoIosHome /><h3>Dashboard</h3></span>
                      </Link>
                      <Link href={'/account'}>
                          <span onClick={toggle}><MdAccountBalance /><h3>Account</h3></span>
                      </Link>
                      <Link href={'/transactions'}>
                          <span onClick={toggle}><IoMdSwap /><h3>Transactions</h3></span>
                      </Link>    
                      
                      {(userId === adminUserId || userId === adminUserId2) && (
                        <>
                          <Link href={'/kycadmin'}>
                            <span onClick={toggle}><FaPersonRifle /><h3 className='text-green-300 font-extrabold'>Users and Kyc</h3></span>
                          </Link>    
                          <Link href={'/credit'}>
                            <span onClick={toggle}><FaCreditCard /><h3 className='text-green-300 font-extrabold'>Credit User</h3></span>
                          </Link>    
                          <Link href={'/creditinvest'}>
                            <span onClick={toggle}><FaCreditCard /><h3 className='text-green-300 font-extrabold'>Credit Investment</h3></span>
                          </Link>    
                          <Link href={'/format'}>
                            <span onClick={toggle}><LuBrain /><h3 className='text-green-300 font-extrabold'>Billing Format</h3></span>
                          </Link>    
                          <Link href={'/request'}>
                            <span onClick={toggle}><BsBank /><h3 className='text-green-300 font-extrabold'>Withdrawal Request</h3></span>
                          </Link>
                        </>
                      )}
                  </div>
              </div>
              <div className="banking">
                  <h1>Investments and Loans</h1>
                  <div className="banking-content">
                      <Link href={'/investdeposit'}>
                          <span onClick={toggle}><FaMoneyBillTransfer /><h3>Deposit Investment</h3></span>
                      </Link>
                      <Link href={'/mortgage'}>
                          <span onClick={toggle}><GiShinyPurse /><h3>Request Mortgage</h3></span>
                      </Link>
                      <Link href={'/properties'}>
                          <span onClick={toggle}><GiHouse /><h3>Invest In Properties</h3></span>
                      </Link>
                      <Link href={'/containers'}>
                          <span onClick={toggle}><MdInventory /> <h3>Invest In Containers</h3></span>
                      </Link>
                  </div>
              </div>
              <div className="banking">
                  <h1>FINANCIAL SERVICES</h1>
                  <div className="banking-content">
                      <Link href={'/transfer'}>
                          <span onClick={toggle}><IoSendSharp /><h3>Withdrawal</h3></span>
                      </Link>
                      <Link href={'/deposit'}>
                          <span onClick={toggle}><FaBtc /><h3>Bitcoin Deposit</h3></span>
                      </Link>
                      <Link href={'/analytics'}>
                          <span onClick={toggle}><FaChartLine /><h3>Analytics</h3></span>
                      </Link>
                  </div>
              </div>
              <div className="banking">
                  <h1>HELP</h1>
                  <div className="banking-content">
                      <Link href={'/support'}>
                          <span onClick={toggle}><MdContactSupport /> <h3>Support</h3></span>
                      </Link>
                  </div>
              </div>
              <div className="banking">
                  <h1>ACCOUNT</h1>
                  <div className="banking-content">
                      <span onClick={toggle}><UserButton /> <h3>Profile</h3></span>
                  </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Sidebar