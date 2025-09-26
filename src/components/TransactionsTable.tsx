import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from './ui/table';
import { 
  History, 
  ExternalLink, 
  ArrowUpRight, 
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useWallet } from '../hooks/useWallet';
import { formatAddress } from '../utils/web3';

export function TransactionsTable() {
  const { transactions, address } = useWallet();

  const openTransaction = (hash: string) => {
    window.open(`https://sepolia.etherscan.io/tx/${hash}`, '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTransactionIcon = (tx: any) => {
    if (tx.type === 'mint') {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    }
    
    // For transfers, check if it's incoming or outgoing
    if (tx.from?.toLowerCase() === address?.toLowerCase()) {
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    } else {
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    }
  };

  const getTransactionType = (tx: any) => {
    if (tx.type === 'mint') return 'Mint';
    
    if (tx.from?.toLowerCase() === address?.toLowerCase()) {
      return 'Sent';
    } else {
      return 'Received';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <History className="h-5 w-5" />
          <span>Recent Transactions</span>
        </CardTitle>
        <CardDescription>
          Your BlueCarbonToken transaction history on Sepolia testnet
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your token transfers will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getTransactionIcon(tx)}
                        <span className="font-medium">
                          {getTransactionType(tx)}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {tx.amount ? (
                        <span className="font-mono">
                          {parseFloat(tx.amount).toFixed(2)} BCT
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {tx.type === 'transfer' && tx.from?.toLowerCase() === address?.toLowerCase()
                          ? formatAddress(tx.to || '')
                          : formatAddress(tx.from || '')
                        }
                      </code>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(tx.status)}
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(tx.status)}
                        >
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </Badge>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(tx.timestamp)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openTransaction(tx.hash)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {transactions.length > 10 && (
              <div className="text-center pt-4">
                <Button variant="outline" size="sm">
                  View All Transactions
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}