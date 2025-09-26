import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Wallet, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  Copy,
  Power,
  RefreshCw
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { formatAddress } from '../utils/web3';
import { toast } from 'sonner';

export function WalletConnect() {
  const {
    address,
    isConnected,
    isCorrectNetwork,
    ethBalance,
    tokenBalance,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    refreshBalances,
  } = useWallet();

  const handleConnect = async () => {
    const success = await connectWallet();
    if (success) {
      toast.success('Wallet connected successfully!');
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast.info('Wallet disconnected');
  };

  const handleSwitchNetwork = async () => {
    const success = await switchNetwork();
    if (success) {
      toast.success('Switched to Sepolia network');
    } else {
      toast.error('Failed to switch network');
    }
  };

  const handleRefreshBalances = async () => {
    if (refreshBalances) {
      await refreshBalances();
      toast.success('Balances refreshed');
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard');
    }
  };

  const openEtherscan = () => {
    if (address) {
      window.open(`https://sepolia.etherscan.io/address/${address}`, '_blank');
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader className="text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-primary" />
          <CardTitle>Connect Your Wallet</CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to interact with BlueCarbonToken on Sepolia testnet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Connect MetaMask
              </>
            )}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Don't have MetaMask? 
              <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Install it here
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle>Wallet Connected</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshBalances}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDisconnect}
              className="text-destructive hover:text-destructive"
            >
              <Power className="h-4 w-4 mr-1" />
              Disconnect
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Network Status */}
        <div className="flex items-center justify-between p-3 rounded-lg border">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm font-medium">
              {isCorrectNetwork ? 'Sepolia Testnet' : 'Wrong Network'}
            </span>
          </div>
          {!isCorrectNetwork && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSwitchNetwork}
              disabled={isLoading}
            >
              Switch to Sepolia
            </Button>
          )}
        </div>

        {!isCorrectNetwork && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please switch to Sepolia testnet to interact with BlueCarbonToken
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Wallet Address */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
              {formatAddress(address || '')}
            </code>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openEtherscan}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Balances */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">ETH Balance</label>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
                ) : (
                  parseFloat(ethBalance).toFixed(4)
                )}
              </div>
              <div className="text-xs text-muted-foreground">ETH</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">BlueCarbonToken</label>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-300 h-8 w-20 rounded"></div>
                ) : (
                  parseFloat(tokenBalance).toFixed(2)
                )}
              </div>
              <div className="text-xs text-muted-foreground">BCT</div>
            </div>
          </div>
        </div>

        {/* Debug Information */}
        {process.env.NODE_ENV === 'development' && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="text-xs text-gray-600">
              <p className="font-medium mb-1">Debug Info</p>
              <p>ETH Balance: {ethBalance}</p>
              <p>Token Balance: {tokenBalance}</p>
              <p>Is Loading: {isLoading.toString()}</p>
              <p>Is Connected: {isConnected.toString()}</p>
              <p>Correct Network: {isCorrectNetwork.toString()}</p>
            </div>
          </div>
        )}

        {/* Testnet Notice */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Testnet Environment</p>
              <p>You're connected to Sepolia testnet. Get free test ETH from a faucet to interact with contracts.</p>
              <a 
                href="https://sepoliafaucet.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2"
              >
                Get Sepolia ETH <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}