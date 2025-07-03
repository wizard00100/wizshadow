# ShadowPortals OTP Email System Setup Guide

## Current Issue
The OTP (One-Time Password) email system is not sending emails because the required services are not yet deployed and configured.

## What's Needed

### 1. Deploy Supabase Edge Functions
The Edge Functions for sending and verifying OTPs need to be deployed to your Supabase project:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref cgmsefektyzskbykvaed

# Deploy the functions
supabase functions deploy send-otp
supabase functions deploy verify-otp
```

### 2. Set up Email Service (Resend)
1. Go to [resend.com](https://resend.com) and create an account
2. Get your API key from the dashboard
3. Add the API key to your Supabase project:
   - Go to your Supabase dashboard
   - Navigate to Settings > Edge Functions
   - Add environment variable: `RESEND_API_KEY` = your_resend_api_key

### 3. Verify Domain (Optional but Recommended)
- In Resend dashboard, add and verify your domain
- Update the `from` field in `send-otp/index.ts` to use your verified domain

## Current Fallback Behavior
The system now includes intelligent fallbacks:

1. **Service Detection**: Automatically detects if email service is available
2. **Graceful Degradation**: If email service fails, offers to create account without verification
3. **User Choice**: Users can proceed with or without email verification
4. **Clear Messaging**: Shows appropriate warnings and status messages

## Testing the System

### Test Email Service Availability
Open browser console and look for these messages:
- `Email service may not be available` - Service not deployed
- `OTP sent successfully to email: 123456` - Service working (shows OTP in console for debugging)

### Test OTP Flow
1. Try signing up with a valid email
2. Check console for OTP code (for testing)
3. Enter the 6-digit code in the verification screen

## Quick Setup Commands

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login and link project
supabase login
supabase link --project-ref cgmsefektyzskbykvaed

# 3. Deploy functions
supabase functions deploy send-otp
supabase functions deploy verify-otp

# 4. Set environment variable in Supabase dashboard
# RESEND_API_KEY = your_api_key_from_resend
```

## Verification
After setup, the system should:
1. Send actual emails with OTP codes
2. Verify codes properly
3. Create accounts after successful verification
4. Show proper error messages for invalid/expired codes

## Support
If you encounter issues:
1. Check Supabase function logs in the dashboard
2. Verify environment variables are set
3. Test with a simple email first
4. Check spam folder for emails