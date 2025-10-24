'use client';

import React, { useState } from 'react'
import { GiPiggyBank } from "react-icons/gi"; 
import { FiUser } from "react-icons/fi";

interface TransferHistory {
  account: string;
  amount: number;
  name: string;
  timestamp: Date;
}

const page = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [transferHistory, setTransferHistory] = useState<TransferHistory[]>([]);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountNumber || !amount) {
      setError('Please fill in all fields');
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/invest/transfer', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: accountNumber,
          amount: parseFloat(amount)
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Successfully transferred $${amount} to account ${accountNumber}`);
        setAccountNumber('');
        setAmount('');
        
        // Add to transfer history
        const newTransfer = {
          account: accountNumber,
          amount: parseFloat(amount),
          name: result.userName || 'Unknown User',
          timestamp: new Date()
        };
        
        setTransferHistory(prev => [newTransfer, ...prev]);
      } else {
        setError(result.error || 'Failed to process transfer');
      }
    } catch (err) {
      setError('An error occurred while processing the transfer');
      console.error('Transfer error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='dashboard'>
      <div className="transfer_p">
        <div className="transfer_p-container">
          <div className='flex items-center gap-1.5'> 
            <GiPiggyBank className='text-3xl' /> 
            <h1>Admin Transfer</h1>
          </div>
          
          <div className="transfer_p-content">
            <form onSubmit={handleTransfer}>
              <div className="recipient">
                <span className='flex items-center gap-1.5'>
                  <FiUser /> 
                  <h2>Credit Imvestment Balance</h2>
                </span>
                <div className="receipt">
                  <div className="receipt-content">
                    <h3>Account Number *</h3>
                    <input 
                      type="text" 
                      placeholder='Kingadox account number' 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="tf-amount">
                <h3>Transfer Amount ($USD)</h3>
                <input 
                  type="number" 
                  placeholder='Enter amount to transfer' 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              {error && <div className="error_btn">{error}</div>}
              {message && <div className="success_btn">{message}</div>}
              
              <button type="submit" disabled={loading}>
                {loading ? 'Processing...' : 'Send Transfer'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="tf_Information">
          <h2>Credited Users:</h2>
          {transferHistory.length === 0 ? (
            <p>No transfers yet</p>
          ) : (
            <ul>
              {transferHistory.map((transfer, index) => (
                <li key={index}>
                  {transfer.name} (${transfer.amount.toFixed(2)}) - Account: {transfer.account} - {transfer.timestamp.toLocaleString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default page;