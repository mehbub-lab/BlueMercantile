#!/usr/bin/env node

/**
 * BlueMercantile Web3 Environment Setup Script
 * 
 * This script helps configure environment variables for Web3 integration.
 * Run with: node setup-env.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🌊 BlueMercantile Web3 Environment Setup\n');
console.log('This script will help you configure environment variables for Web3 integration.\n');

const questions = [
  {
    key: 'NEXT_PUBLIC_CONTRACT_ADDRESS',
    question: 'Enter your deployed BlueCarbonToken contract address (0x...): ',
    validation: (value) => {
      if (!value.startsWith('0x') || value.length !== 42) {
        return 'Contract address must start with 0x and be 42 characters long';
      }
      return null;
    }
  },
  {
    key: 'NEXT_PUBLIC_RPC_URL',
    question: 'Enter your Sepolia RPC URL (Alchemy/Infura): ',
    validation: (value) => {
      if (!value.startsWith('https://')) {
        return 'RPC URL must start with https://';
      }
      if (!value.includes('sepolia')) {
        return 'RPC URL should be for Sepolia testnet';
      }
      return null;
    }
  }
];

const envVars = {};

async function askQuestion(questionObj) {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(questionObj.question, (answer) => {
        const error = questionObj.validation ? questionObj.validation(answer) : null;
        if (error) {
          console.log(`❌ Error: ${error}\n`);
          ask();
        } else {
          resolve(answer);
        }
      });
    };
    ask();
  });
}

async function main() {
  try {
    // Ask questions
    for (const question of questions) {
      const answer = await askQuestion(question);
      envVars[question.key] = answer;
    }

    // Create .env file content
    const envContent = Object.entries(envVars)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const fullEnvContent = `# BlueMercantile Web3 Configuration
# Generated on ${new Date().toISOString()}

${envContent}

# Optional: Custom chain configuration
# NEXT_PUBLIC_CHAIN_ID=11155111
# NEXT_PUBLIC_CHAIN_NAME=Sepolia Test Network
`;

    // Write .env file
    fs.writeFileSync('.env', fullEnvContent);

    console.log('\n✅ Environment configuration completed!');
    console.log('📁 .env file created with your settings');
    
    console.log('\n📋 Configuration Summary:');
    Object.entries(envVars).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    console.log('\n🚀 Next Steps:');
    console.log('1. Verify your contract is deployed on Sepolia testnet');
    console.log('2. Test the configuration by connecting MetaMask');
    console.log('3. Get Sepolia ETH from faucets for testing');
    console.log('4. Start your application and test Web3 functionality');

    console.log('\n📚 Useful Links:');
    console.log('   • Sepolia Etherscan: https://sepolia.etherscan.io/');
    console.log('   • Sepolia Faucet: https://sepoliafaucet.com/');
    console.log('   • MetaMask: https://metamask.io/');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
main().catch(console.error);

module.exports = { main };