'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { CRYPTOCURRENCIES } from '@/lib/utils/mock-data';
import Link from 'next/link';

export default function TradePage() {
  const { assets, isLoading } = useUser();
  const [fromAsset, setFromAsset] = useState('');
  const [toAsset, setToAsset] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tradeComplete, setTradeComplete] = useState(false);

  // Filter cryptocurrencies is done in the UI directly

  // Calculate exchange rate
  const getExchangeRate = (from: string, to: string) => {
    const fromCrypto = CRYPTOCURRENCIES.find(c => c.ticker === from);
    const toCrypto = CRYPTOCURRENCIES.find(c => c.ticker === to);
    
    if (!fromCrypto || !toCrypto) return 0;
    
    return toCrypto.price / fromCrypto.price;
  };

  // Calculate estimated amount
  const calculateEstimatedAmount = () => {
    if (!fromAsset || !toAsset || !amount) return 0;
    
    const rate = getExchangeRate(fromAsset, toAsset);
    return parseFloat(amount) * rate;
  };

  // Handle trade submission
  const handleTrade = () => {
    if (!fromAsset || !toAsset || !amount) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setTradeComplete(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFromAsset('');
        setToAsset('');
        setAmount('');
        setTradeComplete(false);
      }, 3000);
    }, 1500);
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
          <h1 className="text-2xl font-bold text-gray-900">Trade Assets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Exchange your cryptocurrency assets
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Trade Form */}
        <div className="md:col-span-1 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-50">
            <h2 className="text-lg font-medium text-blue-800">Exchange Assets</h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6 space-y-4">
            <div>
              <label htmlFor="fromAsset" className="block text-sm font-medium text-gray-700">
                From Asset
              </label>
              <select
                id="fromAsset"
                value={fromAsset}
                onChange={(e) => setFromAsset(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select asset</option>
                {assets.map((asset) => (
                  <option key={`from-${asset.id}`} value={asset.ticker}>
                    {asset.ticker} - {asset.balance.toFixed(4)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full pr-12 sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">{fromAsset}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>

            <div>
              <label htmlFor="toAsset" className="block text-sm font-medium text-gray-700">
                To Asset
              </label>
              <select
                id="toAsset"
                value={toAsset}
                onChange={(e) => setToAsset(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">Select asset</option>
                {CRYPTOCURRENCIES.map((crypto) => (
                  <option key={`to-${crypto.ticker}`} value={crypto.ticker}>
                    {crypto.name} ({crypto.ticker})
                  </option>
                ))}
              </select>
            </div>

            {fromAsset && toAsset && amount && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Estimated amount:</p>
                <p className="text-lg font-medium text-gray-900">
                  {calculateEstimatedAmount().toFixed(6)} {toAsset}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Exchange rate: 1 {fromAsset} = {getExchangeRate(fromAsset, toAsset).toFixed(6)} {toAsset}
                </p>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleTrade}
                disabled={!fromAsset || !toAsset || !amount || isSubmitting || tradeComplete}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : tradeComplete ? (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Trade Complete!
                  </>
                ) : (
                  'Execute Trade'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Market Information */}
        <div className="md:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-blue-50">
            <h2 className="text-lg font-medium text-blue-800">Market Information</h2>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (USD)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {CRYPTOCURRENCIES.map((crypto) => {
                    const userAsset = assets.find(a => a.ticker === crypto.ticker);
                    const changePercent = (Math.random() * 10) - 5; // Random change between -5% and +5%
                    
                    return (
                      <tr key={crypto.ticker}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100">
                              {crypto.ticker.substring(0, 1)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{crypto.name}</div>
                              <div className="text-sm text-gray-500">{crypto.ticker}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${crypto.price.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            changePercent > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {userAsset ? userAsset.balance.toFixed(4) : '0.0000'} {crypto.ticker}
                          </div>
                          {userAsset && (
                            <div className="text-xs text-gray-500">
                              ${(userAsset.balance * crypto.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                            </div>
                          )}
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

      {/* Trading Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-blue-50">
          <h2 className="text-lg font-medium text-blue-800">Trading Information</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="prose max-w-none">
            <p>
              This is a simulated trading interface for demonstration purposes. In a real application, this would connect to actual cryptocurrency exchanges and provide real-time market data and trading capabilities.
            </p>
            
            <h3 className="text-md font-medium mt-4">Trading Features:</h3>
            
            <ul className="mt-2 space-y-2">
              <li>
                <strong>Asset Exchange:</strong> Trade between different cryptocurrencies at market rates.
              </li>
              <li>
                <strong>Real-time Pricing:</strong> Get up-to-date market prices for all supported assets.
              </li>
              <li>
                <strong>Portfolio Management:</strong> Track your asset balances and overall portfolio value.
              </li>
              <li>
                <strong>Transaction History:</strong> View your complete trading history and performance.
              </li>
            </ul>
            
            <p className="mt-4">
              For advanced trading features and real market access, please connect your wallet and complete the verification process.
            </p>
          </div>
        </div>
      </div>

      {/* Link back to main dashboard */}
      <div className="flex justify-end">
        <Link href="/dashboard" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
