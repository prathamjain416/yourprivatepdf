# Deployment Guide for Your Private PDF

This guide covers deploying Your Private PDF to Vercel and other platforms.

## Prerequisites

- Node.js 18+ installed locally
- Git repository initialized
- (Optional) GitHub account for automatic deployments

## Vercel Deployment (Recommended)

### Option 1: Using Vercel Dashboard (Easiest)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Next.js and configure settings
6. Click "Deploy"

### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from project root
vercel

# For production deployment
vercel --prod
```

### Option 3: Using Git (Automatic Deployments)

1. Connect your GitHub repository to Vercel
2. Vercel automatically deploys on push to main branch
3. Preview deployments for pull requests
4. Automatic rollbacks if deployment fails

## Environment Setup

1. Copy environment template:
```bash
cp .env.example .env.local
```

2. No environment variables are required, but you can customize:
   - `NEXT_PUBLIC_APP_NAME`: Application display name

## Build Configuration

The project is pre-configured with `next.config.mjs` and `vercel.json` for optimal Vercel deployment:

- **Framework**: Next.js 16
- **Node Version**: 18.x
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Performance Optimizations

The deployment includes:

- **SWC Compiler**: Faster builds and smaller bundle sizes
- **Image Optimization**: WebP and AVIF format support
- **Static Caching**: 1-year cache for static assets
- **Compression**: Gzip and Brotli compression enabled
- **Security Headers**: XSS protection, content type sniffing prevention

## Monitoring & Logs

### View Deployment Logs

```bash
# Using Vercel CLI
vercel logs [URL]
```

### Check Performance

1. Visit Vercel Dashboard → Project → Analytics
2. Monitor:
   - Function duration
   - Cold starts
   - Request count
   - Error rate

## Troubleshooting

### Build Failures

1. Check build logs in Vercel Dashboard
2. Ensure all dependencies are in `package.json`
3. Verify `tsconfig.json` is correct
4. Run locally: `npm run build`

### Runtime Errors

1. Check browser console for errors
2. Verify all imports are correct
3. Check for missing environment variables
4. Test in multiple browsers

### Performance Issues

1. Check browser DevTools Performance tab
2. Verify WebAssembly modules are loading
3. Monitor memory usage for large files
4. Consider file size limits for users

## Custom Domain

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records (follow Vercel instructions)
4. SSL certificate auto-generated

## Environment Variables (Optional)

For advanced configuration, add to Vercel project settings:

```
NEXT_PUBLIC_APP_NAME=Your Private PDF
```

## Rollback

If deployment fails:

1. Vercel → Deployments → Click previous successful deployment
2. Click "Redeploy" to restore previous version
3. OR use Git to revert commits and redeploy

## Local Production Testing

```bash
# Build for production
npm run build

# Start production server
npm start

# Open http://localhost:3000
```

## Continuous Deployment

Vercel automatically:
- Deploys on every push to main branch
- Creates preview deployments for pull requests
- Runs automatic type checking
- Applies security headers

## Security Checklist

- [ ] No sensitive data in environment variables
- [ ] All API calls are HTTPS
- [ ] Security headers configured (already done)
- [ ] Content Security Policy set (optional)
- [ ] Rate limiting enabled (if needed)

## Scaling

Your Private PDF scales automatically on Vercel:
- Serverless functions handle requests
- Auto-scaling based on demand
- No server management needed
- Pay-as-you-go pricing

## Monitoring

### Set Up Alerts (Vercel Pro)

1. Dashboard → Settings → Alerts
2. Configure notifications for:
   - Deployment failures
   - Error rates
   - Performance degradation

## Analytics

Vercel provides:
- Real-time analytics
- Geographic data
- Device information
- Performance metrics

## Cost Optimization

For a privacy-first static app:
- Uses minimal bandwidth (mostly static assets)
- No database costs
- Minimal function execution (client-side processing)
- Very low monthly costs on Vercel free tier

## Support

For deployment issues:
- Check Vercel docs: https://vercel.com/docs
- Check Next.js docs: https://nextjs.org/docs
- Review error logs in Vercel Dashboard
- Contact Vercel support (Pro plan)

## Next Steps After Deployment

1. Test all PDF conversion tools
2. Verify OCR works (requires WASM)
3. Test on different devices/browsers
4. Enable Web Analytics
5. Set up custom domain
6. Configure monitoring/alerts
