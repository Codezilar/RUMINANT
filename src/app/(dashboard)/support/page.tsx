"use client"
import React from 'react'
import { FaRegUser } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { useForm, ValidationError } from '@formspree/react';
import { SiWhatsapp } from "react-icons/si";
import { TfiHandPointDown } from "react-icons/tfi";
import Link from 'next/link';

const page = () => {
    const [state, handleSubmit] = useForm("meoryjqq");

  return (
    <div className='dashboard support-form'>
      <div className="support">
        <div className="support-container">
          <div className="support-top">
            <h1>Submit a Support Ticket</h1>
            <p>Fill out the form below to create a support ticket.</p>
          </div>
          <form action="https://formspree.io/f/meoryjqq"  // Demo Formspree ID - replace with yours
        method="POST" >
              <div className="suppot-info">
                <div className="support-cred">
                  <div className="suport-data">
                    <h2>Full Name</h2>
                    <span>
                      <FaRegUser />
                      <input type="text" required placeholder='John Doe' name="fullName" id="" />
                    </span>
                  </div>
                  <div className="suport-data">
                    <h2>Email</h2>
                    <span>
                      <FaEnvelope />
                      <input type="email" required placeholder='john@example.com' name="email" id="" />
                    </span>
                  </div>
                </div>
                <div className="suport-data">
                  <h2>Issue Category</h2>
                  <span>
                    <select name="Issue" id="">
                      <option value="Account Issues">Account Issues</option>
                      <option value="Transfer Problem">Transfer Problem</option>
                      <option value="Card Services">Card Services</option>
                      <option value="Login Troubles">Login Troubles</option>
                      <option value="Other">Other</option>
                    </select>  
                  </span>
                </div>
                <div className="suport-data">
                  <h2>Subject</h2>
                  <span>
                    <input type="text" required placeholder='Brief description of your issue...' name="subject" id="" />
                  </span>
                </div>
                <div className="suport-data">
                  <h2>Message</h2>
                  <textarea name="message" required placeholder='Please provide ddetails about your issues...' id=""></textarea>
                </div>
                <button type="submit" disabled={state.submitting}>Submit Ticket</button>
                <h2 className='text-center w-full text-xl gap-2.5 flex justify-center items-center font-extrabold text-blue-300'>
                  <p>Or Contact Via</p>
                  <p className='flex'><TfiHandPointDown />!</p>
                </h2>
              </div>
          </form>
          <Link href={"https://wa.me/+12562663897"} target="_blank">
            <button className='bg-blue-400 flex w-full h-[5rem]  cursor-pointer justify-center items-center gap-3 rounded-[10px]'>
              <p className='font-extrabold'>WhatsApp</p>
              <SiWhatsapp className='text-3xl' />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default page