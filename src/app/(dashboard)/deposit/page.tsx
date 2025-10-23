"use client"

import React, { useState } from 'react';
import Image from 'next/image'
import { MdContentCopy } from "react-icons/md";
import { IoNavigateCircleOutline } from "react-icons/io5";

const page = () => {
        const [copied, setCopied] = useState(false);
        const address = 'bc1q8pr8h206plxct55s925vh6aghwh9dlvzmwtz2m';
    
        const copyToClipboard = () => {
            navigator.clipboard.writeText(address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        };
    
        const viewInExplorer = () => {
            window.open(`https://blockstream.info/address/${address}`, '_blank');
        };
    
  return (
    <div className='bitcoin'>
        <div className="deposit-top">
            <h1>Bitcoin Deposits</h1>
            <p>Deposit Bitcoin to your account using the address below</p>
        </div>
        {/* <span>
            <h3>Deposit Address</h3>
            <p>Send Bitcoin to this address</p>
        </span> */}
        <Image src={'/address.jpeg'} height={200} width={200} alt='kjh' />
        <div className="address">
            <p>Bitcoin Address:</p>
            <div className="address_p">
                <p>bc1q8pr8h206plxct55s925vh6aghwh9dlvzmwtz2m</p>
            </div>
            <div className="address-btns">
                <button  onClick={copyToClipboard}>
                    <MdContentCopy /> <p>Copy Address</p>
                </button>
                <button onClick={viewInExplorer}>
                    <IoNavigateCircleOutline /> <p>View Explorer</p>
                </button>
            </div>
            {copied && (
            <div className="copy-notification">
                Address copied to clipboard!
            </div>
            )}
        </div>
    </div>
  )
}

export default page