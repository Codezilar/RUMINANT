'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

interface KycStatus {
  status: 'approved' | 'pending' | 'rejected' | 'not_submitted';
  message?: string;
  account?: string; // Added account number field
}

export default function KycBanner() {
  const [kycStatus, setKycStatus] = useState<KycStatus>({ status: 'not_submitted' });
  const [loading, setLoading] = useState(true);
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchKycStatus();
    }
  }, [userId]);

  const fetchKycStatus = async () => {
    try {
      const response = await fetch(`/api/kyc/admin/${userId}`);
      
      if (response.status === 404) {
        setKycStatus({ status: 'not_submitted' });
        setLoading(false);
        return;
      }
      
      if (!response.ok) throw new Error('Failed to fetch KYC status');
      
      const data = await response.json();
      
      if (data.kyc.approve === '1') {
        setKycStatus({ 
          status: 'approved',
          account: data.kyc.account // Assuming the API returns account number
        });
      } else if (data.kyc.approve === '2') {
        setKycStatus({ 
          status: 'rejected',
          message: 'Your KYC application was declined. Please reapply with correct documents.'
        });
      } else {
        setKycStatus({ status: 'pending' });
      }
    } catch (error) {
      console.error('Error fetching KYC status:', error);
      setKycStatus({ status: 'not_submitted' });
    } finally {
      setLoading(false);
    }
  };

  // Don't show if loading or pending
  if (loading || kycStatus.status === 'pending') {
    return null;
  }

  return (
    <div className="kyc">
      <div className="kyc-container">
        <div className="kyc-left">
          <Image 
            src={'/kyc.jpg'} 
            alt='KYC' 
            className='kyc-img' 
            height={70} 
            width={70} 
          />
          <div className="kyc-content">
            {kycStatus.status === 'not_submitted' ? (
              <>
                <h1>Complete Your KYC to Get Started 🚀</h1>
                <p>Get your account number and start using your account.</p>
              </>
            ) : kycStatus.status === 'approved' ? (
              <>
                <h1>KYC Approved! ✅</h1>
                <p className='items-center'>Your account number: <strong className='text-3xl'>{kycStatus.account || 'Loading...'}</strong></p>
                <p>You can now use all features of your account.</p>
              </>
            ) : (
              <>
                <h1>KYC Application Declined ❌</h1>
                <p>{kycStatus.message || 'Your KYC application was not approved. Please review and reapply.'}</p>
              </>
            )}
            <Link href={kycStatus.status === 'approved' ? "/dashboard" : (kycStatus.status === 'not_submitted' ? "/kyc" : "/reapply")}>
              <button>
                {kycStatus.status === 'approved' ? 'Completed' : 
                 kycStatus.status === 'not_submitted' ? 'Get Started' : 'Reapply Now'}
              </button>
            </Link>
          </div>
        </div>
        <Image 
          src={'/de.webp'} 
          alt='Decoration' 
          className='kyc-bot'
          height={100} 
          width={100} 
        />
      </div>
    </div>
  );
}