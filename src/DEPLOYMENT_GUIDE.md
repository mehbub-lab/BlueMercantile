# BlueMercantile Web3 Integration - Complete Deployment Guide

This guide provides step-by-step instructions to deploy and configure the BlueMercantile Web3 dashboard with MetaMask integration and BlueCarbonToken smart contract on Sepolia testnet.

## 🚀 Quick Start Overview

1. **Get Sepolia ETH** → **Deploy Smart Contract** → **Configure Environment** → **Test Application**

---

## 📋 Prerequisites

- **MetaMask Extension**: [Install MetaMask](https://metamask.io/download/)
- **Sepolia ETH**: Free testnet ETH for gas fees
- **RPC Provider**: Alchemy or Infura account (free)

---

## 🔧 Step 1: Get Sepolia Test ETH

### Option 1: Sepolia Faucets (Recommended)
1. **SepoliaFaucet.com**
   - Visit: https://sepoliafaucet.com/
   - Connect MetaMask to Sepolia
   - Enter your wallet address
   - Complete captcha and request ETH
   - Wait 1-2 minutes for confirmation

2. **Sepolia.dev Faucet**
   - Visit: https://faucet.sepolia.dev/
   - Enter wallet address
   - Request 0.5 ETH (sufficient for testing)

3. **Alternative Faucets**
   - https://sepolia-faucet.pk910.de/
   - https://www.alchemy.com/faucets/ethereum-sepolia

### Verify Your Balance
1. Open MetaMask
2. Switch to Sepolia Test Network
3. Confirm you have at least 0.1 ETH

---

## 🔗 Step 2: Set Up RPC Provider

### Option A: Alchemy (Recommended)
1. Go to [Alchemy.com](https://www.alchemy.com/)
2. Sign up for free account
3. Create new app:
   - **Name**: BlueMercantile
   - **Network**: Ethereum Sepolia
   - **Chain**: Ethereum
4. Copy the HTTPS URL (looks like: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`)

### Option B: Infura
1. Go to [Infura.io](https://infura.io/)
2. Sign up and create project
3. Select Ethereum → Sepolia
4. Copy endpoint URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

---

## 📝 Step 3: Deploy BlueCarbonToken Smart Contract

### Using Remix IDE (No Local Setup Required)

1. **Open Remix**
   - Go to: https://remix.ethereum.org/

2. **Create Contract File**
   - Click "+" to create new file
   - Name it: `BlueCarbonToken.sol`
   - Copy the contract code from `/contracts/BlueCarbonToken.sol`

3. **Compile Contract**
   - Go to "Solidity Compiler" tab (📝 icon)
   - Select compiler version: `0.8.19` or higher
   - Click "Compile BlueCarbonToken.sol"
   - Ensure no compilation errors

4. **Deploy Contract**
   - Go to "Deploy & Run Transactions" tab (🚀 icon)
   - Environment: Select "Injected Provider - MetaMask"
   - MetaMask will popup → Connect your account
   - Ensure you're on Sepolia network
   - In constructor parameters, enter: `1000000000000000000000`
     - This creates 1000 tokens (1000 * 10^18 wei)
   - Click "Deploy" (orange button)
   - Confirm transaction in MetaMask

5. **Copy Contract Address**
   - After deployment, copy the contract address
   - It looks like: `0x1234567890123456789012345678901234567890`
   - Save this address - you'll need it for configuration

### Verify Deployment
1. Go to [Sepolia Etherscan](https://sepolia.etherscan.io/)
2. Search your contract address
3. Confirm the contract is deployed and verified

---

## ⚙️ Step 4: Configure Environment Variables

### For Figma Deployment

1. **Create Environment Variables in Figma**:
   - In your Figma deployment settings, add these variables:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### For Local Development

1. **Copy Environment File**:
```bash
cp .env.example .env
```

2. **Edit .env file**:
```bash
# Replace with your actual values
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
```

---

## 🧪 Step 5: Test the Application

### Initial Testing Checklist

1. **Wallet Connection**
   - [ ] MetaMask connects successfully
   - [ ] Correct network detection (Sepolia)
   - [ ] ETH balance displays correctly
   - [ ] BCT token balance shows (should be 1000 if you're the deployer)

2. **Network Switching**
   - [ ] Wrong network warning appears on other networks
   - [ ] "Switch to Sepolia" button works
   - [ ] Auto-switches to Sepolia testnet

3. **Token Transfers**
   - [ ] Transfer form accepts valid addresses
   - [ ] Amount validation works
   - [ ] MetaMask popup appears for transaction
   - [ ] Transaction shows in recent transactions
   - [ ] Balance updates after confirmation

### Test Token Transfer

1. **Get Test Addresses**:
   - Create second MetaMask account OR
   - Use a friend's address OR
   - Use test address: `0x742c4B40f44aD2b70f0C0Db2d7Dd651cFE1B6D4a`

2. **Perform Transfer**:
   - Connect wallet in dashboard
   - Go to "Transfer" tab
   - Enter recipient address
   - Enter amount (e.g., 10 BCT)
   - Click "Transfer Tokens"
   - Confirm in MetaMask
   - Wait for confirmation (~30 seconds)

3. **Verify Transfer**:
   - Check transaction in "Transactions" tab
   - Verify on Sepolia Etherscan
   - Confirm balance decreased

---

## 🚀 Step 6: Production Deployment

### Deploy to Figma

1. **Upload Files**:
   - Upload all project files to Figma
   - Ensure all dependencies are included

2. **Configure Environment**:
   - Set environment variables in Figma settings
   - Test connection to MetaMask

3. **Test Live Version**:
   - Connect MetaMask
   - Perform test transactions
   - Verify all functionality

### Alternative Deployment Options

- **Vercel**: Connect GitHub repo, add environment variables
- **Netlify**: Deploy from Git, configure build environment
- **GitHub Pages**: Static deployment (requires build setup)

---

## 🔍 Troubleshooting Guide

### Common Issues and Solutions

#### 1. MetaMask Not Connecting
```
Error: MetaMask is not installed
```
**Solution**: Install MetaMask browser extension and refresh page

#### 2. Wrong Network Error
```
Please switch to Sepolia testnet
```
**Solution**: Click "Switch to Sepolia" button or manually switch in MetaMask

#### 3. Contract Not Found
```
Contract address not configured
```
**Solution**: Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` in environment variables

#### 4. RPC Connection Failed
```
Failed to fetch balance
```
**Solution**: 
- Check `NEXT_PUBLIC_RPC_URL` configuration
- Verify Alchemy/Infura API key is correct
- Try different RPC provider

#### 5. Insufficient Gas
```
Transaction failed: insufficient funds for gas
```
**Solution**: Get more Sepolia ETH from faucets

#### 6. Transaction Stuck Pending
**Solution**: 
- Wait 2-3 minutes for Sepolia confirmation
- Check Sepolia Etherscan for transaction status
- Try increasing gas limit in MetaMask

---

## 📊 Testing Scenarios

### Scenario 1: New User Flow
1. User opens dashboard
2. Sees "Connect Wallet" button
3. Connects MetaMask
4. Switches to Sepolia (if needed)
5. Views wallet balance (0 BCT initially)
6. Receives BCT tokens from contract owner
7. Transfers tokens to another address

### Scenario 2: Multi-User Testing
1. Deploy contract from Account A (gets 1000 BCT)
2. Account A transfers 100 BCT to Account B
3. Account B transfers 50 BCT to Account C
4. Verify all transactions appear in respective dashboards

### Scenario 3: Network Switching
1. Connect on Ethereum Mainnet
2. Observe warning message
3. Click switch network button
4. Verify automatic switch to Sepolia

---

## 📈 Advanced Features

### Contract Interaction Examples

```javascript
// Check token balance
const balance = await contract.balanceOf(userAddress);

// Transfer tokens
const tx = await contract.transfer(recipientAddress, amount);

// Mint new tokens (only owner)
const mintTx = await contract.mint(recipientAddress, amount);
```

### Adding Custom Tokens to MetaMask

Help users add BCT token:
1. Token Address: `YOUR_CONTRACT_ADDRESS`
2. Token Symbol: `BCT`
3. Token Decimals: `18`

---

## 🔒 Security Considerations

### For Production Deployment

1. **Environment Variables**: Never expose private keys
2. **Contract Verification**: Verify contract on Etherscan
3. **Access Control**: Implement proper role-based access
4. **Rate Limiting**: Add transaction rate limits
5. **Input Validation**: Validate all user inputs

### Smart Contract Security

- Contract uses standard ERC20 patterns
- Owner-only functions are protected
- No external dependencies
- Simple and auditable code

---

## 📞 Support and Resources

### Documentation Links
- [MetaMask Documentation](https://docs.metamask.io/)
- [Ethereum Sepolia Testnet](https://ethereum.org/en/developers/docs/networks/#sepolia)
- [Ethers.js Documentation](https://docs.ethers.org/)

### Useful Tools
- [Sepolia Etherscan](https://sepolia.etherscan.io/) - Block explorer
- [Remix IDE](https://remix.ethereum.org/) - Smart contract development
- [MetaMask](https://metamask.io/) - Ethereum wallet

### Getting Help
1. Check browser console for errors
2. Verify network connection and MetaMask status
3. Confirm environment variables are set correctly
4. Test with different browsers/devices

---

## ✅ Success Criteria

Your deployment is successful when:

- [ ] MetaMask connects automatically
- [ ] Sepolia network detection works
- [ ] ETH and BCT balances display correctly
- [ ] Token transfers complete successfully
- [ ] Transaction history updates in real-time
- [ ] All UI components respond properly
- [ ] Contract interactions work on live deployment

---

**🎉 Congratulations!** 

You now have a fully functional Web3 dashboard integrated with MetaMask and the Sepolia testnet. Users can connect their wallets, view balances, transfer tokens, and track transactions in a production-ready environment.

For additional support or feature requests, refer to the project documentation or create an issue in the repository.