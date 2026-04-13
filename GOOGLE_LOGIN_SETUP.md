# Google Login Setup - Backend Configuration

## Backend Environment Variable

Your backend needs the `GOOGLE_CLIENT_ID` environment variable to verify Google tokens.

### Add to Vercel Backend:

```bash
vercel env add GOOGLE_CLIENT_ID
# When prompted, paste: 25740854533-4k3k967j78di3j5rcjvm559bbjtp3sdu.apps.googleusercontent.com
```

Or in Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Select your backend project (monestry-backend)
3. Go to Settings → Environment Variables
4. Click "Add New"
5. Name: `GOOGLE_CLIENT_ID`
6. Value: `25740854533-4k3k967j78di3j5rcjvm559bbjtp3sdu.apps.googleusercontent.com`
7. Select all environments (Production, Preview, Development)
8. Save and redeploy

## Testing

After setting the environment variable:
1. Go to your login page
2. Click "Continue with Google"
3. Select your Google account
4. You should be logged in and redirected to the home page

## Troubleshooting

### If you see "Google login failed":
1. Check browser console for detailed error message
2. Verify `GOOGLE_CLIENT_ID` is set in Vercel backend
3. Ensure backend is redeployed after adding the env variable
4. Verify your domain is authorized in Google Cloud Console

### Check backend logs in Vercel:
1. Go to Vercel Dashboard → Your Backend Project
2. Click on "Deployments"
3. Click on the latest deployment
4. View "Functions" logs to see any errors
