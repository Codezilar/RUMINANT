'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { FiUser, FiArrowLeft, FiAlertCircle } from "react-icons/fi";
import Image from 'next/image';
import OnboradingSuccess from '@/component/Success';
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface KycData {
  clerkId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  state: string;
  idCardFileName: File | null;
  passportFileName: File | null;
}

const ReapplyPage = () => {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoaded } = useUser();
  const userId = user?.id || null;

  const [kyc, setKyc] = useState<KycData>({
    clerkId: userId,
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    state: '',
    idCardFileName: null,
    passportFileName: null,
  });

  // Fetch existing KYC data
  useEffect(() => {
    const fetchExistingKyc = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/kyc?clerkId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.kyc) {
            setKyc(prev => ({
              ...prev,
              firstName: data.kyc.firstName || '',
              lastName: data.kyc.lastName || '',
              email: data.kyc.email || '',
              country: data.kyc.country || '',
              state: data.kyc.state || '',
            }));
          }
        } else if (response.status === 404) {
          setError('No existing KYC record found. Please complete a new KYC application first.');
        }
      } catch (error) {
        console.error('Error fetching KYC data:', error);
        setError('Failed to load your KYC information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchExistingKyc();
    }
  }, [userId, isLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setKyc(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (!validTypes.includes(file.type)) {
        setError('Please upload JPEG, PNG, or PDF files only');
        return;
      }

      if (file.size > maxSize) {
        setError('File size must be less than 10MB');
        return;
      }

      setKyc(prev => ({ ...prev, [name]: file }));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!kyc.country || !kyc.state) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('clerkId', kyc.clerkId || '');
      formData.append('firstName', kyc.firstName);
      formData.append('lastName', kyc.lastName);
      formData.append('email', kyc.email);
      formData.append('country', kyc.country);
      formData.append('state', kyc.state);
      
      if (kyc.idCardFileName) {
        formData.append('idCardFileName', kyc.idCardFileName);
      }
      if (kyc.passportFileName) {
        formData.append('passportFileName', kyc.passportFileName);
      }

      const response = await fetch('/api/kyc/reapply', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Failed to update KYC. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting reapplication:', error);
      setError('An error occurred while submitting the form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your KYC information...</p>
        </div>
      </div>
    );
  }

  if (error && error.includes('No existing KYC record')) {
    return (
      <div className="dashboard">
        <div className="error-container">
          <FiAlertCircle size={48} className="error-icon" />
          <h2>No KYC Record Found</h2>
          <p>{error}</p>
          <Link href="/kyc" className="primary-button">
            Complete New KYC Application
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return <OnboradingSuccess />;
  }

  return (
    <div className='dashboard'>
      <div className="kyc">
        <div className="kyc-container">
          <div className="kyc-left">
            <Image src={'/kyc.jpg'} alt='KYC' className='kyc-img' height={70} width={70} />
            <div className="kyc-content">
              <h1>Update Your KYC Information 🔄</h1>
              <p>Please review and update your information as needed.</p>
            </div>
          </div>
          <Image src={'/de.webp'} alt='Decoration' className='kyc-bot' height={100} width={100} />
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <FiAlertCircle />
          <p>{error}</p>
        </div>
      )}

      <div className="transfer_p">
        <div className="back-button">
          <Link href="/dashboard" className="back-link">
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>
        
        <form onSubmit={handleSubmit} className="transfer_p-container">
          <div className="transfer_p-content">
            <div className="recipient">
              <span className='flex items-center gap-1.5'>
                <FiUser /> 
                <h2>KYC Update Form</h2>
              </span>
              
              <div className="receipt">
                <div className="receipt-content">
                  <h3>First Name *</h3>
                  <input 
                    type="text" 
                    name="firstName"
                    onChange={handleInputChange} 
                    value={kyc.firstName} 
                    placeholder='John' 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="receipt-content">
                  <h3>Last Name *</h3>
                  <input 
                    type="text" 
                    name="lastName"
                    onChange={handleInputChange} 
                    value={kyc.lastName} 
                    placeholder='Doe' 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Country *</h3>
                  <input 
                    type="text" 
                    name="country"
                    onChange={handleInputChange} 
                    value={kyc.country}
                    placeholder='Enter Country...' 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                <div className="receipt-content">
                  <h3>State *</h3>
                  <input 
                    type="text" 
                    name="state"
                    onChange={handleInputChange} 
                    value={kyc.state}
                    placeholder='Enter State...' 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="receipt">
                <div className="receipt-content">
                  <h3>Email *</h3>
                  <input 
                    type="email" 
                    name="email"
                    onChange={handleInputChange} 
                    value={kyc.email}
                    placeholder='your.email@example.com' 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="receipt">
                <div className="receipt-content">
                  <h3>ID Card (Update if needed - JPEG, PNG, PDF - Max 10MB)</h3>
                  <input 
                    type="file" 
                    name="idCardFileName"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="receipt-content">
                  <h3>Passport (Update if needed - JPEG, PNG, PDF - Max 10MB)</h3>
                  <input 
                    type="file" 
                    name="passportFileName"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={isSubmitting ? 'submitting' : ''}
            >
              {isSubmitting ? 'Updating...' : 'Update KYC Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReapplyPage;