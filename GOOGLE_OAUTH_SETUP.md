# Google OAuth Setup Guide

This guide will help you set up Google OAuth for the "Continue with Google" login feature.

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top
3. Click "New Project"
4. Enter project name (e.g., "Monastery360")
5. Click "Create"

## Step 2: Enable Google Identity Services

1. In your Google Cloud project, go to "APIs & Services" > "Library"
2. Search for "Google Identity Services API" or "Google+ API"
3. Click on it and then click "Enable"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the consent screen:
   - Choose "External" user type
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes: email, profile, openid
4. For OAuth client ID:
   - Application type: "Web application"
   - Name: "Monastery360 Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - Your production domain (e.g., `https://yourdomain.com`)
   - Authorized redirect URIs: (leave empty for this setup)
5. Click "Create"

## Step 4: Configure Your Application

1. Copy the "Client ID" from the credentials page
2. Open your `.env` file in the project root
3. Replace the placeholder with your actual Client ID:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your_actual_client_id_here.apps.googleusercontent.com
   ```
4. Restart your development server: `npm start`

## Step 5: Test the Integration

1. Open your application
2. Go to the login page
3. You should now see the "Continue with Google" button
4. Click it to test the Google login flow

## Troubleshooting

### Common Issues:

1. **400 Error**: Usually means invalid Client ID or domain not authorized
   - Verify Client ID is correct in `.env` file
   - Make sure your domain is added to authorized origins

2. **Button not showing**: Check browser console for errors
   - Verify `.env` file has the correct Client ID
   - Make sure you restarted the server after changing `.env`

3. **Popup blocked**: Browser might block the Google login popup
   - Allow popups for your domain
   - Try using incognito mode

### Security Notes:

- Never commit your actual Client ID to public repositories
- Use environment variables for sensitive configuration
- Set up proper authorized domains for production

## Development vs Production

**Development:**
- Use `http://localhost:3000` as authorized origin
- Test with your personal Google account

**Production:**
- Add your production domain to authorized origins
- Consider setting up a separate Google Cloud project for production
- Update the consent screen with production URLs

## Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify all steps above are completed
3. Check Google Cloud Console for any API errors
4. Ensure your domain is properly configured in authorized origins

The Google login feature will be hidden until a valid Client ID is configured, so your regular email/password login will continue to work normally.