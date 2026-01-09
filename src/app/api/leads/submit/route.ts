import { NextRequest, NextResponse } from 'next/server';

// Email configuration - supports Resend
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'leads@granitereply.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'GraniteReply <noreply@granitereply.com>';

interface LeadData {
  fullName: string;
  email: string;
  businessName: string;
  plan: string;
}

async function sendEmailWithResend(lead: LeadData) {
  if (!RESEND_API_KEY) {
    console.log('Resend API key not configured. Lead data:', lead);
    return { success: true, message: 'Email skipped - no API key' };
  }

  const emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Lead Submission</h1>
      </div>
      <div style="padding: 30px; background: #f9fafb;">
        <h2 style="color: #1f2937; margin-top: 0;">Lead Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Full Name</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${lead.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Email</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
              <a href="mailto:${lead.email}" style="color: #0ea5e9;">${lead.email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Business Name</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">${lead.businessName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #374151;">Selected Plan</td>
            <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #1f2937;">
              <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 9999px; font-size: 14px;">
                ${lead.plan.charAt(0).toUpperCase() + lead.plan.slice(1)}
              </span>
            </td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #374151;">Submitted At</td>
            <td style="padding: 12px; color: #1f2937;">${new Date().toLocaleString('en-US', { 
              dateStyle: 'full', 
              timeStyle: 'short',
              timeZone: 'America/New_York'
            })} ET</td>
          </tr>
        </table>
        <div style="margin-top: 30px; padding: 20px; background: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #065f46; font-weight: 500;">
            ⏰ Please follow up within 24 hours as promised!
          </p>
        </div>
      </div>
      <div style="padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
        GraniteReply Lead Notification System
      </div>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject: `🎯 New Lead: ${lead.businessName} - ${lead.fullName}`,
      html: emailHtml,
      reply_to: lead.email,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Resend API error:', error);
    throw new Error('Failed to send email');
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadData = await request.json();
    const { fullName, email, businessName, plan } = body;

    // Validate required fields
    if (!fullName || !email || !businessName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Log the lead (always do this as backup)
    console.log('New lead submission:', {
      fullName,
      email,
      businessName,
      plan: plan || 'starter',
      submittedAt: new Date().toISOString(),
    });

    // Send notification email
    try {
      await sendEmailWithResend({
        fullName,
        email,
        businessName,
        plan: plan || 'starter',
      });
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('Email notification failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Lead submitted successfully',
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit lead' },
      { status: 500 }
    );
  }
}
