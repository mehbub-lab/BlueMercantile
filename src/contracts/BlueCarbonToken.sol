// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BlueCarbonToken
 * @dev A simple ERC20-like token for carbon credits on BlueMercantile platform
 * 
 * Features:
 * - Standard ERC20 functionality (transfer, balanceOf)
 * - Minting capability for the contract owner
 * - Initial supply minted to deployer
 * - 18 decimal places (like ETH)
 * 
 * This contract is designed for educational/testing purposes on Sepolia testnet
 */
contract BlueCarbonToken {
    // Token metadata
    string public constant name = "BlueCarbonToken";
    string public constant symbol = "BCT";
    uint8 public constant decimals = 18;
    
    // Total supply tracking
    uint256 public totalSupply;
    
    // Owner of the contract (can mint new tokens)
    address public owner;
    
    // Balances mapping
    mapping(address => uint256) public balanceOf;
    
    // Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Mint(address indexed to, uint256 value);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "BCT: caller is not the owner");
        _;
    }
    
    /**
     * @dev Constructor that mints initial supply to the deployer
     * @param _initialSupply Initial supply of tokens (in wei, 18 decimals)
     */
    constructor(uint256 _initialSupply) {
        owner = msg.sender;
        totalSupply = _initialSupply;
        balanceOf[msg.sender] = _initialSupply;
        
        emit Transfer(address(0), msg.sender, _initialSupply);
        emit Mint(msg.sender, _initialSupply);
    }
    
    /**
     * @dev Transfer tokens from caller to another address
     * @param to Recipient address
     * @param amount Amount to transfer (in wei)
     * @return success True if transfer succeeded
     */
    function transfer(address to, uint256 amount) public returns (bool) {
        require(to != address(0), "BCT: transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "BCT: insufficient balance");
        
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        
        emit Transfer(msg.sender, to, amount);
        return true;
    }
    
    /**
     * @dev Mint new tokens to a specific address (only owner)
     * @param to Address to mint tokens to
     * @param amount Amount to mint (in wei)
     * @return success True if minting succeeded
     */
    function mint(address to, uint256 amount) public onlyOwner returns (bool) {
        require(to != address(0), "BCT: mint to zero address");
        
        totalSupply += amount;
        balanceOf[to] += amount;
        
        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
        return true;
    }
    
    /**
     * @dev Transfer ownership of the contract
     * @param newOwner Address of the new owner
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "BCT: new owner is zero address");
        
        address previousOwner = owner;
        owner = newOwner;
        
        emit OwnershipTransferred(previousOwner, newOwner);
    }
    
    /**
     * @dev Batch transfer to multiple addresses (gas efficient)
     * @param recipients Array of recipient addresses
     * @param amounts Array of amounts (must match recipients length)
     */
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "BCT: arrays length mismatch");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(balanceOf[msg.sender] >= totalAmount, "BCT: insufficient balance for batch");
        
        balanceOf[msg.sender] -= totalAmount;
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "BCT: transfer to zero address");
            balanceOf[recipients[i]] += amounts[i];
            emit Transfer(msg.sender, recipients[i], amounts[i]);
        }
    }
    
    /**
     * @dev Emergency function to recover accidentally sent tokens (only owner)
     * This function is for other ERC20 tokens, not for BCT itself
     */
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        require(token != address(this), "BCT: cannot withdraw BCT tokens");
        
        // This would require importing IERC20 interface for production
        // For simplicity, we'll just include the interface here
        (bool success, ) = token.call(
            abi.encodeWithSignature("transfer(address,uint256)", to, amount)
        );
        require(success, "BCT: emergency withdraw failed");
    }
    
    /**
     * @dev Get contract version for upgrades tracking
     */
    function version() external pure returns (string memory) {
        return "1.0.0";
    }
}

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Go to https://remix.ethereum.org/
 * 2. Create a new file named "BlueCarbonToken.sol"
 * 3. Copy and paste this contract code
 * 4. Go to the "Solidity Compiler" tab
 * 5. Select compiler version 0.8.19 or higher
 * 6. Click "Compile BlueCarbonToken.sol"
 * 7. Go to "Deploy & Run Transactions" tab
 * 8. Select "Injected Provider - MetaMask" as environment
 * 9. Make sure MetaMask is connected to Sepolia testnet
 * 10. In the constructor parameters, enter: 1000000000000000000000 (1000 tokens with 18 decimals)
 * 11. Click "Deploy"
 * 12. Confirm the transaction in MetaMask
 * 13. Copy the deployed contract address
 * 14. Update your .env file with the contract address
 * 
 * TESTING FUNCTIONS:
 * - balanceOf(address): Check token balance of any address
 * - transfer(address,uint256): Transfer tokens to another address
 * - mint(address,uint256): Mint new tokens (only owner)
 * - totalSupply(): Check total token supply
 * 
 * SEPOLIA FAUCETS (for test ETH):
 * - https://sepoliafaucet.net/
 * - https://faucet.sepolia.dev/
 * - https://sepolia-faucet.pk910.de/
 * 
 * Make sure you have some Sepolia ETH before deploying!
 */