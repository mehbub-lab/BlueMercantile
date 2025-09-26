import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarInitials } from './ui/avatar';
import { 
  User, 
  LogOut, 
  Bell, 
  Settings, 
  CreditCard, 
  FileText,
  Wallet,
  ArrowRightLeft,
  History,
  TrendingUp
} from 'lucide-react';
import { User as UserType } from '../utils/auth';
import { WalletConnect } from './WalletConnect';
import { TransferForm } from './TransferForm';
import { TransactionsTable } from './TransactionsTable';
import { Web3ConfigGuide } from './Web3ConfigGuide';
import { CONTRACT_ADDRESS, RPC_URL } from '../utils/web3';

interface UserDashboardProps {
  user: UserType;
  onLogout: () => void;
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const isPatron = user.userType === 'patron';
  const isCreditClient = user.userType === 'creditClient';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user.fullName || user.userId}
              </h1>
              <p className="text-gray-600">
                {isPatron ? 'Patron Dashboard' : 'Credit Client Dashboard'} - BlueMercantile Web3
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={isPatron ? 'default' : 'secondary'}>
                {user.userType}
              </Badge>
              <Button onClick={onLogout} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content Tabs */}
        <Tabs defaultValue="wallet" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="wallet" className="flex items-center space-x-2">
              <Wallet className="h-4 w-4" />
              <span>Wallet</span>
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center space-x-2">
              <ArrowRightLeft className="h-4 w-4" />
              <span>Transfer</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center space-x-2">
              <History className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            {/* Show configuration guide if Web3 is not properly configured */}
            {(!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x1234567890123456789012345678901234567890' || 
              !RPC_URL || RPC_URL.includes('YOUR_')) && (
              <Web3ConfigGuide />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <WalletConnect />
              </div>
              
              {/* Web3 Info Cards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>BlueCarbonToken (BCT)</span>
                  </CardTitle>
                  <CardDescription>
                    ERC20-compatible token for carbon credits on Sepolia testnet
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Token Symbol</p>
                      <p className="text-lg font-semibold">BCT</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Decimals</p>
                      <p className="text-lg font-semibold">18</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">About BlueCarbonToken</p>
                        <p>BCT represents carbon credits from blue carbon plantation projects. Each token is backed by verified carbon sequestration data stored on IPFS.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Network Information</CardTitle>
                  <CardDescription>
                    Sepolia testnet configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Network</p>
                      <p className="font-semibold">Sepolia Test Network</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chain ID</p>
                      <p className="font-mono">11155111</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Block Explorer</p>
                      <a 
                        href="https://sepolia.etherscan.io" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        sepolia.etherscan.io
                      </a>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Testnet Faucets</h4>
                    <div className="space-y-1">
                      <a 
                        href="https://sepoliafaucet.com/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        SepoliaFaucet.com
                      </a>
                      <a 
                        href="https://faucet.sepolia.dev/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-sm text-primary hover:underline"
                      >
                        Sepolia.dev Faucet
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transfer Tab */}
          <TabsContent value="transfer" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <TransferForm />
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Transfer Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm">Step 1</h4>
                      <p className="text-sm text-muted-foreground">Connect your MetaMask wallet and ensure you're on Sepolia testnet</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Step 2</h4>
                      <p className="text-sm text-muted-foreground">Enter recipient's Ethereum address (must start with 0x)</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Step 3</h4>
                      <p className="text-sm text-muted-foreground">Specify amount of BCT tokens to transfer</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">Step 4</h4>
                      <p className="text-sm text-muted-foreground">Confirm transaction in MetaMask and pay gas fees</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> Make sure you have enough ETH for gas fees before initiating transfers.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <TransactionsTable />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Your BlueMercantile account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User ID</label>
                      <p className="font-mono text-sm">{user.userId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-sm">{user.userData?.fullName || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm">{user.userData?.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                      <p className="text-sm">{user.userData?.mobile || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">User Type</label>
                      <Badge variant={isPatron ? 'default' : 'secondary'} className="w-fit">
                        {user.userType}
                      </Badge>
                    </div>
                    {isPatron && user.userData?.entityType && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Entity Type</label>
                        <p className="text-sm capitalize">{user.userData.entityType}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>
                    Location and wallet details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-sm">{user.userData?.address || 'Not provided'}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Pincode</label>
                        <p className="text-sm">{user.userData?.pincode || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">State</label>
                        <p className="text-sm">{user.userData?.state || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Registered Wallet</label>
                      <p className="text-xs font-mono break-all bg-muted p-2 rounded">
                        {user.userData?.walletAddress || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={`block text-sm font-medium text-gray-700 ${className}`}>{children}</label>;
}