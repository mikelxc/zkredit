'use client';

import { useState } from 'react';
import { Asset, ProofInput } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface GenerateProofFormProps {
  assets: Asset[];
  onSubmit: (proofInput: ProofInput) => void;
  isLoading?: boolean;
}

export function GenerateProofForm({ assets, onSubmit, isLoading = false }: GenerateProofFormProps) {
  const [selectedAssetTicker, setSelectedAssetTicker] = useState<string>('');
  const [proofType, setProofType] = useState<'balance' | 'ownership'>('balance');
  const [threshold, setThreshold] = useState<string>('');
  const [userAddress, setUserAddress] = useState<string>('');

  // Find the selected asset from the assets array
  const selectedAsset = assets.find(asset => asset.ticker === selectedAssetTicker);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset || !userAddress) return;
    
    const proofInput: ProofInput = {
      asset: selectedAsset,
      threshold: proofType === 'balance' && threshold ? parseFloat(threshold) : undefined,
      timestamp: Date.now(),
      userAddress,
    };
    
    onSubmit(proofInput);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="asset">Select Asset</Label>
        <Select
          value={selectedAssetTicker}
          onValueChange={setSelectedAssetTicker}
        >
          <SelectTrigger id="asset">
            <SelectValue placeholder="Select an asset" />
          </SelectTrigger>
          <SelectContent>
            {assets.map((asset) => (
              <SelectItem key={asset.ticker} value={asset.ticker}>
                {asset.name || asset.ticker} ({asset.ticker})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="proofType">Proof Type</Label>
        <Select
          value={proofType}
          onValueChange={(value) => setProofType(value as 'balance' | 'ownership')}
        >
          <SelectTrigger id="proofType">
            <SelectValue placeholder="Select proof type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="balance">Balance Proof</SelectItem>
            <SelectItem value="ownership">Ownership Proof</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {proofType === 'balance' && (
        <div className="space-y-2">
          <Label htmlFor="threshold">Balance Threshold (optional)</Label>
          <Input
            id="threshold"
            type="number"
            placeholder="Minimum balance to verify"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
          {selectedAsset && (
            <p className="text-xs text-gray-500">
              Your current balance: {selectedAsset.balance} {selectedAsset.ticker}
            </p>
          )}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="userAddress">Your Wallet Address</Label>
        <Input
          id="userAddress"
          placeholder="0x..."
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading || !selectedAssetTicker || !userAddress}>
        {isLoading ? 'Generating...' : 'Generate Proof'}
      </Button>
    </form>
  );
}
