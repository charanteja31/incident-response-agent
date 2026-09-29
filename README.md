# 🚀 RescueOps AI — "From Alert → Root Cause → Safe Recovery → Verified Resolution"

RescueOps AI is an intelligent closed-loop incident response platform equipped with an **Incident Knowledge Graph**, **Incident DNA Fingerprinting**, **Root Cause Correlation Engine**, **Blast Radius Predictor**, **Counterfactual Recovery Simulator**, and **Voice & AI Incident Commander**.

---

## 💻 How to Run on Any Laptop (Windows, Mac, Linux)

### Prerequisites:
- **Node.js** (v18 or higher) installed on your system. Download from [nodejs.org](https://nodejs.org/).

### Quick Start (Windows):
1. Extract `RescueOps-AI.zip`.
2. Double-click **`start.bat`**.
3. Open your browser and navigate to: **`http://localhost:3000`**

### Manual Start (Mac / Linux / Windows terminal):
```bash
# 1. Navigate to project folder
cd RescueOps-AI

# 2. Install dependencies
npm install

# 3. Start backend & frontend concurrently
npm run start
```
- **Frontend Dashboard**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 🌐 How to Deploy Online for Public Use (Free)

### Option A: Deploy to Vercel / Netlify (Recommended)
1. Push this repository to GitHub or upload the folder to [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com).
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`

### Option B: Deploy Backend + Frontend on Render / Railway
1. Sign up at [render.com](https://render.com) or [railway.app](https://railway.app).
2. Connect your GitHub repository.
3. Deploy Web Service using command `npm run start`.

### Option C: Share Live URL via LocalTunnel (Instant)
Run the following command in your terminal while the app is running:
```bash
npx localtunnel --port 3000
```
This gives you an instant public `https://....loca.lt` link to share with anyone in the world!
