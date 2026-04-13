# Deployment Guide for Vercel

This guide will help you deploy the Monastery360 application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
2. [Vercel CLI](https://vercel.com/download) installed (optional, but recommended)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to Git Repository

1. Make sure your code is committed to a Git repository
2. Push your repository to GitHub, GitLab, or Bitbucket

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Add New Project"** or **"Import Project"**
3. Connect your Git provider (GitHub/GitLab/Bitbucket)
4. Select the `monastery` repository
5. Vercel will automatically detect it as a Create React App project

### Step 3: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

- `REACT_APP_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
- `REACT_APP_API_URL`: Your backend API URL (already set to https://form-backend-gold.vercel.app)

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-3 minutes)
3. Your site will be live at `https://your-project-name.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project root directory:

```bash
# For production deployment
vercel --prod

# Or for preview deployment
vercel
```

### Step 4: Set Environment Variables

```bash
vercel env add REACT_APP_GOOGLE_CLIENT_ID
vercel env add REACT_APP_API_URL
```

## Configuration Files

- **`vercel.json`**: Contains Vercel-specific configuration
- **`.env.example`**: Template for environment variables (don't commit `.env` file)

## Post-Deployment

### Update Google OAuth Settings

After deployment, update your Google OAuth configuration:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services > Credentials**
3. Select your OAuth 2.0 Client ID
4. Add your Vercel URL to **Authorized JavaScript origins**:
   - `https://your-project-name.vercel.app`
5. Add to **Authorized redirect URIs**:
   - `https://your-project-name.vercel.app`
   - `https://your-project-name.vercel.app/login`

### Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to **Domains**
3. Add your custom domain
4. Follow the DNS configuration instructions

## Continuous Deployment

Once connected to Git, Vercel automatically:
- Deploys every push to the main branch
- Creates preview deployments for pull requests
- Runs build checks before deployment

## Troubleshooting

### Build Fails

- Check the build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set correctly

### 404 Errors on Refresh

- The `vercel.json` configuration handles this with rewrites
- All routes redirect to `index.html` for client-side routing

### Environment Variables Not Working

- Environment variables in Create React App must start with `REACT_APP_`
- You need to redeploy after updating environment variables
- Check the Vercel dashboard > Settings > Environment Variables

## Useful Commands

```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Remove a deployment
vercel remove [deployment-url]
```

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
