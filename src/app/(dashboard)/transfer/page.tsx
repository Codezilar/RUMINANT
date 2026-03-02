'use client';

import Link from 'next/link'
import React, { useState } from 'react'
import { FaArrowLeftLong } from "react-icons/fa6";
import { GiPiggyBank } from "react-icons/gi";   
import { BsBank } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs'

interface Withdrawal {
  clerkId: string;
}


const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Check if user is loaded and has an ID
    if (!isLoaded) {
      setMessage('Please wait while we verify your session...');
      return;
    }
    
    if (!userId) {
      setMessage('You must be logged in to make a withdrawal');
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    
    // Add the actual clerkId from Clerk authentication
    formData.append('clerkId', userId); 

    try {
      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Withdrawal request submitted successfully!');
        router.push('/withdrawalsuccess');
      } else {
        setMessage(data.error || 'Submission failed. Please try again.');
        console.error('API Error:', data);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className='dashboard'>
        <div className="transfer_p">
          <div className="text-center py-12">Loading...</div>
        </div>
      </div>
    );
  }

  // Show message if user is not authenticated
  if (!userId) {
    return (
      <div className='dashboard'>
        <div className="transfer_p">
          <div className="text-center py-12">
            <p>You must be logged in to access this page.</p>
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in here
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard'>
      <div className="transfer_p">
        <div className="transfer_p-top">
          <Link className='flex items-center gap-2' href={'/dashboard'}>
            <FaArrowLeftLong />
            <p>Back to Dashboard</p>
          </Link>
          <h1>Withdraw Funds</h1>
        </div>
        <div className="transfer-nav">
          <button>
            <BsBank />
            <p>To Bank</p>
          </button>
        </div>
        <div className="transfer_p-container">
          <div className='flex items-center gap-1.5'> 
            <GiPiggyBank className='text-3xl' /> 
            <h1>External Bank Transfer</h1>
          </div>
          <form onSubmit={handleSubmit} className="transfer_p-content">
            <div className="tf">
              <div className="tf-content">
                <h3>From Account</h3>
                <select name="fromAccount" required>
                  <option value="savings">Account</option>
                </select>
              </div>
              <div className="tf-content">
                <h3>Transfer Type</h3>
                <select name="transferType" required>
                  <option value="">Select Transfer Type</option>
                  <option value="ACH">ACH Transfer (1-3 business days)</option>
                  <option value="Wire">Wire Transfer (Same day)</option>
                  <option value="Zelle">Zelle (Instant)</option>
                </select>
              </div>
            </div>
            <div className="recipient">
              <span className='flex items-center gap-1.5'>
                <FiUser /> 
                <h2>Recipient Information</h2>
              </span>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Recipient Name *</h3>
                  <input 
                    type="text" 
                    name='recipientName' 
                    placeholder='Full name as it appears on account' 
                    required 
                  />
                </div>
                <div className="receipt-content">
                  <h3>Bank Name *</h3>
                  <input 
                    type="text" 
                    name='bankName' 
                    placeholder='e.g., Chase Bank, Bank of America' 
                    required 
                  />
                </div>
              </div>
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Account Number *</h3>
                  <input 
                    type="text" 
                    name='aza' 
                    placeholder='Recipient account number' 
                    required 
                  />
                </div>
                <div className="receipt-content">
                  <h3>Routing Number *</h3>
                  <input 
                    type="text" 
                    name='routingNumber' 
                    placeholder='9-digit routing number' 
                    required 
                  />
                </div>
              </div>
            </div>
            <div className="tf-amount">
              <h3>Transfer Amount ($USD)</h3>
              <input 
                type="number" 
                name='amount' 
                placeholder='Enter amount to transfer' 
                required 
                min="1"
              />
            </div>
            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error_btn'}`}>
                {message}
              </div>
            )}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Send Transfer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default page;