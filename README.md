# Vibraniom

## Description
Vibraniom is a decentralized music platform on Monad blockchain, allowing artists to upload and monetize music as playable NFTs with IPFS storage, pre-order staking via $TOURS token, and features for user streaming, ratings, and subscriptions. The app features guided breathing sessions, mood-based recommendations, and DeFi pools for liquidity.

## Setup and Deployment on Railway

### Prerequisites
- Node.js v18+ (for Hardhat and React Native)
- Python 3.10+ (for FastAPI)
- Android/iOS emulator or device for React Native testing
- Monad testnet wallet with MON tokens (request at https://tally.so/r/wz9vdq)
- Reown Project ID (from cloud.reown.com)
- $TOURS token: 0x2Da15A8B55BE310A7AB8EB0010506AB30CD6CBcf
- Pinata/Infura API key for IPFS
- Railway account for API deployment
- Deployed contract address (update after deployment)
- Envio endpoint (local or hosted)
- Breathing video and demo track CIDs (e.g., ipfs://yang-breathing-cid)

### Step 1: Deploy Smart Contract
1. Clone the repo: `git clone <repo-url>`
2. cd smart-contract
3. npm install
4. Update hardhat.config.js with private key
5. npx hardhat run deploy.js --network monad
6. Note deployed address, update App.js, main.py, config.yaml

### Step 2: Set Up FastAPI on Railway (for Metadata API)
1. cd api
2. Create Railway project, link to GitHub repo (api folder with main.py)
3. Set env vars:
   - CONTRACT_ADDRESS: Deployed address
   - RPC_URL: https://testnet-rpc.monad.xyz
4. Deploy; note URL (e.g., https://vibraniom-api.up.railway.app)

### Step 3: Run React Native App
1. cd app (use Monad Privy template as base)
2. npm install
3. Update App.js with Reown ID, contract address, FastAPI URL
4. npx react-native run-android or run-ios
5. For production: Build APK/iOS app

### Step 4: Set Up Envio Indexer (Local)
1. cd indexer
2. npm install -g @envio-dev/envio
3. Update config.yaml with deployed address
4. envio generate
5. envio start
6. Query at http://localhost:4000/graphql

### Step 5: Test
- Connect wallet in app
- Register as artist (owner approves)
- Upload single/album with IPFS URI and cover image
- Pre-order stake $TOURS
- Claim on release
- Stream/play NFT audio after release date
- Check dashboard for revenues and ratings

## License
MIT
