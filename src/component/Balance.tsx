// File: components/UserBalanceCard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { CiWallet } from 'react-icons/ci';
import { IoIosTrendingUp } from 'react-icons/io';
import { HiOutlineWallet } from 'react-icons/hi2';
import { FaArrowTrendUp } from 'react-icons/fa6';
import { MdWaterfallChart } from 'react-icons/md';

type UserBalance = {
  balance: string;
  firstName: string;
  lastName?: string;
};

type WithdrawalData = {
  amount: string;
};

type InvestmentBalance = {
  investment: string;
  // Add other investment-related fields if your API returns them
};

const UserBalanceCard: React.FC = () => {
  const [balanceData, setBalanceData] = useState<UserBalance | null>(null);
  const [investmentData, setInvestmentData] = useState<InvestmentBalance | null>(null);
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [investmentLoading, setInvestmentLoading] = useState(true);
  const [withdrawalLoading, setWithdrawalLoading] = useState(true);
  const [balanceError, setBalanceError] = useState('');
  const [investmentError, setInvestmentError] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');

  useEffect(() => {
    fetchUserBalance();
    fetchUserInvestBalance();
    fetchWithdrawalAmount();
  }, []);

  const fetchUserBalance = async () => {
    try {
      setBalanceLoading(true);
      setBalanceError('');
      console.log('Fetching user balance from /api/user/balance');
      
      const response = await fetch('/api/user/balance');

      if (!response.ok) {
        throw new Error(`Failed to fetch user balance: ${response.status}`);
      }

      const data = await response.json();
      console.log('User balance response:', data);
      setBalanceData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setBalanceError(`0.00`);
      console.error('Balance fetch error:', err);
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchUserInvestBalance = async () => {
    try {
      setInvestmentLoading(true);
      setInvestmentError('');
      console.log('Fetching investment balance from /api/fetchInvestBal/balance');
      
      const response = await fetch('/api/fetchInvestBal/balance');

      if (!response.ok) {
        throw new Error(`Failed to fetch investment balance: ${response.status}`);
      }

      const data = await response.json();
      console.log('Investment balance response:', data);
      
      // Handle different response formats
      if (typeof data === 'string' || typeof data === 'number') {
        setInvestmentData({ investment: String(data) });
      } else if (data && typeof data === 'object') {
        // Use the correct field name 'investment'
        const investmentValue = data.investment || data.investmentBalance || data.amount || '0';
        setInvestmentData({ investment: String(investmentValue) });
      } else {
        setInvestmentData({ investment: '0' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setInvestmentError(`Error loading investment data: ${errorMessage}`);
      console.error('Investment balance fetch error:', err);
    } finally {
      setInvestmentLoading(false);
    }
  };

  const fetchWithdrawalAmount = async () => {
    try {
      setWithdrawalLoading(true);
      setWithdrawalError('');
      console.log('Fetching withdrawal amount from /api/requestBalance');
      
      const response = await fetch('/api/requestBalance');

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Failed to fetch withdrawal amount. status=${response.status} body=${txt}`);
      }

      const data = await response.json();
      console.log('Withdrawal response:', data);

      // Support multiple response formats
      if (typeof data === 'string' || typeof data === 'number') {
        setWithdrawalData({ amount: String(data) });
      } else if (data && typeof data === 'object' && 'amount' in data) {
        setWithdrawalData({ amount: String(data.amount ?? '0') });
      } else {
        console.warn('Unexpected withdrawal response format, defaulting to 0', data);
        setWithdrawalData({ amount: '0' });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setWithdrawalError(`Error loading withdrawal data: ${errorMessage}`);
      console.error('Withdrawal fetch error:', err);
    } finally {
      setWithdrawalLoading(false);
    }
  };

  // Check if any data is still loading
  const isLoading = balanceLoading || investmentLoading || withdrawalLoading;

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-container card-green">
          <div className="card-top">
            <div className="card-bal">
              <span>
                <CiWallet className="text-3xl" />
              </span>
              <p>
                <IoIosTrendingUp /> 2.3%
              </p>
            </div>
            <h1>Loading...</h1>
            <p>All accounts combined</p>
          </div>
        </div>
        
        {/* Show loading states for other cards too */}
        <div className="card-container ololol">
          <div className="card-top">
            <div className="card-bals">
              <span>
                <HiOutlineWallet />
              </span>
              <p>Withdrawal Request</p>
            </div>
            <h1>Loading...</h1>
            <p>Currently processing</p>
          </div>
        </div>

        <div className="card-container ololol">
          <div className="card-top">
            <div className="card-bals">
              <span>
                <FaArrowTrendUp />
              </span>
              <p>Investment Balance</p>
            </div>
            <h1>Loading...</h1>
            <p>Investment Account</p>
          </div>
        </div>

        <div className="card-container ololol">
          <div className="card-top">
            <div className="card-bals">
              <span>
                <MdWaterfallChart />
              </span>
              <p>Recent Activity</p>
            </div>
            <h1>Loading...</h1>
            <p>Last 7 days</p>
          </div>
        </div>
      </div>
    );
  }

  // Format values safely
  const balanceValue = parseFloat(balanceData?.balance ?? '0') || 0;
  const investmentValue = parseFloat(investmentData?.investment ?? '0') || 0;
  const withdrawalValue = parseFloat(withdrawalData?.amount ?? '0') || 0;
  
  const formattedBalance = balanceValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedInvestment = investmentValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedWithdrawal = withdrawalValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Calculate available balance (balance minus withdrawal requests)
  const availableBalance = Math.max(0, balanceValue - withdrawalValue);
  const formattedAvailableBalance = availableBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="card">
      {/* Main Balance Card */}
      <div className="card-container card-green">
        <div className="card-top">
          <div className="card-bal">
            <span>
              <CiWallet className="text-3xl" />
            </span>
            <p>
              <IoIosTrendingUp /> 2.3%
            </p>
          </div>
          <h1>${formattedAvailableBalance}</h1>
          <p>{balanceData?.firstName || 'User'}'s available balance</p>
          {balanceError && <p className="error-text">{balanceError}</p>}
        </div>
      </div>

      {/* Withdrawal Card */}
      <div className="card-container ololol">
        <div className="card-top">
          <div className="card-bals">
            <span>
              <HiOutlineWallet />
            </span>
            <p>Withdrawal Request</p>
          </div>
          <h1>${formattedWithdrawal}</h1>
          <p>Currently processing</p>
          {withdrawalError && <p className="error-text">{withdrawalError}</p>}
        </div>
      </div>

      {/* Investment Card */}
      <div className="card-container ololol">
        <div className="card-top">
          <div className="card-bals">
            <span>
              <FaArrowTrendUp />
            </span>
            <p>Investment Balance</p>
          </div>
          <h1>${formattedInvestment}</h1>
          <p>Investment Account</p>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="card-container ololol">
        <div className="card-top">
          <div className="card-bals">
            <span>
              <MdWaterfallChart />
            </span>
            <p>Recent Activity</p>
          </div>
          <h1>${formattedBalance}</h1>
          <p>Last 7 days</p>
        </div>
      </div>
    </div>
  );
};

export default UserBalanceCard;