import React from 'react'
import { IoMdSwap } from "react-icons/io";
import { MdOutlineNavigateNext } from "react-icons/md";
import { IoShieldOutline } from "react-icons/io5";

const page = () => {
  return (
    <div className='dashboard'>
        <div className="accounts-top">
            <h1>Your Accounts</h1>
            <p>Manage your bank accounts and cards</p>
        </div>
        <div className="authentication-container">
            <div className="authentication">
                <h2>Authentication Required</h2>
                <p>Please sign in to access your account information</p>
                <div className="authentication-content">
                    <button>
                        <p>View Transaction</p>
                        <MdOutlineNavigateNext />
                    </button>
                    <button>
                        <p>View Statements</p>
                        <MdOutlineNavigateNext />
                    </button>
                    <button>
                        <p>View Details</p>
                        <MdOutlineNavigateNext />
                    </button>
                </div>
            </div>
            <div className="trans-container">
                <div className="transfer-money">
                    <span>
                        <IoMdSwap className='kjhgf' /> <h1>Transfer Money</h1>
                    </span>
                    <p>Send money between your accounts or to other banks.</p>
                    <p>Quick and secure transfers with no hidden fees.</p>
                    <button>Start Transfer</button>
                </div>
                <div className="transfer-money">
                    <span>
                        <IoShieldOutline className='kjhgf' /> <h1>Account Security</h1>
                    </span>
                    <p>Manage security settings for your accounts.</p>
                    <p>Update passwords, enable 2FA, and control login settings.</p>
                    <button className='kjkjhn'>Security Settings</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default page