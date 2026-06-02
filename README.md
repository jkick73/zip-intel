# ZIP · INTEL

Look up fun facts, home prices, income, population, median age, and top news for any US ZIP code — powered by Claude AI.

---

## 🚀 Deploy to Vercel in 5 Steps

### 1. Install Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) (v18 or higher)
- [Git](https://git-scm.com)
- A free [GitHub](https://github.com) account
- A free [Vercel](https://vercel.com) account

### 2. Get Your Anthropic API Key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Navigate to **API Keys** and create a new key
4. Copy it — you'll need it in step 5

### 3. Push to GitHub
```bash
# In this folder, run:
git init
git add .
git commit -m "Initial commit"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/zip-intel.git
git push -u origin main
```

### 4. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your `zip-intel` GitHub repository
4. Leave all build settings as default (Vercel auto-detects React)
5. Click **"Deploy"** — but don't open it yet!

### 5. Add Your API Key (Important!)
1. In your Vercel project dashboard, go to **Settings → Environment Variables**
2. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your API key from step 2
3. Click **Save**
4. Go to **Deployments** and click **"Redeploy"** so the key takes effect

### ✅ Done!
Your site is live at `https://your-project-name.vercel.app`

---

## 🌐 Add a Custom Domain (Optional)
1. Buy a domain from [Namecheap](https://namecheap.com) (~$10/yr)
2. In Vercel: **Settings → Domains → Add Domain**
3. Follow the DNS instructions — usually live in under 5 minutes

---

## 🔒 How the API Key Stays Secret
The frontend (`src/App.js`) never touches your API key.
It calls `/api/lookup` — a serverless function (`api/lookup.js`) that runs on Vercel's servers.
Only that server-side function talks to Anthropic, using the key stored in your environment variables.

---

## 🛠 Local Development
```bash
npm install
npm start        # runs at http://localhost:3000
```

For the API proxy to work locally, install the Vercel CLI:
```bash
npm install -g vercel
vercel dev       # runs at http://localhost:3000 with /api routes working
```
Then create a `.env.local` file:
```
ANTHROPIC_API_KEY=your_key_here
```

---

## Project Structure
```
zip-intel/
├── api/
│   └── lookup.js        ← Serverless function (secret API key lives here)
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.js           ← React frontend
├── vercel.json          ← Routing config
└── package.json
```
