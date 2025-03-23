'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { SUPPORTED_CHAINS } from '@/lib/types/index';
import { v4 as uuidv4 } from 'uuid';

interface ProofGenerationFormProps {
  onProofGenerated: (proofId: string) => void;
  onCancel: () => void;
}

export default function ProofGenerationForm({ onProofGenerated, onCancel }: ProofGenerationFormProps) {
  const { assets, lockedBalances } = useUser();
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [proofType, setProofType] = useState<'ownership' | 'balance' | 'credit'>('ownership');
  const [targetChain, setTargetChain] = useState<string>(SUPPORTED_CHAINS[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [minBalance, setMinBalance] = useState<string>('');

  // Get asset details
  const selectedAssetDetails = assets.find(asset => asset.id === selectedAsset);
  
  // Get locked balances for the selected asset
  const assetLockedBalances = selectedAsset 
    ? lockedBalances.filter(lock => lock.assetId === selectedAsset)
    : [];

  // Handle proof generation
  const handleGenerateProof = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAsset) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would call the SP1 ZK proof generation API
      // For this mock, we'll simulate a delay and then create a mock proof
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a new proof ID
      const proofId = uuidv4();
      
      // In a real app, we would store the proof in the database
      console.log('Generated proof:', {
        id: proofId,
        userId: selectedAssetDetails?.userId,
        assetId: selectedAsset,
        proofType,
        targetChain,
        minBalance: minBalance ? parseFloat(minBalance) : undefined,
        createdAt: new Date().toISOString(),
      });
      
      // Call the callback with the new proof ID
      onProofGenerated(proofId);
    } catch (error) {
      console.error('Error generating proof:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleGenerateProof} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="asset" className="block text-sm font-medium leading-6 text-gray-900">
            Asset
          </label>
          <select
            id="asset"
            name="asset"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            required
          >
            <option value="">Select an asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.ticker} ({asset.balance.toLocaleString('en-US', { maximumFractionDigits: 8 })})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="proofType" className="block text-sm font-medium leading-6 text-gray-900">
            Proof Type
          </label>
          <select
            id="proofType"
            name="proofType"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
            value={proofType}
            onChange={(e) => setProofType(e.target.value as 'ownership' | 'balance' | 'credit')}
            required
          >
            <option value="ownership">Asset Ownership</option>
            <option value="balance">Balance Threshold</option>
            <option value="credit">Credit Worthiness</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            {proofType === 'ownership' && 'Prove that you own this asset without revealing your identity.'}
            {proofType === 'balance' && 'Prove that you have at least a certain balance without revealing the exact amount.'}
            {proofType === 'credit' && 'Prove that you have sufficient credit worthiness based on your assets and history.'}
          </p>
        </div>

        {proofType === 'balance' && (
          <div>
            <label htmlFor="minBalance" className="block text-sm font-medium leading-6 text-gray-900">
              Minimum Balance Threshold
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="minBalance"
                id="minBalance"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                placeholder="0.00"
                value={minBalance}
                onChange={(e) => setMinBalance(e.target.value)}
                min="0"
                step="any"
                required={proofType === 'balance'}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              The proof will verify that you have at least this much of the asset without revealing your exact balance.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="targetChain" className="block text-sm font-medium leading-6 text-gray-900">
            Target Chain
          </label>
          <select
            id="targetChain"
            name="targetChain"
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
            value={targetChain}
            onChange={(e) => setTargetChain(e.target.value)}
            required
          >
            {SUPPORTED_CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            The blockchain where this proof will be used.
          </p>
        </div>

        {selectedAsset && assetLockedBalances.length > 0 && (
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-blue-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Locked Balance Available</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You have {assetLockedBalances.length} locked balance(s) for this asset that can be used for proof generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Generating...
            </div>
          ) : (
            'Generate Proof'
          )}
        </button>
      </div>
    </form>
  );
}
