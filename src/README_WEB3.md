# 🌊 BlueMercantile Web3 Dashboard

A complete Web3-enabled dashboard for BlueMercantile's carbon credit platform, featuring MetaMask integration and BlueCarbonToken (BCT) management on Sepolia testnet.

## 🚀 Features

### 🔗 Wallet Integration
- **MetaMask Connection**: One-click wallet connection
- **Network Detection**: Automatic Sepolia testnet detection
- **Auto-Switch**: Seamless network switching with user confirmation
- **Balance Display**: Real-time ETH and BCT token balances

### 💰 Token Management
- **BlueCarbonToken (BCT)**: Custom ERC20 token for carbon credits
- **Transfer System**: Send tokens to any Ethereum address
- **Transaction History**: Real-time transaction tracking
- **Gas Fee Estimation**: Transparent transaction cost display

### 📊 Dashboard Features
- **Multi-User Support**: Patron and Credit Client dashboards
- **Real-time Updates**: Live balance and transaction updates
- **Transaction Explorer**: Direct links to Sepolia Etherscan
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │◄──►│    MetaMask      │◄──►│ Sepolia Testnet │
│   Dashboard     │    │    Provider      │    │   Blockchain    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Web3 Hooks    │    │   Ethers.js      │    │ BlueCarbonToken │
│   & Utilities   │    │   Library        │    │ Smart Contract  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 📁 Project Structure

```
BlueMercantile Web3/
├── components/
│   ├── WalletConnect.tsx      # Wallet connection component
│   ├── TransferForm.tsx       # Token transfer interface
│   ├── TransactionsTable.tsx  # Transaction history display
│   └── UserDashboard.tsx      # Updated dashboard with Web3
├── hooks/
│   └── useWallet.tsx          # Custom Web3 React hook
├── utils/
│   └── web3.tsx               # Web3 utilities and constants
├── contracts/
│   └── BlueCarbonToken.sol    # Smart contract source code
├── .env.example               # Environment variable template
├── DEPLOYMENT_GUIDE.md        # Complete deployment instructions
└── README_WEB3.md            # This file
```

## 🔧 Components Overview

### WalletConnect Component
```tsx
import { WalletConnect } from './components/WalletConnect';

// Features:
// - Connect/disconnect wallet
// - Network status indicator
// - Balance display (ETH & BCT)
// - Network switching button
// - Testnet faucet links
```

### TransferForm Component
```tsx
import { TransferForm } from './components/TransferForm';

// Features:
// - Recipient address validation
// - Amount input with balance checking
// - Gas fee warnings
// - Transaction submission
// - Success/error handling
```

### TransactionsTable Component
```tsx
import { TransactionsTable } from './components/TransactionsTable';

// Features:
// - Transaction history display
// - Status indicators (pending/confirmed/failed)
// - Etherscan integration
// - Transaction type identification
// - Real-time updates
```

### useWallet Hook
```tsx
import { useWallet } from './hooks/useWallet';

const {
  address,           // Connected wallet address
  isConnected,       // Connection status
  isCorrectNetwork,  // Sepolia network check
  ethBalance,        // ETH balance
  tokenBalance,      // BCT token balance
  transactions,      // Transaction history
  connectWallet,     // Connect function
  transferTokens,    // Transfer function
  switchNetwork      // Network switch function
} = useWallet();
```

## 💻 Smart Contract

### BlueCarbonToken (BCT)
- **Type**: ERC20-compatible token
- **Symbol**: BCT
- **Decimals**: 18
- **Network**: Sepolia Testnet

#### Key Functions:
```solidity
// Transfer tokens
function transfer(address to, uint256 amount) returns (bool)

// Check balance
function balanceOf(address owner) returns (uint256)

// Mint new tokens (owner only)
function mint(address to, uint256 amount) returns (bool)

// Get total supply
function totalSupply() returns (uint256)
```

## 🚀 Quick Start

### 1. Prerequisites
- MetaMask browser extension
- Sepolia testnet ETH (from faucets)
- Alchemy or Infura RPC endpoint

### 2. Deploy Smart Contract
```bash
# Using Remix IDE:
1. Go to https://remix.ethereum.org/
2. Create BlueCarbonToken.sol
3. Compile with Solidity 0.8.19+
4. Deploy with initial supply: 1000000000000000000000
5. Copy contract address
```

### 3. Configure Environment
```bash
# Set environment variables:
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddress
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
```

### 4. Test Application
```bash
# Basic testing flow:
1. Connect MetaMask wallet
2. Switch to Sepolia testnet
3. View token balances
4. Transfer tokens between accounts
5. Monitor transaction history
```

## 🧪 Testing Guide

### Test Scenarios

#### Scenario 1: First-Time User
1. User opens dashboard
2. Sees "Connect Wallet" button
3. Connects MetaMask successfully
4. Receives network switch prompt (if needed)
5. Views balances (0 BCT initially)

#### Scenario 2: Token Transfer
1. Connected user goes to Transfer tab
2. Enters valid recipient address
3. Specifies transfer amount
4. Confirms transaction in MetaMask
5. Monitors transaction status
6. Verifies balance update

#### Scenario 3: Network Management
1. User connects on wrong network
2. Sees network warning message
3. Clicks "Switch to Sepolia"
4. MetaMask prompts network change
5. Application updates automatically

### Test Data

