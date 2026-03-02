// components/AdminKycTable.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface KycData {
  _id: string;
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  state: string;
  account: string;
  approve: string;
  balance: string;
  idCard: string;
  passport: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminKycTable() {
  const [kycData, setKycData] = useState<KycData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchKycData();
  }, []);

  const fetchKycData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/kyc');
      
      if (!response.ok) {
        throw new Error('Failed to fetch KYC data');
      }
      
      const data = await response.json();
      setKycData(data.kyc);
    } catch (err) {
      setError('Error loading KYC data');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateKycStatus = async (clerkId: string, status: string) => {
    try {
      setProcessing(clerkId);
      const response = await fetch(`/api/kyc/admin/${clerkId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approve: status }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update local state immediately for better UX
        setKycData(prev => prev.map(kyc => 
          kyc.clerkId === clerkId ? { ...kyc, approve: status } : kyc
        ));
      } else {
        console.error('Update failed:', result.error);
        alert(`Failed to update status: ${result.error}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Error updating KYC status');
    } finally {
      setProcessing(null);
    }
  };

  const approveKyc = (clerkId: string) => updateKycStatus(clerkId, '1');
  const rejectKyc = (clerkId: string) => updateKycStatus(clerkId, '2');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '1':
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer">Approved</span>;
      case '2':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer">Rejected</span>;
      // case '3':
      //   return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded cursor-pointer">Approved</span>;
      default:
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">Pending</span>;
    }
  };

  if (loading) return <div className="text-center py-8">Loading KYC requests...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="dashboard">
        <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">KYC Approval Requests</h1>
        
        {/* Image Modal */}
        {selectedImage && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Document Preview</h3>
                <button
                    onClick={() => setSelectedImage(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                    &times;
                </button>
                </div>
                <div className="p-4">
                <Image
                    src={selectedImage}
                    alt="Document preview"
                    width={600}
                    height={400}
                    className="object-contain max-h-96 mx-auto"
                    onError={(e) => {
                    console.error('Image load error:', e);
                    e.currentTarget.src = '/api/placeholder/600/400';
                    }}
                />
                </div>
            </div>
            </div>
        )}

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                <th scope="col" className="px-6 py-3">User Info</th>
                <th scope="col" className="px-6 py-3">Account Details</th>
                <th scope="col" className="px-6 py-3">ID Card</th>
                <th scope="col" className="px-6 py-3">Passport</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {kycData.map((kyc) => (
                <tr key={kyc.account} className="bg-grey-900 border-b hover:bg-gray-700">
                    <td className="px-6 py-4">
                    <div className="font-medium text-white">
                        {kyc.firstName} {kyc.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{kyc.email}</div>
                    <div className="text-sm text-gray-500">Clerk ID: {kyc.clerkId}</div>
                    <div className="text-sm text-gray-500">
                        {kyc.country}, {kyc.state}
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <div className="font-mono">{kyc.account}</div>
                    <div className="text-sm">Balance: ${kyc.balance}</div>
                    <div className="text-sm text-white">
                        Created: {new Date(kyc.createdAt).toLocaleDateString()}
                    </div>
                    </td>
                    <td className="px-6 py-4">
                    <button
                        onClick={() => setSelectedImage(kyc.idCard)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                        View ID Card
                    </button>
                    </td>
                    <td className="px-6 py-4">
                    <button
                        onClick={() => setSelectedImage(kyc.passport)}
                        className="text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                        View Passport
                    </button>
                    </td>
                    <td className="px-6 py-4">
                    {getStatusBadge(kyc.approve)}
                    </td>
                    <td className="px-6 py-4 space-y-2">
                    {kyc.approve === '0' && (
                        <>
                        <button
                            onClick={() => approveKyc(kyc.clerkId)}
                            disabled={processing === kyc.clerkId}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing === kyc.clerkId ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                            onClick={() => rejectKyc(kyc.clerkId)}
                            disabled={processing === kyc.clerkId}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing === kyc.clerkId ? 'Processing...' : 'Reject'}
                        </button>
                        </>
                    )}
                    {kyc.approve !== '0' && (
                        <span className="text-gray-500 text-sm">Processed</span>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            
            {kycData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
                No KYC requests found
            </div>
            )}
        </div>
        </div>
    </div>
  );
}