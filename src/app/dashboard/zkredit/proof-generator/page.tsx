'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { CRYPTOCURRENCIES } from '@/lib/utils/mock-data';
import { SUPPORTED_CHAINS } from '@/lib/types/index';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export default function ProofGeneratorPage() {
  const { assets, zkProofs, refreshUserData, isLoading } = useUser();
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [selectedChain, setSelectedChain] = useState<string>(SUPPORTED_CHAINS[0].id);
  const [proofType, setProofType] = useState<string>('ownership');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProofId, setGeneratedProofId] = useState<string | null>(null);

  // Reset form when assets change
  useEffect(() => {
    if (assets.length > 0 && !selectedAsset) {
      setSelectedAsset(assets[0].id);
    }
  }, [assets, selectedAsset]);

  const handleGenerateProof = () => {
    if (!selectedAsset) return;
    
    setIsGenerating(true);
    
    const asset = assets.find(a => a.id === selectedAsset);
    if (!asset) return;
    
    // Simulate proof generation
    setTimeout(() => {
      const newProof = {
        id: uuidv4(),
        userId: asset.userId,
        proofType: proofType as any,
        proofData: `0x${Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        assetId: asset.id,
        assetTicker: asset.ticker,
        amount: asset.balance * 0.8,
        targetChain: selectedChain,
        status: 'active' as const,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString()
      };
      
      setGeneratedProofId(newProof.id);
      setIsGenerating(false);
      refreshUserData();
    }, 2000);
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
          <h1 className="text-2xl font-bold text-gray-900">ZK Proof Generator</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate zero-knowledge proofs for your assets
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Proof Generator Form */}
        <div className="md:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-50">
            <h2 className="text-lg font-medium text-blue-800">Generate New Proof</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-4">
            <div>
              <label htmlFor="asset" className="block text-sm font-medium text-gray-700">
                Select Asset
              </label>
              <select
                id="asset"
                value={selectedAsset || ''}
                onChange={(e) => setSelectedAsset(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select an asset</option>
                {assets.map((asset) => {
                  const crypto = CRYPTOCURRENCIES.find(c => c.ticker === asset.ticker);
                  return (
                    <option key={asset.id} value={asset.id}>
                      {crypto?.name || asset.ticker} - {asset.balance.toFixed(4)} {asset.ticker}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label htmlFor="proofType" className="block text-sm font-medium text-gray-700">
                Proof Type
              </label>
              <select
                id="proofType"
                value={proofType}
                onChange={(e) => setProofType(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="ownership">Ownership Proof</option>
                <option value="balance">Balance Proof</option>
                <option value="credit">Credit Proof</option>
                <option value="Asset Claim">Asset Claim</option>
                <option value="Credit Line">Credit Line Proof</option>
                <option value="Agent Authority">Agent Authority Proof</option>
              </select>
            </div>

            <div>
              <label htmlFor="targetChain" className="block text-sm font-medium text-gray-700">
                Target Chain
              </label>
              <select
                id="targetChain"
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {SUPPORTED_CHAINS.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                onClick={handleGenerateProof}
                disabled={!selectedAsset || isGenerating}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Proof'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Proofs */}
        <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-50">
            <h2 className="text-lg font-medium text-blue-800">Your Recent Proofs</h2>
          </div>
          <div className="border-t border-gray-200">
            {zkProofs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chain</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {zkProofs.map(proof => {
                      const chain = SUPPORTED_CHAINS.find(c => c.id === proof.targetChain);
                      const createdDate = new Date(proof.createdAt);
                      const expiresDate = new Date(proof.expiresAt);
                      
                      return (
                        <tr key={proof.id} className={proof.id === generatedProofId ? 'bg-blue-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100">
                                {proof.assetTicker?.substring(0, 1)}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900">{proof.assetTicker}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{proof.proofType}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {chain && (
                                <div className="flex-shrink-0 h-4 w-4 mr-2" style={{ backgroundColor: chain.color, borderRadius: '50%' }}></div>
                              )}
                              <div className="text-sm text-gray-900">{chain?.name || proof.targetChain}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              proof.status === 'active' ? 'bg-green-100 text-green-800' : 
                              proof.status === 'expired' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {proof.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{createdDate.toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{expiresDate.toLocaleDateString()}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No proofs found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by generating a new proof.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What are ZK Proofs Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-lg font-medium text-blue-800">What are Zero-Knowledge Proofs?</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            <p>
              Zero-knowledge proofs (ZKPs) are cryptographic methods that allow one party (the prover) to prove to another party (the verifier) that a statement is true without revealing any additional information beyond the validity of the statement itself.
            </p>
            
            <h3 className="text-md font-medium mt-4">Types of Proofs Available:</h3>
            
            <ul className="mt-2 space-y-2">
              <li>
                <strong>Ownership Proof:</strong> Prove that you own a specific asset without revealing your identity or the full details of the asset.
              </li>
              <li>
                <strong>Balance Proof:</strong> Prove that you have at least a certain amount of an asset without revealing the exact balance.
              </li>
              <li>
                <strong>Credit Proof:</strong> Prove your creditworthiness based on your credit line without revealing sensitive financial details.
              </li>
              <li>
                <strong>Asset Claim:</strong> Generate a proof that can be used to claim an asset on another chain.
              </li>
              <li>
                <strong>Credit Line Proof:</strong> Prove the existence and details of your credit line without revealing sensitive information.
              </li>
              <li>
                <strong>Agent Authority Proof:</strong> Prove that an agent has authority to act on your behalf without revealing the full scope of permissions.
              </li>
            </ul>
            
            <p className="mt-4">
              These proofs can be used across different blockchain networks to enable secure, private transactions and interactions while maintaining the highest level of privacy.
            </p>
          </div>
        </div>
      </div>

      {/* Link back to main ZKredit dashboard */}
      <div className="flex justify-end">
        <Link href="/dashboard/zkredit" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
