import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Send, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { ethers } from 'ethers';
import { toast } from 'sonner';

export function TransferForm() {
  const {
    isConnected,
    isCorrectNetwork,
    tokenBalance,
    transferTokens,
  } = useWallet();

  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ hash: string } | null>(null);

  const validateForm = () => {
    if (!recipient) {
      setError('Recipient address is required');
      return false;
    }

    if (!ethers.isAddress(recipient)) {
      setError('Invalid recipient address');
      return false;
    }

    if (!amount) {
      setError('Amount is required');
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Amount must be a positive number');
      return false;
    }

    const tokenBalanceNum = parseFloat(tokenBalance);
    if (amountNum > tokenBalanceNum) {
      setError('Insufficient token balance');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await transferTokens(recipient, amount);
      
      if (result.success) {
        setSuccess({ hash: result.hash });
        setRecipient('');
        setAmount('');
        toast.success('Transfer initiated successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'Transfer failed');
      toast.error('Transfer failed');
    } finally {
      setIsLoading(false);
    }
  };

  const openTransaction = (hash: string) => {
    window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
  };

  if (!isConnected) {
    return (
      <Card className="opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Transfer BlueCarbonTokens</span>
          </CardTitle>
          <CardDescription>
            Connect your wallet to transfer tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Please connect your wallet first</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="h-5 w-5" />
            <span>Transfer BlueCarbonTokens</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please switch to Sepolia testnet to transfer tokens
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>Transfer BlueCarbonTokens</span>
        </CardTitle>
        <CardDescription>
          Send BCT tokens to another address on Sepolia testnet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Transfer submitted successfully!</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openTransaction(success.hash)}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View Transaction
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Address</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              disabled={isLoading}
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Enter the Ethereum address of the recipient
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (BCT)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isLoading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                BCT
              </div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Available: {parseFloat(tokenBalance).toFixed(2)} BCT</span>
              <button
                type="button"
                onClick={() => setAmount(tokenBalance)}
                className="text-primary hover:underline"
                disabled={isLoading}
              >
                Use Max
              </button>
            </div>
          </div>

          {/* Transaction Cost Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Transaction Fee Required</p>
                <p>You'll need some ETH in your wallet to pay for gas fees. Make sure you have enough ETH for the transaction.</p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !recipient || !amount}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending Transaction...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Transfer Tokens
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Transactions are irreversible. Please double-check the recipient address.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}