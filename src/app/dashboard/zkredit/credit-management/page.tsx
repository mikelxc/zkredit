'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { CRYPTOCURRENCIES } from '@/lib/utils/mock-data';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';


export default function CreditManagementPage() {
  const { creditLine, assets, refreshUserData, isLoading } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [creditLimit, setCreditLimit] = useState(10000);
  const [interestRate, setInterestRate] = useState(5);

  // Calculate total collateral value
  const totalCollateralValue = assets
    .filter(asset => selectedAssetIds.includes(asset.id))
    .reduce((sum, asset) => {
      const crypto = CRYPTOCURRENCIES.find(c => c.ticker === asset.ticker);
      return sum + (asset.balance * (crypto?.price || 0));
    }, 0);

  // Calculate available credit
  const availableCredit = creditLine ? creditLine.totalLimit - creditLine.usedAmount : 0;

  const handleCreateCreditLine = () => {
    // In a real app, this would be an API call
    setTimeout(() => {
      refreshUserData();
      setIsDialogOpen(false);
      setSelectedAssetIds([]);
      setCreditLimit(10000);
      setInterestRate(5);
    }, 500);
  };

  const handleAssetToggle = (assetId: string) => {
    if (selectedAssetIds.includes(assetId)) {
      setSelectedAssetIds(selectedAssetIds.filter(id => id !== assetId));
    } else {
      setSelectedAssetIds([...selectedAssetIds, assetId]);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Credit Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your credit lines and collateralized assets
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Credit Line
          </button>
        </div>
      </div>

      {/* Credit Line Overview */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-lg font-medium text-blue-800">Credit Line Overview</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {creditLine ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Total Credit Limit</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">${creditLine.totalLimit.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Available Credit</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">${availableCredit.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Interest Rate</h3>
                <p className="mt-1 text-2xl font-semibold text-gray-900">{creditLine.interestRate.toFixed(2)}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className="inline-flex mt-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {creditLine.status.toUpperCase()}
                </span>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Expiration Date</h3>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(creditLine.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(creditLine.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No credit line found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new credit line.</p>
              <div className="mt-6">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Credit Line
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Collateralized Assets */}
      {creditLine && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-50">
            <h2 className="text-lg font-medium text-blue-800">Collateralized Assets</h2>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value (USD)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assets
                    .filter(asset => creditLine.collateralAssetIds.includes(asset.id))
                    .map(asset => {
                      const crypto = CRYPTOCURRENCIES.find(c => c.ticker === asset.ticker);
                      const value = asset.balance * (crypto?.price || 0);
                      
                      return (
                        <tr key={asset.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                                {asset.ticker.substring(0, 1)}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{crypto?.name || asset.ticker}</div>
                                <div className="text-sm text-gray-500">{asset.ticker}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{asset.balance.toFixed(4)} {asset.ticker}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              COLLATERALIZED
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Create Credit Line Dialog */}
      <Transition appear show={isDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsDialogOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Create New Credit Line
                  </Dialog.Title>
                  <div className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="creditLimit" className="block text-sm font-medium text-gray-700">
                        Credit Limit (USD)
                      </label>
                      <input
                        type="number"
                        id="creditLimit"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700">
                        Interest Rate (%)
                      </label>
                      <input
                        type="number"
                        id="interestRate"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Select Collateral Assets
                      </label>
                      <div className="mt-2 max-h-60 overflow-y-auto border border-gray-300 rounded-md divide-y">
                        {assets.map(asset => {
                          const crypto = CRYPTOCURRENCIES.find(c => c.ticker === asset.ticker);
                          const value = asset.balance * (crypto?.price || 0);
                          
                          return (
                            <div 
                              key={asset.id} 
                              className={`p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 ${
                                selectedAssetIds.includes(asset.id) ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => handleAssetToggle(asset.id)}
                            >
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full bg-gray-100">
                                  {asset.ticker.substring(0, 1)}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{crypto?.name || asset.ticker}</p>
                                  <p className="text-xs text-gray-500">{asset.balance.toFixed(4)} {asset.ticker}</p>
                                </div>
                              </div>
                              <div className="text-sm text-gray-900">${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Collateral Value: ${totalCollateralValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={handleCreateCreditLine}
                      disabled={selectedAssetIds.length === 0}
                    >
                      Create
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
