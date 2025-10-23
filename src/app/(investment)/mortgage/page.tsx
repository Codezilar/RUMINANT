"use client";
import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface FormData {
  propertyValue: string;
  loanAmount: string;
  income: string;
  creditScore: string;
  employment: string;
  fullName: string;
  email: string;
  phoneNo: string;
  accountNo: string;
  duration: string;
}

interface KycData {
  approve: string;
  account?: string;
}

const RequestMortgage = () => {
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    propertyValue: '',
    loanAmount: '',
    income: '',
    creditScore: '',
    employment: '',
    fullName: '',
    email: '',
    phoneNo: '',
    accountNo: '',
    duration: '30'
  });

  const [kycStatus, setKycStatus] = useState<'loading' | 'approved' | 'not_submitted' | 'rejected'>('loading');

  // Fetch KYC status and handle redirects
  useEffect(() => {
    const fetchKycStatus = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/kyc/admin/${userId}`);
        
        if (response.ok) {
          const data = await response.json();
          const kycData: KycData = data.kyc;

          if (kycData.approve === '1') {
            // KYC Approved - allow access
            setKycStatus('approved');
            setFormData(prev => ({
              ...prev,
              accountNo: kycData.account || ''
            }));
          } else if (kycData.approve === '0') {
            // KYC Not Submitted - redirect to dashboard
            setKycStatus('not_submitted');
            alert('Please complete your KYC verification first.');
            router.push('/dashboard');
          } else if (kycData.approve === '2') {
            // KYC Rejected - redirect to dashboard
            setKycStatus('rejected');
            alert('KYC verification rejected. Please reapply to get your account number.');
            router.push('/dashboard');
          }
        } else if (response.status === 404) {
          // No KYC record found
          setKycStatus('not_submitted');
          alert('Please complete your KYC verification first.');
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching KYC status:', error);
        setKycStatus('not_submitted');
        alert('Error verifying KYC status. Please try again.');
        router.push('/dashboard');
      }
    };

    fetchKycStatus();
  }, [userId, router]);

  // Pre-fill user data only if KYC is approved
  useEffect(() => {
    if (isLoaded && user && kycStatus === 'approved') {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
      }));
    }
  }, [isLoaded, user, kycStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double check KYC status before submission
    if (kycStatus !== 'approved') {
      alert('Please complete KYC verification before submitting mortgage application.');
      router.push('/dashboard');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      // Show loading state
      const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
      }

      // Send emails
      const emailResponse = await fetch('/api/send-mortgage-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const emailResult = await emailResponse.json();

      if (emailResult.success) {
        alert(`Mortgage application submitted successfully! Confirmation email sent to ${formData.email}.`);
        // You can reset the form here if needed
        // setFormData({ ...initial form state });
      } else {
        alert('Application submitted but email notification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Application submitted but email notification failed. Please contact support.');
    } finally {
      // Re-enable button
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit Mortgage Application';
      }
    }
  };

  // Calculate Loan-to-Value ratio
  const calculateLTV = () => {
    const propertyValue = parseFloat(formData.propertyValue) || 0;
    const loanAmount = parseFloat(formData.loanAmount) || 0;
    
    if (propertyValue <= 0) return 0;
    
    const ltv = (loanAmount / propertyValue) * 100;
    return Math.min(Math.max(ltv, 0), 100);
  };

  const loanToValue = calculateLTV();

  // Progress bar color based on LTV
  const getProgressColor = (ltv: number) => {
    if (ltv <= 80) return '#10b981'; // green
    if (ltv <= 95) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  // Show loading state while checking KYC
  if (kycStatus === 'loading') {
    return (
      <div className="investment-page">
        <div className="loading-container">
          <h2>Verifying KYC Status...</h2>
          <p>Please wait while we check your verification status.</p>
        </div>
      </div>
    );
  }

  // Only render the form if KYC is approved
  if (kycStatus !== 'approved') {
    return (
      <div className="investment-page">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>Please complete KYC verification to access mortgage services.</p>
          <button onClick={() => router.push('/dashboard')} className="submit-btn">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="investment-page">
      <h1>Request Mortgage</h1>
      <p className="page-description">
        Apply for a mortgage to finance your dream property with competitive rates.
      </p>

      <div className="investment-card">
        <form onSubmit={handleSubmit} className="investment-form">
          
          {/* Property & Loan Details */}
          <div className="form-row">
            <div className="form-group">
              <label>Property Value ($)</label>
              <input
                type="number"
                name="propertyValue"
                value={formData.propertyValue}
                onChange={handleChange}
                placeholder="Property value"
                min="0"
                step="1000"
                required
              />
            </div>
            <div className="form-group">
              <label>Loan Amount ($)</label>
              <input
                type="number"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                placeholder="Loan amount"
                min="0"
                step="1000"
                required
              />
            </div>
          </div>

          {/* LTV Progress Bar */}
          <div className="form-group">
            <label>Loan-to-Value Ratio: {loanToValue.toFixed(1)}%</label>
            <div 
              className="progress-bar"
              role="progressbar"
              aria-valuenow={loanToValue}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="progress-fill"
                style={{ 
                  width: `${loanToValue}%`,
                  backgroundColor: getProgressColor(loanToValue)
                }}
              />
            </div>
            <div className="ltv-indicators">
              <span>0%</span>
              <span>80% (Ideal)</span>
              <span>95% (Max)</span>
            </div>
          </div>

          {/* Income & Credit Score */}
          <div className="form-row">
            <div className="form-group">
              <label>Annual Income ($)</label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                placeholder="Annual income"
                min="0"
                step="1000"
                required
              />
            </div>
            <div className="form-group">
              <label>Credit Score</label>
              <input
                type="number"
                name="creditScore"
                value={formData.creditScore}
                onChange={handleChange}
                placeholder="Credit score"
                min="300"
                max="850"
                required
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                placeholder="WhatsApp Number"
                pattern="[0-9]{10,15}"
                required
              />
            </div>
          </div>

          {/* Account Number (Auto-filled from KYC) */}
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              name="accountNo"
              value={formData.accountNo}
              onChange={handleChange}
              placeholder="Will be auto-filled from KYC"
              readOnly
              className="readonly-input"
            />
            <small className="text-muted">
              ✅ Your KYC is verified and account number is auto-filled
            </small>
          </div>

          {/* Employment & Loan Term */}
          <div className="form-row">
            <div className="form-group">
              <label>Employment Status</label>
              <select
                name="employment"
                value={formData.employment}
                onChange={handleChange}
                required
              >
                <option value="">Select employment</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="retired">Retired</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Loan Term</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
              >
                <option value="15">15 Years</option>
                <option value="20">20 Years</option>
                <option value="30">30 Years</option>
              </select>
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Submit Mortgage Application
          </button>
        </form>

        {/* Mortgage Rates */}
        <div className="mortgage-rates">
          <h3>Current Mortgage Rates</h3>
          <div className="rates-grid">
            <div className="rate-card">
              <h4>15-Year Fixed</h4>
              <p className="rate">5.25%</p>
              <p className="apr">APR 5.45%</p>
            </div>
            <div className="rate-card">
              <h4>30-Year Fixed</h4>
              <p className="rate">5.75%</p>
              <p className="apr">APR 5.95%</p>
            </div>
            <div className="rate-card">
              <h4>5/1 ARM</h4>
              <p className="rate">5.00%</p>
              <p className="apr">APR 5.20%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMortgage;