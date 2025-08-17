## DevLink Portal

Full-stack Solana-enabled developer networking portal with jobs/feed, profiles, auth, and AI-assisted skill extraction.

### Stack
- Backend: Node.js, Express, Mongoose, JWT, CORS, dotenv
- Frontend: React + TypeScript (Vite), Tailwind CSS, React Router, Axios, Framer Motion
- Web3: @solana/wallet-adapter (Phantom), @solana/web3.js

### Prerequisites
- Node.js 20.19+ recommended (works with 20.17 with warnings)
- MongoDB connection string
- A Solana wallet address for `ADMIN_WALLET_ADDRESS` on devnet

### Setup

1) Backend
```
cd devlink-portal/server
cp .env.example .env # if example exists; else create with values below
# .env content
MONGO_URI="<your-mongodb-uri>"
JWT_SECRET="supersecretjwtkey"
ADMIN_WALLET_ADDRESS="<your-admin-wallet>"
SOLANA_NETWORK="devnet"
PORT=5000

npm install
npm run dev
```

2) Frontend
```
cd devlink-portal/client
echo VITE_API_BASE="http://localhost:5000" > .env
echo VITE_ADMIN_WALLET_ADDRESS="<your-admin-wallet>" >> .env
echo VITE_SOLANA_NETWORK="devnet" >> .env

npm install
npm start
```

### Features
- Auth: Register/Login/JWT, `GET /api/auth/me`
- Profiles: Get/Update self, get by user, AI-driven skill suggestions from bio
- Posts: Create job/feed post, filter by skills, Solana devnet payment gating for job posting
- UI: Glassmorphism navbar, layout, animated cards, responsive design

### Notes
- Posting a job requires connecting Phantom and paying 0.0001 SOL to `ADMIN_WALLET_ADDRESS` on devnet.
- Ensure your wallet has devnet SOL: use the official faucet.


