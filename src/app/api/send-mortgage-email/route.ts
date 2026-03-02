import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface MortgageFormData {
  fullName: string;
  email: string;
  phoneNo: string;
  accountNo: string;
  propertyValue: string;
  loanAmount: string;
  income: string;
  creditScore: string;
  employment: string;
  duration: string;
}

interface EmailResult {
  success: boolean;
  messageId?: string;
  email?: string;
  error?: string;
}

export async function POST(request: Request) {
  try {
    const formData: MortgageFormData = await request.json();

    console.log('🔔 Received mortgage application request');
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
    console.error('💥 Mortgage application error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// Send email to admin with mortgage application details
async function sendAdminNotification(formData: MortgageFormData): Promise<EmailResult> {
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
      from: `"Kingadox Mortgage System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `New Mortgage Application - ${formData.fullName} (Acc: ${formData.accountNo})`,
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
                background: #dc2626;
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
              .account-highlight {
                background: #fef2f2;
                border-left: 4px solid #dc2626;
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
                <h2>New Mortgage Application Submitted</h2>
              </div>
              <div class="content">
                <div class="account-highlight">
                  <div class="data-label">APPLICANT EMAIL</div>
                  <div class="data-value" style="font-size: 16px; color: #dc2626; font-weight: bold;">
                    ${formData.email}
                  </div>
                  <div class="data-label">ACCOUNT NUMBER</div>
                  <div class="data-value" style="font-size: 18px; color: #dc2626; font-weight: bold;">
                    ${formData.accountNo}
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
                    <div class="data-label">Phone Number</div>
                    <div class="data-value">${formData.phoneNo}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Account Number</div>
                    <div class="data-value" style="font-weight: bold;">${formData.accountNo}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Property Value</div>
                    <div class="data-value">$${Number(formData.propertyValue).toLocaleString()}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Loan Amount</div>
                    <div class="data-value">$${Number(formData.loanAmount).toLocaleString()}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Annual Income</div>
                    <div class="data-value">$${Number(formData.income).toLocaleString()}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Credit Score</div>
                    <div class="data-value">${formData.creditScore}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Employment</div>
                    <div class="data-value">${formData.employment}</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Loan Term</div>
                    <div class="data-value">${formData.duration} years</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">LTV Ratio</div>
                    <div class="data-value">${((Number(formData.loanAmount) / Number(formData.propertyValue)) * 100).toFixed(1)}%</div>
                  </div>
                  <div class="data-item">
                    <div class="data-label">Submission Time</div>
                    <div class="data-value">${new Date().toLocaleString()}</div>
                  </div>
                </div>

                <p><strong>Action Required:</strong> Please review this mortgage application in the admin portal.</p>
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
async function sendCustomerConfirmation(formData: MortgageFormData): Promise<EmailResult> {
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
      subject: 'Your Mortgage Application Has Been Received - Kingadox Bank',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { 
                font-family: 'Arial', sans-serif; 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
                background: linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%);
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
                background: #f0f9ff;
                border-left: 4px solid #3b82f6;
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
                color: #1e40af;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <div class="bank-logo">Kingadox Bank</div>
                <h1>Mortgage Application Received</h1>
              </div>
              <div class="content">
                <p>Dear <span class="highlight">${formData.fullName}</span>,</p>
                
                <div class="status-card">
                  <h3>✅ Application Successfully Received</h3>
                  <p>We've received your mortgage request and it's currently being processed.</p>
                </div>

                <p><strong>Application Details:</strong></p>
                <ul>
                  <li><strong>Property Value:</strong> $${Number(formData.propertyValue).toLocaleString()}</li>
                  <li><strong>Loan Amount:</strong> $${Number(formData.loanAmount).toLocaleString()}</li>
                  <li><strong>Loan Term:</strong> ${formData.duration} years</li>
                  <li><strong>LTV Ratio:</strong> ${((Number(formData.loanAmount) / Number(formData.propertyValue)) * 100).toFixed(1)}%</li>
                </ul>

                <p>Our team will review your application and contact you within 2-3 business days.</p>
                
                <p><strong>Reference Number:</strong> MRT-${Date.now().toString().slice(-6)}</p>
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