"use client"
import { LuServer } from "react-icons/lu";
import { MdOutlineShield } from "react-icons/md";
import { LuBuilding } from "react-icons/lu";

import React from 'react'

const Choose = () => {
  return (
    <div className='choose'>
        <div className="choose-container">
            <div className="choose-top">
                <h1>Why Choose Kingadox Bank</h1>
                <p>Experience next-generation banking with our comprehensive suite of financial solutions designed for the digital age.</p>
            </div>
            <div className="choose-wrapp">
                <div className="choose-content">
                    <span><MdOutlineShield className="choose_icon" /></span>
                    <h3>Bank-Level Security</h3>
                    <p>Military-grade encryption and multi-factor authentication protect your financial data with industry-leading security protocols.</p>
                </div>
                <div className="choose-content">
                    <span><LuServer className="choose_icon" /></span>
                    <h3>24/7 Digital Banking</h3>
                    <p>Access your accounts, transfer funds, and manage investments anytime, anywhere with our cutting-edge mobile platform.</p>
                </div>
                <div className="choose-content">
                    <span><LuBuilding className="choose_icon" /></span>
                    <h3>Business Excellence</h3>
                    <p>Comprehensive business banking solutions with advanced analytics and dedicated support to accelerate your growth.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Choose