// In src/lib/kycApi.ts
export const getKycByClerkId = async (clerkId: string) => {
  try {
    const response = await fetch(`/api/kyc/${encodeURIComponent(clerkId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch KYC data');
    }

    const data = await response.json();
    return data.kyc;
  } catch (error) {
    console.error('Error fetching KYC data:', error);
    throw error;
  }
};