'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ConnectAssetFormProps {
  onConnectWallet?: (address: string) => Promise<void>;
  onConnectExchange?: (exchange: string, apiKey: string, apiSecret: string) => Promise<void>;
  isLoading?: boolean;
}

export function ConnectAssetForm({ 
  onConnectWallet, 
  onConnectExchange, 
  isLoading = false 
}: ConnectAssetFormProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [exchange, setExchange] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Handle wallet connection
  const handleConnectWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onConnectWallet && walletAddress) {
      await onConnectWallet(walletAddress);
      setWalletAddress('');
      setIsOpen(false);
    }
  };

  // Handle exchange connection
  const handleConnectExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onConnectExchange && exchange && apiKey && apiSecret) {
      await onConnectExchange(exchange, apiKey, apiSecret);
      setExchange('');
      setApiKey('');
      setApiSecret('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Connect New Asset</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connect Asset</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="exchange">Exchange</TabsTrigger>
          </TabsList>
          <TabsContent value="wallet">
            <form onSubmit={handleConnectWallet} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address</Label>
                <Input
                  id="walletAddress"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !walletAddress}>
                {isLoading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="exchange">
            <form onSubmit={handleConnectExchange} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="exchange">Exchange</Label>
                <Select
                  value={exchange}
                  onValueChange={setExchange}
                >
                  <SelectTrigger id="exchange">
                    <SelectValue placeholder="Select an exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coinbase">Coinbase</SelectItem>
                    <SelectItem value="binance">Binance</SelectItem>
                    <SelectItem value="kraken">Kraken</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  placeholder="API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apiSecret">API Secret</Label>
                <Input
                  id="apiSecret"
                  type="password"
                  placeholder="API Secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !exchange || !apiKey || !apiSecret}>
                {isLoading ? 'Connecting...' : 'Connect Exchange'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
