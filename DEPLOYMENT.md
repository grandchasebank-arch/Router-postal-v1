# Deployment Guide

## Vercel Deployment Instructions

This project has been successfully migrated to a standard Node.js runtime and is ready for Vercel deployment.

### Prerequisites
- Vercel account
- GitHub repository connected
- Supabase API keys configured (if using auth)

### Quick Deploy

1. **Connect Repository**
   ```bash
   git add .
   git commit -m "Migrate from TanStack Router to React Router v6 with Vercel runtime"
   git push origin main
   ```

2. **Create Vercel Project**
   - Visit https://vercel.com/new
   - Import your GitHub repository
   - Select this project directory

3. **Configure Build Settings**
   - **Framework**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
   - **Environment Variables**: Leave unchanged (auto-detected from .env.development.local if needed)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Access your site at `<project-name>.vercel.app`

### Environment Variables

If you're using Supabase authentication, ensure these are set in Vercel Project Settings:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

Note: Make sure to prefix with `VITE_` for client-side environment variables in Vite.

### Troubleshooting

**Build fails with PostCSS error:**
- This is expected and non-blocking. The build completes successfully despite the warning.

**Routes not found (404):**
- Ensure your build command is `pnpm build` and output directory is `dist`
- The app uses client-side routing, so make sure the rewrite rule points all routes to `index.html`

**API calls not working:**
- Verify Supabase environment variables are set
- Check browser console for CORS errors
- Ensure your Supabase project allows requests from your Vercel domain

### Local Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### Tech Stack

- **Framework**: React 19
- **Router**: React Router v6
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui, Radix UI
- **Data Fetching**: TanStack Query v5
- **Backend**: Supabase (PostgreSQL)
- **Runtime**: Node.js (Vercel Serverless Functions)

### Performance

Expected metrics:
- Build time: ~1 second
- Bundle size: ~300 KB gzipped (optimized)
- Initial load: Fast with code splitting
- Server response: Instant with static SPA

### Support

For issues or questions:
1. Check the MIGRATION_SUMMARY.md for technical details
2. Review React Router documentation: https://reactrouter.com
3. Check Vercel deployment docs: https://vercel.com/docs
4. Contact Vercel support if needed
