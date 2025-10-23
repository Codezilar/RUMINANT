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

const UserBalanceCard: React.FC = () => {
  const [balanceData, setBalanceData] = useState<UserBalance | null>(null);
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalData | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [withdrawalLoading, setWithdrawalLoading] = useState(true);
  const [balanceError, setBalanceError] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');

  useEffect(() => {
    fetchUserBalance();
    fetchWithdrawalAmount();
  }, []);

  const fetchUserBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await fetch('/api/user/balance');

      if (!response.ok) {
        throw new Error('Failed to fetch user balance');
      }

      const data = await response.json();
      setBalanceData(data);
    } catch (err) {
      setBalanceError('Error loading balance data');
      console.error('Balance fetch error:', err);
    } finally {
      setBalanceLoading(false);
    }
  };

  const fetchWithdrawalAmount = async () => {
    try {
      setWithdrawalLoading(true);
      const response = await fetch('/api/requestBalance');

      if (!response.ok) {
        // try to read text for better debugging
        const txt = await response.text();
        throw new Error(`Failed to fetch withdrawal amount. status=${response.status} body=${txt}`);
      }

      const data = await response.json();

      // Support two possible response shapes:
      // 1) { amount: '123.45' }
      // 2) a primitive string or number like '123.45' or 123.45 (older code)
      if (typeof data === 'string' || typeof data === 'number') {
        setWithdrawalData({ amount: String(data) });
      } else if (data && typeof data === 'object' && 'amount' in data) {
        setWithdrawalData({ amount: String((data as any).amount ?? '0') });
      } else {
        console.error('Unexpected withdrawal response format', data);
        setWithdrawalError('Unexpected response format');
      }
    } catch (err) {
      setWithdrawalError('Error loading withdrawal data');
      console.error('Withdrawal fetch error:', err);
    } finally {
      setWithdrawalLoading(false);
    }
  };

  if (balanceLoading || withdrawalLoading) {
    return (
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
    );
  }

  if (balanceError) {
    return (
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
          <h1>$0.00</h1>
          <p>Complete KYC</p>
        </div>
      </div>
    );
  }

  const balanceValue = parseFloat(balanceData?.balance ?? '0');
  const withdrawalValue = parseFloat(withdrawalData?.amount ?? '0');
  
  const formattedBalance = balanceValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedWithdrawal = withdrawalValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Calculate available balance (balance minus withdrawal requests)
  const availableBalance = balanceValue - withdrawalValue;
  const formattedAvailableBalance = availableBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
          <h1>${formattedAvailableBalance}</h1>
          <p>{balanceData?.firstName}'s account balance</p>
        </div>
      </div>

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
          <h1>$0.00</h1>
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
          <h1>${formattedBalance}</h1>
          <p>Last 7 days</p>
        </div>
      </div>
    </div>
  );
};

export default UserBalanceCard;
