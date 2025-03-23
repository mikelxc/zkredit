'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { usePrivy } from '@privy-io/react-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wallet, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  PlusCircle,
  ArrowRight,
  Link as LinkIcon,
  Shield
} from 'lucide-react';
import Image from 'next/image';
import { Asset } from '@/lib/types';

// Mock exchange logos
const EXCHANGES = [
  { id: 'coinbase', name: 'Coinbase', logo: '/images/exchanges/coinbase.svg' },
  { id: 'binance', name: 'Binance', logo: '/images/exchanges/binance.svg' },
  { id: 'kraken', name: 'Kraken', logo: '/images/exchanges/kraken.svg' },
  { id: 'ftx', name: 'FTX', logo: '/images/exchanges/ftx.svg' },
];

export default function ConnectPage() {
  const { user, assets, refreshUserData, isLoading } = useUser();
  const { connectWallet, disconnectWallet, wallets, ready, authenticated } = usePrivy();
  const [connectingExchange, setConnectingExchange] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock function to simulate connecting to an exchange
  const connectExchange = async (exchangeId: string) => {
    setConnectingExchange(exchangeId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would redirect to the exchange OAuth flow
    // and then handle the callback to store the connection
    
    // Refresh user data after connecting
    await refreshUserData();
    
    setConnectingExchange(null);
  };

  // Mock function to refresh asset data
  const handleRefreshAssets = async () => {
    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Refresh user data
    await refreshUserData();
    
    setIsRefreshing(false);
  };

  // Group assets by source (wallet or exchange)
  const walletAssets = assets.filter(asset => asset.source === 'wallet');
  const exchangeAssets = assets.filter(asset => asset.source === 'exchange');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Connect Assets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Connect wallets and exchanges to verify your assets
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={handleRefreshAssets}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Assets
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="wallets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="exchanges">Exchanges</TabsTrigger>
        </TabsList>
        
        <TabsContent value="wallets" className="mt-6 space-y-6">
          {/* Connected Wallets */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
              <CardDescription>
                Manage your connected blockchain wallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {wallets && wallets.length > 0 ? (
                <div className="space-y-4">
                  {wallets.map((wallet) => (
                    <div 
                      key={wallet.address} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <Wallet className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">
                            {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {wallet.walletClientType === 'privy' ? 'Embedded Wallet' : wallet.walletClientType}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => disconnectWallet(wallet.address)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Wallet className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No wallets connected</h3>
                  <p className="mt-1 text-sm text-gray-500">Connect a wallet to get started</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => connectWallet()}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Connect New Wallet
              </Button>
            </CardFooter>
          </Card>

          {/* Wallet Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Wallet Assets</CardTitle>
              <CardDescription>
                Assets detected in your connected wallets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {walletAssets.length > 0 ? (
                <div className="space-y-4">
                  {walletAssets.map((asset) => (
                    <div 
                      key={`${asset.ticker}-${asset.sourceAddress}`} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <span className="font-bold text-blue-600">{asset.ticker.substring(0, 3)}</span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{asset.ticker}</p>
                          <p className="text-sm text-gray-500">
                            {asset.balance.toFixed(4)} (${(asset.balance * asset.usdPrice).toFixed(2)})
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Navigate to proofs page in a real app
                          window.location.href = '/dashboard/proofs';
                        }}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Generate Proof
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Database className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No assets detected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Connect a wallet with assets or deposit funds to get started
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exchanges" className="mt-6 space-y-6">
          {/* Connect Exchanges */}
          <Card>
            <CardHeader>
              <CardTitle>Connect Exchanges</CardTitle>
              <CardDescription>
                Connect your exchange accounts to include those assets in your proofs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {EXCHANGES.map((exchange) => (
                  <div 
                    key={exchange.id} 
                    className="flex flex-col items-center p-6 border rounded-lg hover:border-blue-500 transition-colors"
                  >
                    <div className="h-16 w-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      {/* In a real app, you would use actual exchange logos */}
                      <span className="text-xl font-bold text-gray-700">{exchange.name.charAt(0)}</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{exchange.name}</h3>
                    <p className="mt-1 text-sm text-gray-500 text-center">
                      Connect your {exchange.name} account to verify assets
                    </p>
                    <Button 
                      className="mt-4 w-full"
                      onClick={() => connectExchange(exchange.id)}
                      disabled={connectingExchange === exchange.id}
                    >
                      {connectingExchange === exchange.id ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <LinkIcon className="mr-2 h-4 w-4" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Exchange Assets */}
          <Card>
            <CardHeader>
              <CardTitle>Exchange Assets</CardTitle>
              <CardDescription>
                Assets detected in your connected exchanges
              </CardDescription>
            </CardHeader>
            <CardContent>
              {exchangeAssets.length > 0 ? (
                <div className="space-y-4">
                  {exchangeAssets.map((asset) => (
                    <div 
                      key={`${asset.ticker}-${asset.sourceAddress}`} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <span className="font-bold text-blue-600">{asset.ticker.substring(0, 3)}</span>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{asset.ticker}</p>
                          <p className="text-sm text-gray-500">
                            {asset.balance.toFixed(4)} (${(asset.balance * asset.usdPrice).toFixed(2)})
                          </p>
                          <p className="text-xs text-gray-400">
                            Source: {asset.sourceName || 'Exchange'}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Navigate to proofs page in a real app
                          window.location.href = '/dashboard/proofs';
                        }}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Generate Proof
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Database className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No exchange assets detected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Connect an exchange account to include those assets in your proofs
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
