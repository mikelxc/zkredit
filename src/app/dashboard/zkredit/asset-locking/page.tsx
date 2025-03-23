'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { CRYPTOCURRENCIES } from '@/lib/utils/mock-data';
import { SUPPORTED_CHAINS } from '@/lib/types/index';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function AssetLockingPage() {
  const { assets, lockedBalances, refreshUserData, isLoading } = useUser();
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [lockAmount, setLockAmount] = useState<string>('');
  const [lockPurpose, setLockPurpose] = useState<'Agent Operations' | 'Credit Backing' | 'Direct Transactions'>('Agent Operations');
  const [targetChain, setTargetChain] = useState<string>(SUPPORTED_CHAINS[0].id);
  const [lockDuration, setLockDuration] = useState<number>(7); // days

  // Find asset details for the selected asset
  const selectedAssetDetails = assets.find(asset => asset.id === selectedAsset);
  const selectedCrypto = selectedAssetDetails 
    ? CRYPTOCURRENCIES.find(c => c.ticker === selectedAssetDetails.ticker) 
    : null;

  // Calculate the USD value of the lock amount
  const lockAmountUsd = selectedCrypto && lockAmount
    ? parseFloat(lockAmount) * selectedCrypto.price
    : 0;

  // Function to handle locking assets
  const handleLockAsset = () => {
    if (!selectedAsset || !lockAmount || parseFloat(lockAmount) <= 0) {
      return;
    }

    // In a real app, this would be an API call to lock the asset
    // For this mock, we'll simulate by updating our local state

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + lockDuration);

    // Create a new locked balance record
    const newLockedBalance = {
      id: uuidv4(),
      userId: selectedAssetDetails?.userId || '',
      assetId: selectedAsset,
      amount: parseFloat(lockAmount),
      purpose: lockPurpose,
      targetChain,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    // In a real app, we would send this to the backend
    console.log('Locking asset:', newLockedBalance);

    // Refresh user data (in a real app, this would fetch updated data from the backend)
    refreshUserData();

    // Close the modal
    setIsLockModalOpen(false);
    resetForm();
  };

  // Function to handle unlocking assets
  const handleUnlockAsset = (lockedBalanceId: string) => {
    // In a real app, this would be an API call to unlock the asset
    console.log('Unlocking asset:', lockedBalanceId);

    // Refresh user data
    refreshUserData();
  };

  // Reset the form
  const resetForm = () => {
    setSelectedAsset(null);
    setLockAmount('');
    setLockPurpose('Agent Operations');
    setTargetChain(SUPPORTED_CHAINS[0].id);
    setLockDuration(7);
  };

  // Get the chain name from the chain ID
  const getChainName = (chainId: string) => {
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    return chain ? chain.name : chainId;
  };

  // Get the asset ticker from the asset ID
  const getAssetTicker = (assetId: string) => {
    const asset = assets.find(a => a.id === assetId);
    return asset ? asset.ticker : 'Unknown';
  };

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Check if a lock is expired
  const isLockExpired = (expiresAt: string) => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    return now > expiration;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Locking</h1>
          <p className="mt-1 text-sm text-gray-500">
            Lock your assets for ZKredit operations across different chains
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setIsLockModalOpen(true)}
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Lock Asset
          </button>
        </div>
      </div>

      {/* Available Assets Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Available Assets</h3>
          <div className="mt-4 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Asset</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Balance</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Locked</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Value (USD)</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {assets.map((asset) => {
                      const crypto = CRYPTOCURRENCIES.find(c => c.ticker === asset.ticker);
                      const price = crypto?.price || 0;
                      const value = asset.balance * price;
                      // Locked value can be calculated if needed
                      
                      return (
                        <tr key={asset.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {asset.ticker}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${price.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {asset.lockedBalance > 0 ? (
                              <span className="text-teal-600 font-medium">
                                {asset.lockedBalance.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                              </span>
                            ) : (
                              <span>0</span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            ${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              onClick={() => {
                                setSelectedAsset(asset.id);
                                setIsLockModalOpen(true);
                              }}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              Lock<span className="sr-only">, {asset.ticker}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Locked Assets Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Locked Assets</h3>
          {lockedBalances.length > 0 ? (
            <div className="mt-4 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Asset</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Purpose</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Chain</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Expires</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {lockedBalances.map((lock) => {
                        const expired = isLockExpired(lock.expiresAt);
                        
                        return (
                          <tr key={lock.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                              {getAssetTicker(lock.assetId)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {lock.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                lock.purpose === 'Agent Operations' ? 'bg-purple-100 text-purple-800' :
                                lock.purpose === 'Credit Backing' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {lock.purpose}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {getChainName(lock.targetChain)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span className={expired ? 'text-red-600' : ''}>
                                {formatDate(lock.expiresAt)}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              <button
                                onClick={() => handleUnlockAsset(lock.id)}
                                className="text-red-600 hover:text-red-900"
                                disabled={expired}
                              >
                                {expired ? 'Expired' : 'Unlock'}
                                <span className="sr-only">, {getAssetTicker(lock.assetId)}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No locked assets</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by locking an asset for ZKredit operations.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsLockModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Lock Asset
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lock Asset Modal */}
      <Transition.Root show={isLockModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsLockModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-teal-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Lock Asset
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Lock your assets for ZKredit operations across different chains.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 space-y-4">
                    {/* Asset Selector */}
                    <div>
                      <label htmlFor="asset" className="block text-sm font-medium leading-6 text-gray-900">
                        Asset
                      </label>
                      <select
                        id="asset"
                        name="asset"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
                        value={selectedAsset || ''}
                        onChange={(e) => setSelectedAsset(e.target.value)}
                      >
                        <option value="">Select an asset</option>
                        {assets.map((asset) => (
                          <option key={asset.id} value={asset.id}>
                            {asset.ticker} ({asset.balance.toLocaleString('en-US', { maximumFractionDigits: 8 })})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount Input */}
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium leading-6 text-gray-900">
                        Amount
                      </label>
                      <div className="relative mt-2 rounded-md shadow-sm">
                        <input
                          type="number"
                          name="amount"
                          id="amount"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                          placeholder="0.00"
                          value={lockAmount}
                          onChange={(e) => setLockAmount(e.target.value)}
                          min="0"
                          max={selectedAssetDetails?.balance.toString() || "0"}
                          step="any"
                        />
                      </div>
                      {selectedAssetDetails && lockAmount && (
                        <p className="mt-1 text-sm text-gray-500">
                          ≈ ${lockAmountUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })} USD
                        </p>
                      )}
                    </div>

                    {/* Duration Selector */}
                    <div>
                      <label htmlFor="duration" className="block text-sm font-medium leading-6 text-gray-900">
                        Duration
                      </label>
                      <select
                        id="duration"
                        name="duration"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
                        value={lockDuration}
                        onChange={(e) => setLockDuration(parseInt(e.target.value))}
                      >
                        <option value={1}>1 day</option>
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                      </select>
                    </div>

                    {/* Target Chain Selector */}
                    <div>
                      <label htmlFor="chain" className="block text-sm font-medium leading-6 text-gray-900">
                        Target Chain
                      </label>
                      <select
                        id="chain"
                        name="chain"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
                        value={targetChain}
                        onChange={(e) => setTargetChain(e.target.value)}
                      >
                        {SUPPORTED_CHAINS.map((chain) => (
                          <option key={chain.id} value={chain.id}>
                            {chain.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Purpose Selector */}
                    <div>
                      <label htmlFor="purpose" className="block text-sm font-medium leading-6 text-gray-900">
                        Purpose
                      </label>
                      <select
                        id="purpose"
                        name="purpose"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-teal-600 sm:text-sm sm:leading-6"
                        value={lockPurpose}
                        onChange={(e) => setLockPurpose(e.target.value as 'Agent Operations' | 'Credit Backing' | 'Direct Transactions')}
                      >
                        <option value="Agent Operations">Agent Operations</option>
                        <option value="Credit Backing">Credit Backing</option>
                        <option value="Direct Transactions">Direct Transactions</option>
                      </select>
                    </div>

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 sm:col-start-2"
                        onClick={handleLockAsset}
                        disabled={!selectedAsset || !lockAmount || parseFloat(lockAmount) <= 0}
                      >
                        Lock Asset
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                        onClick={() => {
                          setIsLockModalOpen(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
