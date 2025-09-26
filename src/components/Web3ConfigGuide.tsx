import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Copy,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

export function Web3ConfigGuide() {
  const [contractAddress, setContractAddress] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);

  const handleSaveConfig = () => {
    if (!contractAddress || !rpcUrl) {
      toast.error('Please fill in both fields');
      return;
    }

    if (!contractAddress.startsWith('0x') || contractAddress.length !== 42) {
      toast.error('Invalid contract address format');
      return;
    }

    if (!rpcUrl.startsWith('https://')) {
      toast.error('RPC URL must start with https://');
      return;
    }

    // Save to window.ENV
    if (typeof window !== 'undefined') {
      (window as any).ENV = {
        ...(window as any).ENV,
        NEXT_PUBLIC_CONTRACT_ADDRESS: contractAddress,
        NEXT_PUBLIC_RPC_URL: rpcUrl
      };
    }

    // Save to localStorage for persistence
    localStorage.setItem('bluemercantile_web3_config', JSON.stringify({
      contractAddress,
      rpcUrl,
      configuredAt: new Date().toISOString()
    }));

    setIsConfigured(true);
    toast.success('Web3 configuration saved successfully!');
  };

  const loadSavedConfig = () => {
    const saved = localStorage.getItem('bluemercantile_web3_config');
    if (saved) {
      try {
        const config = JSON.parse(saved);
        setContractAddress(config.contractAddress || '');
        setRpcUrl(config.rpcUrl || '');
        if (config.contractAddress && config.rpcUrl) {
          setIsConfigured(true);
        }
      } catch (error) {
        console.error('Failed to load saved config:', error);
      }
    }
  };

  React.useEffect(() => {
    loadSavedConfig();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isConfigured) {
    return (
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Web3 configuration is set up and ready!</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsConfigured(false)}
          >
            <Settings className="h-3 w-3 mr-1" />
            Reconfigure
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="h-5 w-5 text-blue-600" />
          <span>Web3 Configuration Required</span>
        </CardTitle>
        <CardDescription>
          Configure your smart contract and RPC settings to enable Web3 functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Web3 features require configuration. Please set up your contract address and RPC URL below.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contractAddress">BlueCarbonToken Contract Address</Label>
            <div className="flex space-x-2">
              <Input
                id="contractAddress"
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x1234567890123456789012345678901234567890"
                className="font-mono text-sm"
              />
              {contractAddress && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(contractAddress, 'Contract address')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the deployed BlueCarbonToken contract address on Sepolia testnet
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rpcUrl">Sepolia RPC URL</Label>
            <div className="flex space-x-2">
              <Input
                id="rpcUrl"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                placeholder="https://eth-sepolia.g.alchemy.com/v2/your-api-key"
                className="font-mono text-sm"
              />
              {rpcUrl && (
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(rpcUrl, 'RPC URL')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Enter your Alchemy or Infura Sepolia RPC endpoint
            </p>
          </div>

          <Button onClick={handleSaveConfig} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>

        <div className="pt-4 border-t space-y-4">
          <h4 className="font-medium">Setup Instructions:</h4>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-2">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">1</span>
              <div>
                <p className="font-medium">Deploy BlueCarbonToken Contract</p>
                <p className="text-muted-foreground">Use Remix IDE to deploy the contract on Sepolia testnet</p>
                <a 
                  href="https://remix.ethereum.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Open Remix IDE <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">2</span>
              <div>
                <p className="font-medium">Get RPC URL</p>
                <p className="text-muted-foreground">Create a free account and get Sepolia RPC endpoint</p>
                <div className="flex space-x-4 mt-1">
                  <a 
                    href="https://www.alchemy.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    Alchemy <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                  <a 
                    href="https://infura.io/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    Infura <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">3</span>
              <div>
                <p className="font-medium">Get Sepolia ETH</p>
                <p className="text-muted-foreground">Get free testnet ETH for gas fees</p>
                <a 
                  href="https://sepoliafaucet.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:underline"
                >
                  Sepolia Faucet <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}