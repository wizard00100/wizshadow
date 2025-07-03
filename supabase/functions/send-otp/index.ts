import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface OTPRequest {
  email: string;
  name: string;
  type: 'signup' | 'reset';
}

interface OTPStore {
  [email: string]: {
    otp: string;
    expires: number;
    attempts: number;
  }
}

// In-memory OTP storage (in production, use Redis or database)
const otpStore: OTPStore = {};

// Clean expired OTPs every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(otpStore).forEach(email => {
    if (otpStore[email].expires < now) {
      delete otpStore[email];
    }
  });
}, 5 * 60 * 1000);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendEmail(to: string, subject: string, htmlBody: string, textBody: string) {
  // Using Resend API for email sending
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not found in environment variables');
    throw new Error('Email service not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ShadowPortals <noreply@shadowportals.dev>',
      to: [to],
      subject: subject,
      html: htmlBody,
      text: textBody,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Email send failed:', error);
    throw new Error('Failed to send email');
  }

  return await response.json();
}

function createEmailTemplate(name: string, otp: string, type: 'signup' | 'reset'): { html: string; text: string } {
  const title = type === 'signup' ? 'Verify Your Email' : 'Reset Your Password';
  const message = type === 'signup' 
    ? 'Welcome to the dark side! Please verify your email to complete your registration.'
    : 'You requested a password reset. Use the code below to reset your password.';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ShadowPortals: ${title}</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
          color: #ffffff;
          margin: 0;
          padding: 20px;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          border: 1px solid #dc2626;
          border-radius: 12px;
          overflow: hidden;
        }
        .header { 
          background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
          padding: 30px 20px; 
          text-align: center; 
        }
        .header h1 { 
          margin: 0; 
          font-size: 28px; 
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
        .content { 
          padding: 40px 30px; 
          text-align: center; 
        }
        .greeting { 
          font-size: 18px; 
          margin-bottom: 20px; 
          color: #dc2626;
          font-weight: bold;
        }
        .message { 
          font-size: 16px; 
          line-height: 1.6; 
          margin-bottom: 30px; 
          color: #cccccc;
        }
        .otp-container { 
          background: rgba(220, 38, 38, 0.1);
          border: 2px solid #dc2626;
          border-radius: 8px;
          padding: 25px; 
          margin: 30px 0; 
        }
        .otp-label { 
          font-size: 14px; 
          color: #dc2626; 
          margin-bottom: 10px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .otp-code { 
          font-size: 36px; 
          font-weight: bold; 
          color: #ffffff;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
          text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
        }
        .expiry { 
          font-size: 14px; 
          color: #999999; 
          margin-top: 15px;
        }
        .warning { 
          background: rgba(239, 68, 68, 0.1);
          border-left: 4px solid #ef4444;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
          color: #cccccc;
        }
        .footer { 
          background: #0a0a0a;
          padding: 20px; 
          text-align: center; 
          font-size: 12px; 
          color: #666666;
          border-top: 1px solid #333333;
        }
        .footer a { 
          color: #dc2626; 
          text-decoration: none; 
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ShadowPortals</h1>
        </div>
        <div class="content">
          <div class="greeting">Greetings, ${name}</div>
          <div class="message">${message}</div>
          
          <div class="otp-container">
            <div class="otp-label">Your Verification Code</div>
            <div class="otp-code">${otp}</div>
            <div class="expiry">This code expires in 5 minutes</div>
          </div>
          
          <div class="warning">
            <strong>Security Notice:</strong> Never share this code with anyone. ShadowPortals will never ask for your verification code via phone or email.
          </div>
        </div>
        <div class="footer">
          <p>This email was sent by ShadowPortals. If you didn't request this, please ignore this email.</p>
          <p>© 2024 ShadowPortals. All rights reserved across the galaxy.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
ShadowPortals: ${title}

Greetings, ${name}

${message}

Your verification code is: ${otp}

This code expires in 5 minutes.

Security Notice: Never share this code with anyone. ShadowPortals will never ask for your verification code via phone or email.

If you didn't request this, please ignore this email.

© 2024 ShadowPortals. All rights reserved across the galaxy.
  `;

  return { html, text };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, name, type }: OTPRequest = await req.json();

    if (!email || !name || !type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, name, type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Rate limiting: Check if OTP was recently sent
    const existing = otpStore[email];
    if (existing && (Date.now() - (existing.expires - 5 * 60 * 1000)) < 30 * 1000) {
      return new Response(
        JSON.stringify({ error: 'Please wait 30 seconds before requesting another OTP' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore[email] = {
      otp,
      expires,
      attempts: 0
    };

    // Create email content
    const { html, text } = createEmailTemplate(name, otp, type);
    const subject = `ShadowPortals: ${type === 'signup' ? 'Verify Your Email' : 'Reset Your Password'}`;

    // Send email
    try {
      await sendEmail(email, subject, html, text);
      console.log(`OTP sent successfully to ${email}: ${otp}`); // For debugging
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      return new Response(
        JSON.stringify({ error: 'Failed to send verification email' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        expires: expires
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-otp function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});