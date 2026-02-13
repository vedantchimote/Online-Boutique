# Deploying Online Boutique Documentation

This guide covers multiple options for hosting the Mintlify documentation for Online Boutique.

## Table of Contents

1. [Mintlify Cloud (Recommended)](#option-1-mintlify-cloud-recommended)
2. [GitHub Pages](#option-2-github-pages)
3. [Netlify](#option-3-netlify)
4. [Vercel](#option-4-vercel)
5. [Self-Hosted](#option-5-self-hosted)

---

## Option 1: Mintlify Cloud (Recommended)

Mintlify offers free hosting for open-source projects with automatic deployments from GitHub.

### Prerequisites
- GitHub repository with your docs
- Mintlify account (free for open source)

### Steps

1. **Sign up for Mintlify**
   - Go to https://mintlify.com
   - Click "Get Started" or "Sign Up"
   - Sign in with GitHub

2. **Connect Your Repository**
   - Click "New Documentation"
   - Select your GitHub repository
   - Choose the branch (usually `main`)
   - Set the docs directory to `docs/`

3. **Configure Subdomain**
   - Choose a subdomain: `your-project.mintlify.app`
   - Or connect a custom domain

4. **Deploy**
   - Mintlify will automatically build and deploy
   - Every push to your branch triggers a new deployment
   - View your docs at `https://your-project.mintlify.app`

### Custom Domain (Optional)

1. In Mintlify dashboard, go to Settings → Custom Domain
2. Add your domain (e.g., `docs.yourdomain.com`)
3. Add DNS records:
   ```
   Type: CNAME
   Name: docs
   Value: cname.mintlify.com
   ```
4. Wait for DNS propagation (5-30 minutes)

### Advantages
- ✅ Zero configuration
- ✅ Automatic deployments
- ✅ Built-in search
- ✅ Analytics included
- ✅ Free for open source
- ✅ CDN included
- ✅ SSL certificates automatic

---

## Option 2: GitHub Pages

Host your documentation for free on GitHub Pages.

### Prerequisites
- GitHub repository
- Node.js installed locally

### Steps

1. **Install Mintlify CLI**
   ```bash
   npm install -g mintlify
   ```

2. **Build the Documentation**
   ```bash
   cd docs
   mintlify build
   ```
   
   This creates a `_site` directory with static HTML files.

3. **Create GitHub Actions Workflow**
   
   Create `.github/workflows/deploy-docs.yml`:
   
   ```yaml
   name: Deploy Documentation
   
   on:
     push:
       branches: [main]
       paths:
         - 'docs/**'
   
   permissions:
     contents: read
     pages: write
     id-token: write
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - name: Setup Node.js
           uses: actions/setup-node@v4
           with:
             node-version: '18'
             
         - name: Install Mintlify
           run: npm install -g mintlify
           
         - name: Build docs
           run: |
             cd docs
             mintlify build
             
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v2
           with:
             path: docs/_site
     
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v3
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save

5. **Push and Deploy**
   ```bash
   git add .github/workflows/deploy-docs.yml
   git commit -m "Add docs deployment workflow"
   git push
   ```

6. **Access Your Docs**
   - URL: `https://YOUR_USERNAME.github.io/REPO_NAME/`

### Custom Domain (Optional)

1. In repository Settings → Pages → Custom domain
2. Enter your domain: `docs.yourdomain.com`
3. Add DNS record:
   ```
   Type: CNAME
   Name: docs
   Value: YOUR_USERNAME.github.io
   ```

### Advantages
- ✅ Free hosting
- ✅ Automatic deployments via GitHub Actions
- ✅ Custom domain support
- ✅ SSL included

### Disadvantages
- ❌ No built-in search (need to add separately)
- ❌ No analytics (need to add separately)
- ❌ Slower than CDN-based solutions

---

## Option 3: Netlify

Deploy to Netlify for fast CDN hosting with continuous deployment.

### Prerequisites
- GitHub/GitLab/Bitbucket repository
- Netlify account (free tier available)

### Steps

1. **Sign Up for Netlify**
   - Go to https://netlify.com
   - Sign up with GitHub

2. **Create netlify.toml**
   
   In your repository root, create `netlify.toml`:
   
   ```toml
   [build]
     base = "docs"
     command = "npm install -g mintlify && mintlify build"
     publish = "_site"
   
   [build.environment]
     NODE_VERSION = "18"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

3. **Deploy via Netlify UI**
   - Click "Add new site" → "Import an existing project"
   - Choose your Git provider
   - Select your repository
   - Netlify will auto-detect settings from `netlify.toml`
   - Click "Deploy site"

4. **Configure Domain (Optional)**
   - Go to Site settings → Domain management
   - Add custom domain
   - Follow DNS configuration instructions

### Alternative: Deploy via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd docs
mintlify build
netlify deploy --prod --dir=_site
```

### Advantages
- ✅ Fast CDN
- ✅ Automatic deployments
- ✅ Deploy previews for PRs
- ✅ Free SSL
- ✅ Custom domains
- ✅ Generous free tier

---

## Option 4: Vercel

Deploy to Vercel for edge network hosting.

### Prerequisites
- GitHub/GitLab/Bitbucket repository
- Vercel account (free tier available)

### Steps

1. **Sign Up for Vercel**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Create vercel.json**
   
   In your repository root, create `vercel.json`:
   
   ```json
   {
     "buildCommand": "cd docs && npm install -g mintlify && mintlify build",
     "outputDirectory": "docs/_site",
     "framework": null,
     "installCommand": "echo 'No install needed'"
   }
   ```

3. **Deploy via Vercel UI**
   - Click "Add New" → "Project"
   - Import your Git repository
   - Vercel will auto-detect settings
   - Click "Deploy"

4. **Configure Domain (Optional)**
   - Go to Project Settings → Domains
   - Add custom domain
   - Follow DNS configuration

### Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd docs
mintlify build
vercel --prod
```

### Advantages
- ✅ Edge network (very fast)
- ✅ Automatic deployments
- ✅ Preview deployments
- ✅ Free SSL
- ✅ Custom domains
- ✅ Analytics included

---

## Option 5: Self-Hosted

Host on your own server or cloud platform.

### Option 5A: Docker

1. **Create Dockerfile**
   
   Create `docs/Dockerfile`:
   
   ```dockerfile
   FROM node:18-alpine
   
   # Install Mintlify
   RUN npm install -g mintlify
   
   # Copy docs
   WORKDIR /docs
   COPY . .
   
   # Build
   RUN mintlify build
   
   # Serve with nginx
   FROM nginx:alpine
   COPY --from=0 /docs/_site /usr/share/nginx/html
   
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and Run**
   ```bash
   cd docs
   docker build -t online-boutique-docs .
   docker run -p 8080:80 online-boutique-docs
   ```

3. **Access**
   - Open http://localhost:8080

### Option 5B: Static Web Server

1. **Build Documentation**
   ```bash
   cd docs
   npm install -g mintlify
   mintlify build
   ```

2. **Serve with Any Web Server**
   
   **Using Python:**
   ```bash
   cd _site
   python -m http.server 8080
   ```
   
   **Using Node.js:**
   ```bash
   npx serve _site -p 8080
   ```
   
   **Using Nginx:**
   ```nginx
   server {
       listen 80;
       server_name docs.yourdomain.com;
       root /path/to/docs/_site;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Option 5C: Cloud Platforms

**AWS S3 + CloudFront:**
```bash
# Build
cd docs && mintlify build

# Upload to S3
aws s3 sync _site/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

**Google Cloud Storage:**
```bash
# Build
cd docs && mintlify build

# Upload to GCS
gsutil -m rsync -r -d _site/ gs://your-bucket-name/

# Set public access
gsutil iam ch allUsers:objectViewer gs://your-bucket-name
```

**Azure Static Web Apps:**
```bash
# Install Azure CLI
az login

# Create static web app
az staticwebapp create \
  --name online-boutique-docs \
  --resource-group your-rg \
  --source https://github.com/YOUR_USERNAME/REPO_NAME \
  --location "East US 2" \
  --branch main \
  --app-location "docs" \
  --output-location "_site"
```

---

## Comparison Table

| Feature | Mintlify Cloud | GitHub Pages | Netlify | Vercel | Self-Hosted |
|---------|---------------|--------------|---------|--------|-------------|
| **Cost** | Free (OSS) | Free | Free tier | Free tier | Variable |
| **Setup Time** | 5 min | 15 min | 10 min | 10 min | 30+ min |
| **Auto Deploy** | ✅ | ✅ | ✅ | ✅ | Manual |
| **CDN** | ✅ | ❌ | ✅ | ✅ | Optional |
| **Search** | ✅ | ❌ | ❌ | ❌ | Manual |
| **Analytics** | ✅ | ❌ | ✅ | ✅ | Manual |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SSL** | ✅ | ✅ | ✅ | ✅ | Manual |
| **Build Time** | Fast | Medium | Fast | Fast | Variable |
| **Preview Deploys** | ✅ | ❌ | ✅ | ✅ | ❌ |

---

## Recommended Approach

**For Open Source Projects:**
→ Use **Mintlify Cloud** (easiest, best features)

**For Private Projects:**
→ Use **Netlify** or **Vercel** (great free tiers, easy setup)

**For Enterprise:**
→ Use **Self-Hosted** on your cloud platform (full control)

**For GitHub-Centric Workflows:**
→ Use **GitHub Pages** (integrated with your repo)

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Search functionality works (if applicable)
- [ ] Images and diagrams render
- [ ] Code blocks have syntax highlighting
- [ ] Internal links work
- [ ] External links work
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking (if applicable)

---

## Troubleshooting

### Build Fails

**Issue:** `mintlify: command not found`
```bash
# Solution: Install Mintlify globally
npm install -g mintlify
```

**Issue:** Build timeout
```bash
# Solution: Increase build timeout in platform settings
# Or optimize build by removing unnecessary files
```

### Pages Not Loading

**Issue:** 404 errors on routes
```bash
# Solution: Configure SPA fallback
# Add redirect rules to serve index.html for all routes
```

### Images Not Loading

**Issue:** Broken image links
```bash
# Solution: Check image paths are relative to docs/ directory
# Images should be in docs/images/
```

---

## Need Help?

- **Mintlify Docs:** https://mintlify.com/docs
- **GitHub Pages Docs:** https://docs.github.com/pages
- **Netlify Docs:** https://docs.netlify.com
- **Vercel Docs:** https://vercel.com/docs

---

## Next Steps

After deployment:
1. Set up analytics (Google Analytics, Plausible, etc.)
2. Configure search (if not using Mintlify Cloud)
3. Set up monitoring/uptime checks
4. Add deployment status badge to README
5. Share your docs URL with the team!