```javascript
// Test addresses for transfers:
const testAddresses = [
  "0x742c4B40f44aD2b70f0C0Db2d7Dd651cFE1B6D4a",
  "0x8ba1f109551bD432803012645Hac136c74616D4a",
  "0xD1220A0cf47c7B9Be7A2E6BA89F429762e7b9aDb"
];

// Test amounts (in BCT):
const testAmounts = ["10", "25.5", "100"];
```

## 🔒 Security Features

### Smart Contract Security
- **Owner-only minting**: Only contract deployer can mint
- **Transfer validation**: Prevents zero-address transfers
- **Balance checking**: Prevents overdraft transfers
- **Event logging**: All transfers are logged

### Frontend Security
- **Input validation**: All user inputs are validated
- **Error handling**: Comprehensive error messages
- **Transaction verification**: Status checking and confirmations
- **Network verification**: Ensures correct network usage

## 🌐 Environment Configuration

### Required Environment Variables

```bash
# Smart contract address (after deployment)
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890

# Sepolia RPC endpoint
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Optional: Custom chain configuration
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_CHAIN_NAME="Sepolia Test Network"
```

### RPC Provider Setup

#### Alchemy (Recommended)
1. Sign up at [alchemy.com](https://www.alchemy.com/)
2. Create new app for Ethereum Sepolia
3. Copy HTTPS endpoint

#### Infura Alternative
1. Sign up at [infura.io](https://infura.io/)
2. Create project and select Sepolia
3. Use endpoint: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

## 📱 User Experience

### Wallet Connection Flow
```
┌─ User opens dashboard
├─ Clicks "Connect Wallet"
├─ MetaMask popup appears
├─ User approves connection
├─ Network check performed
├─ Balance retrieval
└─ Dashboard ready for use
```

### Transfer Flow
```
┌─ User enters Transfer tab
├─ Inputs recipient address
├─ Specifies transfer amount
├─ Validates input data
├─ Estimates gas costs
├─ User confirms in MetaMask
├─ Transaction submitted
├─ Status monitoring begins
└─ Balance updates on confirmation
```

## 🛠️ Development

### Adding New Features

#### Custom Token Functions
```typescript
// Add to useWallet hook:
const approveTokens = async (spender: string, amount: string) => {
  const contract = getContract(provider).connect(signer);
  return await contract.approve(spender, parseEther(amount));
};
```

#### Additional Contract Interactions
```typescript
// Get contract metadata:
const getTokenInfo = async () => {
  const contract = getContract(provider);
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals(),
    contract.totalSupply()
  ]);
  return { name, symbol, decimals, totalSupply };
};
```

### Error Handling Patterns
```typescript
try {
  const tx = await contract.transfer(to, amount);
  // Handle success
} catch (error: any) {
  if (error.code === 'ACTION_REJECTED') {
    // User rejected transaction
  } else if (error.code === 'INSUFFICIENT_FUNDS') {
    // Insufficient balance
  } else {
    // Other errors
  }
}
```

## 🔍 Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| MetaMask not detected | Extension not installed | Install MetaMask extension |
| Wrong network warning | Not on Sepolia | Use switch network button |
| Contract not found | Wrong contract address | Verify environment variables |
| Transaction fails | Insufficient gas | Get more Sepolia ETH |
| Balance not updating | RPC connection issue | Check RPC URL configuration |

### Debug Tools

```typescript
// Enable detailed logging:
const debugMode = process.env.NODE_ENV === 'development';

// Log transaction details:
if (debugMode) {
  console.log('Transaction:', {
    hash: tx.hash,
    from: tx.from,
    to: tx.to,
    value: tx.value,
    gasLimit: tx.gasLimit
  });
}
```

## 📊 Performance Monitoring

### Key Metrics
- **Connection Time**: Time to connect MetaMask
- **Balance Fetch**: Time to retrieve balances
- **Transaction Speed**: Sepolia confirmation time (~15 seconds)
- **Error Rate**: Failed transaction percentage

### Optimization Tips
- Cache balance queries for 30 seconds
- Batch multiple contract calls
- Use efficient RPC endpoints
- Implement retry logic for failed requests

## 🚀 Deployment Options

### 1. Figma Deployment
- Upload all files to Figma platform
- Configure environment variables in settings
- Test MetaMask connection in live environment

### 2. Vercel Deployment
```bash
git push origin main
# Configure environment variables in Vercel dashboard
# Automatic deployment on push
```

### 3. Netlify Deployment
```bash
npm run build
# Upload build folder to Netlify
# Configure environment variables
```

## 📈 Future Enhancements

### Planned Features
- **Multi-token support**: Support for additional ERC20 tokens
- **Transaction batching**: Multiple transfers in one transaction
- **Gas optimization**: Dynamic gas price adjustment
- **Mobile app**: React Native version
- **Advanced analytics**: Portfolio tracking and reporting

### Integration Possibilities
- **DEX Integration**: Swap tokens on decentralized exchanges
- **NFT Support**: Carbon credit NFTs
- **DAO Governance**: Token-based voting system
- **Staking Rewards**: Earn rewards for holding BCT tokens

---

## 📞 Support

For technical support, deployment issues, or feature requests:

1. **Check Deployment Guide**: Comprehensive troubleshooting section
2. **Browser Console**: Check for JavaScript errors
3. **MetaMask Logs**: Review MetaMask transaction history
4. **Sepolia Etherscan**: Verify contract and transaction status

---

**Happy Building! 🚀**

This Web3 integration brings BlueMercantile into the decentralized future, enabling true blockchain-based carbon credit management with transparent, immutable transactions on the Ethereum ecosystem.