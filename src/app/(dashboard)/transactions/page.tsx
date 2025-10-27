"use client"
import React, { useEffect, useState } from 'react'
import { LuDownload } from "react-icons/lu";
import { FiSearch } from "react-icons/fi";
import { IoMdSwap } from "react-icons/io";
import { FaBtc } from "react-icons/fa";
import Image from 'next/image';
import { useUser, useAuth } from '@clerk/nextjs'
import TransactionHistory from '@/component/TransactionHistory';


interface Withdrawal {
  clerkId: string;
  approve: string; // This is what we need to check: '0', '1', or '2'
  // Other withdrawal properties...
}

const page = () => {
    const [withdrawal, setWithdrawal] = useState<Withdrawal | null>(null);
    const { userId, sessionId } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
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
    }, [userId]); 
  return (
    <div className='dashboard transactions'>
        <div className="transactions-top">
            <h1>Transactions</h1>
            <button><LuDownload /> <p>Export</p></button>
        </div>
        <div className="transactions-container">
            <div className="transactions-content">
                <div className="transactions-content-top">
                    <h2>Transaction History</h2>
                    <p>View and search your recent transactions.</p>
                    <div className="transactions-search">
                        <div className="trans-wrapp">
                            <FiSearch className='text-black' />
                            <input placeholder='Search transactions' type="text" />
                        </div>
                        <button>Search</button>
                    </div>
                    {/* <div className="transaction-box">
                        {(withdrawal && withdrawal.approve === "") ? (
                            <>
                                <Image src={'/trans.webp'} height={150} width={150} alt='kjh' />
                                <h3>No transaction completed yet</h3>
                                <p>Your transaction history will appear here once you start making transfers and payments.</p>
                            </>
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
                        <div className="transfers-wrap">
                            <div className="transfer-money">
                                <button>
                                    <FaBtc className='jhgfcvbn' /> 
                                    <h2>Make Deposit</h2>
                                </button>
                            </div>
                            <div className="transfer-money">
                                <button className='kjkjhn'>
                                    <IoMdSwap className='jhgfcvbn' />
                                    <h2>Make Transfer</h2>
                                </button>
                            </div>
                        </div>
                    </div> */}
                    <TransactionHistory />
                </div>
            </div>
        </div>
    </div>
  )
}

export default page