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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle2, 
  Clock, 
  Copy, 
  RefreshCw, 
  AlertCircle,
  Wallet,
  BarChart4,
  Lock
} from 'lucide-react';
import { generateBalanceProof, generateOwnershipProof, ProofOutput } from '@/lib/utils/zk-proof';
import { CRYPTOCURRENCIES } from '@/lib/utils/mock-data';

export default function ProofsPage() {
  const { assets, isLoading } = useUser();
  const { user: privyUser } = usePrivy();
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [proofType, setProofType] = useState<'balance' | 'ownership'>('balance');
  const [threshold, setThreshold] = useState<number>(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [proofs, setProofs] = useState<ProofOutput[]>([]);
  const [activeTab, setActiveTab] = useState('generate');

  // Find the selected asset object
  const selectedAssetObj = assets.find(a => a.ticker === selectedAsset);
  
  // Get the price of the selected asset
  const assetPrice = selectedAssetObj 
    ? CRYPTOCURRENCIES.find(c => c.ticker === selectedAssetObj.ticker)?.price || 0 
    : 0;
  
  // Calculate the USD value of the threshold
  const thresholdUsdValue = threshold * assetPrice;

  const handleGenerateProof = async () => {
    if (!selectedAssetObj || !privyUser?.wallet?.address) return;
    
    setIsGenerating(true);
    
    try {
      let newProof: ProofOutput;
      
      if (proofType === 'balance') {
        newProof = await generateBalanceProof({
          asset: selectedAssetObj,
          threshold,
          timestamp: Date.now(),
          userAddress: privyUser.wallet.address
        });
      } else {
        newProof = await generateOwnershipProof(
          selectedAssetObj, 
          privyUser.wallet.address
        );
      }
      
      setProofs(prev => [newProof, ...prev]);
      setActiveTab('manage');
    } catch (error) {
      console.error('Error generating proof:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, you would show a toast notification here
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Zero-Knowledge Proofs</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate and manage privacy-preserving proofs of your assets
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate New Proof</TabsTrigger>
          <TabsTrigger value="manage">Manage Proofs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create a New Zero-Knowledge Proof</CardTitle>
              <CardDescription>
                Generate cryptographic proofs that verify asset ownership or balances without revealing the actual assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Proof Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={proofType === 'balance' ? 'default' : 'outline'}
                    onClick={() => setProofType('balance')}
                    className="flex items-center justify-center"
                  >
                    <BarChart4 className="mr-2 h-4 w-4" />
                    Balance Threshold
                  </Button>
                  <Button
                    variant={proofType === 'ownership' ? 'default' : 'outline'}
                    onClick={() => setProofType('ownership')}
                    className="flex items-center justify-center"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Asset Ownership
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Asset</label>
                <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.ticker} value={asset.ticker}>
                        {asset.ticker} - {asset.balance.toFixed(4)} (${(asset.balance * (CRYPTOCURRENCIES.find(c => c.ticker === asset.ticker)?.price || 0)).toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {proofType === 'balance' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-sm font-medium text-gray-700">Balance Threshold</label>
                      <span className="text-sm text-gray-500">
                        {threshold.toFixed(2)} {selectedAsset} (${thresholdUsdValue.toFixed(2)})
                      </span>
                    </div>
                    <Slider
                      value={[threshold]}
                      min={0}
                      max={selectedAssetObj ? selectedAssetObj.balance * 1.5 : 100}
                      step={0.01}
                      onValueChange={(value) => setThreshold(value[0])}
                      disabled={!selectedAssetObj}
                    />
                  </div>
                  
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Proof Details</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            This proof will cryptographically verify that you own {'>'}= {threshold.toFixed(2)} {selectedAsset} 
                            without revealing your exact balance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {proofType === 'ownership' && (
                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Proof Details</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          This proof will cryptographically verify that you own {selectedAsset} 
                          without revealing your wallet address or balance.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={handleGenerateProof}
                disabled={!selectedAssetObj || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Proof...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Generate Zero-Knowledge Proof
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="manage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Zero-Knowledge Proofs</CardTitle>
              <CardDescription>
                View and manage your generated proofs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {proofs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Shield className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No proofs generated yet</h3>
                  <p className="mt-2 text-sm text-gray-500 max-w-md">
                    Generate your first zero-knowledge proof to privately verify your assets without revealing sensitive information.
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => setActiveTab('generate')}
                  >
                    Generate Your First Proof
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableCaption>List of your generated zero-knowledge proofs</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {proofs.map((proof) => (
                      <TableRow key={proof.id}>
                        <TableCell>{proof.publicInputs.assetType}</TableCell>
                        <TableCell>
                          {proof.publicInputs.thresholdMet !== undefined 
                            ? 'Balance Threshold' 
                            : 'Ownership'}
                        </TableCell>
                        <TableCell>
                          {proof.status === 'valid' ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="mr-1 h-3 w-3" /> Valid
                            </Badge>
                          ) : proof.status === 'pending' ? (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              <Clock className="mr-1 h-3 w-3" /> Pending
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              <AlertCircle className="mr-1 h-3 w-3" /> Invalid
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(proof.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(proof.expiresAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => copyToClipboard(proof.id)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                // In a real app, you would implement verification logic here
                                alert(`Proof ${proof.id} is valid`);
                              }}
                            >
                              Verify
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
