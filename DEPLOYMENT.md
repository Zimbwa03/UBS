# Deployment Guide for UBS Fundraising App

## Render Deployment

### Prerequisites
1. GitHub repository with your code
2. Render account (free tier available)
3. Supabase project set up

### Steps to Deploy

#### 1. Prepare Your Repository
- Ensure all code is committed and pushed to GitHub
- The `render.yaml` file is already configured for deployment

#### 2. Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` configuration
5. Click "Create Web Service"

#### 3. Environment Variables
The following environment variables are already configured in `render.yaml`:
- `NODE_ENV=production`
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `DATABASE_URL` - Your Supabase database connection string

#### 4. Custom Domain (Optional)
1. In your Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain and follow the DNS configuration instructions

### Alternative Deployment Options

#### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project directory
3. Follow the prompts to configure your project
4. Set environment variables in Vercel dashboard

#### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production

Create a `.env` file in your project root with:
```
VITE_SUPABASE_URL=https://sqbnzpwxbzlmjbqsclia.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_connection_string
NODE_ENV=production
```

### Build Commands
- Development: `npm run dev`
- Production Build: `npm run build`
- Start Production: `npm start`

### Post-Deployment Checklist
- [ ] Test the main fundraising page
- [ ] Test the admin dashboard at `/admin`
- [ ] Verify database connections
- [ ] Test donation functionality
- [ ] Check real-time updates
- [ ] Verify all forms work correctly

### Troubleshooting

#### Common Issues:
1. **Build Failures**: Check that all dependencies are in `package.json`
2. **Environment Variables**: Ensure all required env vars are set
3. **Database Connection**: Verify Supabase credentials are correct
4. **CORS Issues**: Check Supabase RLS policies

#### Support:
- Check Render logs in the dashboard
- Verify Supabase logs in the Supabase dashboard
- Test locally with `npm run build && npm start`

### Security Notes
- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor your Supabase usage and costs

### Attribution
This fundraising application has been built by **Neuronet AI Solutions Pvt.** and includes proper attribution in:
- Main footer of the fundraising page
- Admin dashboard footer
- Database test component

The Neuronet AI Solutions logo and attribution are displayed using the provided Supabase storage URL and should remain intact when deploying to production.
