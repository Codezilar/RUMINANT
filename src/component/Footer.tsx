"use client"

import React from 'react'
import Image from 'next/image'
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer>
        <div className="footer-container">
            <div className="uppper-footer">
                <div className="upper-footer-content">
                    <div className="footer-top">
                        <span className='theme-gradient'>Kingadox Bank</span>
                    </div>
                    <p>
                        Become part of the most exciting communities in the world. Explore new horizons, achieve the impossible, and make a difference - all while having fun and earning rewards. It's that simple.
                    </p>
                </div>
                <div className="upper-footer-content">
                    <div className="footer-top">
                        <h4>Learn</h4>
                    </div>
                    <p>Blog</p>
                    <p>Pricing</p>
                    <p>About Us</p>
                </div>
                <div className="upper-footer-content">
                    <div className="footer-top">
                        <h4>Get started</h4>
                    </div>
                    <p>Create an account</p>
                    <p>Log In</p>
                    <p>Become a partner</p>
                    <p>Build your enterprise</p>
                </div>
                <div className="upper-footer-content">
                    <div className="footer-top">
                        <h4>Resources</h4>
                    </div>
                    <p>About</p>
                    <p>Careers</p>
                    <p>Contact support</p>
                    <p>Cookie perfomances</p>
                </div>
            </div>
            <div className="lower-footer">
                <ul>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Cookie Policy</a>
                    <a href="#">Terms & Condition</a>
                </ul>

                <div className="footer-socials">
                    <FaXTwitter />
                    <FaInstagram />
                    <FaFacebook />
                    <FaDiscord />
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer