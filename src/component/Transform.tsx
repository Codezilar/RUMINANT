"use client"

import { LuPhone } from "react-icons/lu";
import { GoLock } from "react-icons/go";

import React from 'react'
import Link from "next/link";

const Transform = () => {
  return (
    <div className='transform'>
        <div className="transform-container">
            <div className="transform-left">
                <h1>
                    Ready to Transform Your Banking?
                </h1>
                <p>
                    Join over 50,000 satisfied customers who have revolutionized their financial journey with Bask Bank's innovative solutions.
                </p>
                <div className="transform-btns">
                    <Link href={'/signup'}>
                        <button className="cursor-pointer">
                            Get Started today
                        </button>
                    </Link>
                    <Link href={'/signup'}>
                        <button className="cursor-pointer">
                            Learn More
                        </button>
                    </Link>
                </div>
            </div>
            <div className="transform-right">
                <h1>Get In Touch</h1>
                <div className="transform-right-support">
                    <span>
                        <LuPhone className="choose_icon" />
                    </span>
                    <div className="transform-right-text">
                        <h3>24/7 Support</h3>
                        <p>1-800-BANKING</p>
                    </div>
                </div>
                <div className="transform-right-support">
                    <span>
                        <GoLock className="choose_icon" />
                    </span>
                    <div className="transform-right-text">
                        <h3>Secure Support</h3>
                        <p>Bank-grade encryption</p>
                    </div>
                </div>
                <Link href={'/signup'}>
                    <button className="cursor-pointer">
                        Schedule Consultation
                    </button>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Transform