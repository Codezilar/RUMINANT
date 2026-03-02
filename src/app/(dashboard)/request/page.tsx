// src/app/(dashboard)/request/page.tsx (updated)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheck, FaTimes, FaEye, FaSync } from 'react-icons/fa';
import { FaArrowLeftLong } from "react-icons/fa6";

interface Withdrawal {
  clerkId: string;
  amount: string;
  transferType: string;
  recipientName: string;
  bankName: string;
  aza: string;
  routingNumber: string;
  approve: string;
  otp: string;
  createdAt: string;
  updatedAt: string;
}

const page = () => {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<Withdrawal | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/withdrawal');
      const data = await response.json();
      if (response.ok) {
        setWithdrawals(data.withdrawals || []); // Ensure it's always an array
      } else {
        console.error('Failed to fetch withdrawals:', data.error);
        setWithdrawals([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      setWithdrawals([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (clerkId: string) => {
    try {
      setProcessing(clerkId);
      const response = await fetch('/api/withdrawal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId,
          action: 'approve'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state immediately for better UX
        setWithdrawals(prev => prev.map(w => 
          w.clerkId === clerkId ? { ...w, approve: '1' } : w
        ));
        
        if (selectedWithdrawal?.clerkId === clerkId) {
          setSelectedWithdrawal({ ...selectedWithdrawal, approve: '1' });
        }
        
        console.log('Approval successful:', data.message);
      } else {
        console.error('Approval failed:', data.error);
        alert(`Approval failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert('Error approving withdrawal. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (clerkId: string) => {
    try {
      setProcessing(clerkId);
      const response = await fetch('/api/withdrawal', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId,
          action: 'reject'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state immediately for better UX
        setWithdrawals(prev => prev.map(w => 
          w.clerkId === clerkId ? { ...w, approve: '2' } : w
        ));
        
        if (selectedWithdrawal?.clerkId === clerkId) {
          setSelectedWithdrawal({ ...selectedWithdrawal, approve: '2' });
        }
        
        console.log('Rejection successful:', data.message);
      } else {
        console.error('Rejection failed:', data.error);
        alert(`Rejection failed: ${data.error}`);
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert('Error rejecting withdrawal. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  // FIXED: Add safe filtering with optional chaining and null check
  const filteredWithdrawals = withdrawals?.filter((withdrawal: Withdrawal) => {
    if (filter === 'all') return true;
    return withdrawal.approve === 
      (filter === 'pending' ? '0' : filter === 'approved' ? '1' : '2');
  }) || [];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      '0': { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
      '1': { text: 'Approved', color: 'bg-green-100 text-green-800' },
      '2': { text: 'Rejected', color: 'bg-red-100 text-red-800' },
      '3': { text: 'Approved', color: 'bg-green-100 text-green-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap['0'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading withdrawals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="min-h-screen bg-gray-900 p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4">
              <FaArrowLeftLong />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Withdrawal Requests</h1>
                <p className="text-gray-600 mt-2">Manage and approve withdrawal requests</p>
              </div>
              <button
                onClick={fetchWithdrawals}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <FaSync /> Refresh
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-4 mb-6">
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg ${
                  filter === f ? 
                  'bg-blue-600 text-white' : 
                  'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)} Requests
              </button>
            ))}
          </div>

          {/* Withdrawals Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Recipient Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OTP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredWithdrawals.map((withdrawal) => (
                    <tr key={withdrawal.clerkId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {withdrawal.recipientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${withdrawal.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {withdrawal.bankName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {withdrawal.otp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(withdrawal.approve)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(withdrawal.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedWithdrawal(withdrawal)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Details"
                            disabled={processing === withdrawal.clerkId}
                          >
                            <FaEye />
                          </button>
                          {(withdrawal.approve === '0' || withdrawal.approve === '1') && (
                            <>
                              <button
                                onClick={() => handleApprove(withdrawal.clerkId)}
                                className="text-green-600 hover:text-green-900 p-1 disabled:opacity-50"
                                title="Approve"
                                disabled={processing === withdrawal.clerkId}
                              >
                                {processing === withdrawal.clerkId ? (
                                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaCheck className='text-3xl mr-20' />
                                )}
                              </button>
                              <button
                                onClick={() => handleReject(withdrawal.clerkId)}
                                className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
                                title="Reject"
                                disabled={processing === withdrawal.clerkId}
                              >
                                {processing === withdrawal.clerkId ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaTimes  className='text-3xl' />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredWithdrawals.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                {withdrawals.length === 0 ? 'No withdrawal requests found.' : 'No requests match your filter.'}
              </div>
            )}
          </div>

          {/* Detail Modal */}
          {selectedWithdrawal && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-900 rounded-lg max-w-2xl p-[1rem] w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Withdrawal Details</h2>
                    <button
                      onClick={() => setSelectedWithdrawal(null)}
                      className="text-gray-400 hover:text-gray-600"
                      disabled={processing === selectedWithdrawal.recipientName}
                    >
                      <FaTimes className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">User Information</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Recipient Name:</span> {selectedWithdrawal.recipientName}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Transfer Details</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Amount:</span> ${selectedWithdrawal.amount}</p>
                        <p><span className="font-medium">Type:</span> {selectedWithdrawal.transferType}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Recipient Information</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Name:</span> {selectedWithdrawal.recipientName}</p>
                        <p><span className="font-medium">Bank:</span> {selectedWithdrawal.bankName}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Account Details</h3>
                      <div className="space-y-2">
                        <p><span className="font-medium">Account Number:</span> {selectedWithdrawal.aza}</p>
                        <p><span className="font-medium">Routing Number:</span> {selectedWithdrawal.routingNumber}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Status</h3>
                      <div className="space-y-2">
                        {getStatusBadge(selectedWithdrawal.approve)}
                        <p><span className="font-medium">Submitted:</span> {new Date(selectedWithdrawal.createdAt).toLocaleString()}</p>
                        <p><span className="font-medium">Last Updated:</span> {new Date(selectedWithdrawal.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {selectedWithdrawal.approve === '0' && (
                    <div className="flex gap-4 mt-6 pt-4 border-t">
                      <button
                        onClick={() => handleApprove(selectedWithdrawal.clerkId)}
                        disabled={processing === selectedWithdrawal.clerkId}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processing === selectedWithdrawal.clerkId ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaCheck /> Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(selectedWithdrawal.clerkId)}
                        disabled={processing === selectedWithdrawal.clerkId}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {processing === selectedWithdrawal.clerkId ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <FaTimes /> Reject
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;