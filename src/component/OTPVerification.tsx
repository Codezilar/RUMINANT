import { useState, useRef, FormEvent, KeyboardEvent, ChangeEvent } from 'react';

interface OTPVerificationProps {
  clerkId: string;
}

const OTPVerification = ({ clerkId }: OTPVerificationProps) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string): void => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      setMessage('Please enter a complete 4-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/verify-otp/${clerkId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId,
          otp: enteredOtp
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('OTP verified successfully! Withdrawal approved.');
        // Reload after a short delay to show success message
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage(data.error || 'OTP verification failed');
      }
    } catch (err) {
      console.error('Error during OTP verification:', err);
      setMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='OTP'>
      <h1>Enter OTP</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', justifyContent: 'center' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value)}
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => handleKeyDown(index, e)}
              ref={(el: HTMLInputElement | null) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }}
              style={{
                width: '50px',
                height: '50px',
                textAlign: 'center',
                fontSize: '18px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              disabled={isLoading}
            />
          ))}
        </div>
        <button 
          type="submit" 
          disabled={isLoading}
          style={{
            padding: '10px 20px',
            backgroundColor: isLoading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      {message && <p style={{ color: message.includes('success') ? 'green' : 'red', marginTop: '15px' }}>{message}</p>}
    </div>
  );
};

export default OTPVerification;