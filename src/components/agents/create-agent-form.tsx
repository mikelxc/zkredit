'use client';

import { useState } from 'react';
import { ZkProof } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface CreateAgentFormProps {
  proofs: ZkProof[];
  onCreateAgent: (agentData: {
    name: string;
    type: string;
    proofId: string;
    permissions: string[];
    config: Record<string, unknown>;
  }) => Promise<void>;
  isLoading?: boolean;
}

export function CreateAgentForm({ proofs, onCreateAgent, isLoading = false }: CreateAgentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [proofId, setProofId] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['read']);
  const [maxGasPrice, setMaxGasPrice] = useState('100');
  const [slippageTolerance, setSlippageTolerance] = useState('1.0');

  // Available agent types
  const agentTypes = [
    { id: 'defi-trader', name: 'DeFi Trader' },
    { id: 'yield-optimizer', name: 'Yield Optimizer' },
    { id: 'nft-trader', name: 'NFT Trader' },
    { id: 'payment-processor', name: 'Payment Processor' },
  ];

  // Handle permission toggle
  const togglePermission = (permission: string) => {
    if (permissions.includes(permission)) {
      setPermissions(permissions.filter(p => p !== permission));
    } else {
      setPermissions([...permissions, permission]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !type || !proofId) return;
    
    const agentData = {
      name,
      type,
      proofId,
      permissions,
      config: {
        maxGasPrice: parseInt(maxGasPrice),
        slippageTolerance: parseFloat(slippageTolerance),
      },
    };
    
    await onCreateAgent(agentData);
    
    // Reset form
    setName('');
    setType('');
    setProofId('');
    setPermissions(['read']);
    setMaxGasPrice('100');
    setSlippageTolerance('1.0');
    setIsOpen(false);
  };

  // Filter only valid proofs
  const validProofs = proofs.filter(proof => proof.status === 'valid');

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Agent</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create AI Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              placeholder="My Trading Agent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Agent Type</Label>
            <Select
              value={type}
              onValueChange={setType}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select agent type" />
              </SelectTrigger>
              <SelectContent>
                {agentTypes.map((agentType) => (
                  <SelectItem key={agentType.id} value={agentType.id}>
                    {agentType.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="proof">Zero-Knowledge Proof</Label>
            <Select
              value={proofId}
              onValueChange={setProofId}
            >
              <SelectTrigger id="proof">
                <SelectValue placeholder="Select a proof" />
              </SelectTrigger>
              <SelectContent>
                {validProofs.length > 0 ? (
                  validProofs.map((proof) => (
                    <SelectItem key={proof.id} value={proof.id}>
                      {proof.publicInputs.assetType} {proof.type} Proof
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No valid proofs available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {validProofs.length === 0 && (
              <p className="text-xs text-yellow-600">
                You need to create a valid proof before creating an agent.
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Permissions</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="permission-read" className="cursor-pointer">Read Data</Label>
                <Switch 
                  id="permission-read" 
                  checked={permissions.includes('read')} 
                  onCheckedChange={() => togglePermission('read')}
                  disabled
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="permission-execute" className="cursor-pointer">Execute Transactions</Label>
                <Switch 
                  id="permission-execute" 
                  checked={permissions.includes('execute')} 
                  onCheckedChange={() => togglePermission('execute')}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="permission-write" className="cursor-pointer">Write Data</Label>
                <Switch 
                  id="permission-write" 
                  checked={permissions.includes('write')} 
                  onCheckedChange={() => togglePermission('write')}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4 border-t pt-4 mt-4">
            <h4 className="text-sm font-medium">Agent Configuration</h4>
            
            <div className="space-y-2">
              <Label htmlFor="maxGasPrice">Max Gas Price (Gwei)</Label>
              <Input
                id="maxGasPrice"
                type="number"
                min="1"
                max="500"
                value={maxGasPrice}
                onChange={(e) => setMaxGasPrice(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slippageTolerance">Slippage Tolerance (%)</Label>
              <Input
                id="slippageTolerance"
                type="number"
                min="0.1"
                max="10"
                step="0.1"
                value={slippageTolerance}
                onChange={(e) => setSlippageTolerance(e.target.value)}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading || !name || !type || !proofId}>
            {isLoading ? 'Creating...' : 'Create Agent'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
