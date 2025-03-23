'use client';

import { useUser } from '@/lib/providers/user-provider';
import { CRYPTOCURRENCIES } from '@/lib/utils/mock-data';
import { SUPPORTED_CHAINS } from '@/lib/types/index';
import Link from 'next/link';

export default function ZKreditPage() {
  const { assets, creditLine, agentConfigs, lockedBalances, zkProofs, isLoading } = useUser();

  // Calculate total locked assets value
  const totalLockedValue = assets.reduce((sum, asset) => {
    const crypto = CRYPTOCURRENCIES.find(c => c.ticker === asset.ticker);
    return sum + (asset.lockedBalance * (crypto?.price || 0));
  }, 0);

  // Calculate available credit
  const availableCredit = creditLine ? creditLine.totalLimit - creditLine.usedAmount : 0;

  // Count active agents
  const activeAgentsCount = agentConfigs.filter(agent => agent.status === 'active').length;

  // Group locked balances by chain
  const lockedByChain = lockedBalances.reduce((acc, lock) => {
    if (!acc[lock.targetChain]) {
      acc[lock.targetChain] = 0;
    }
    acc[lock.targetChain] += lock.amount;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity (mock data)
  const recentActivity = [
    { id: 1, type: 'Agent Spend', agent: 'Trading Bot', amount: '$120.50', asset: 'ETH', chain: 'Ethereum', time: '2 hours ago' },
    { id: 2, type: 'Proof Generated', proofType: 'Asset Claim', asset: 'BTC', amount: '0.015 BTC', chain: 'Base', time: '5 hours ago' },
    { id: 3, type: 'Asset Locked', asset: 'SOL', amount: '10 SOL', purpose: 'Agent Operations', chain: 'Optimism', time: '1 day ago' },
    { id: 4, type: 'Credit Used', amount: '$500', purpose: 'DeFi Position', time: '2 days ago' },
    { id: 5, type: 'Credit Repaid', amount: '$350', time: '3 days ago' },
  ];

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
          <h1 className="text-2xl font-bold text-gray-900">ZKredit Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your credit lines, agent configurations, and asset locks
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Locked Assets Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-100 text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Locked Assets</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">${totalLockedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/zkredit/asset-locking" className="font-medium text-teal-600 hover:text-teal-500">
                Manage locks
              </Link>
            </div>
          </div>
        </div>

        {/* Available Credit Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Available Credit</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">${availableCredit.toLocaleString('en-US', { maximumFractionDigits: 2 })}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/zkredit/credit-management" className="font-medium text-blue-600 hover:text-blue-500">
                Manage credit
              </Link>
            </div>
          </div>
        </div>

        {/* Active Agents Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Agents</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{activeAgentsCount}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/zkredit/agent-management" className="font-medium text-purple-600 hover:text-purple-500">
                Manage agents
              </Link>
            </div>
          </div>
        </div>

        {/* Active Proofs Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Proofs</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {zkProofs.filter(proof => proof.status === 'active').length}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/dashboard/zkredit/proof-generation" className="font-medium text-blue-600 hover:text-blue-500">
                Generate proofs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Management Section */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Credit Management</h3>
          <div className="mt-4">
            {creditLine ? (
              <div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">Credit Utilization</div>
                  <div className="text-sm font-medium text-gray-900">
                    ${creditLine.usedAmount.toLocaleString('en-US', { maximumFractionDigits: 2 })} / ${creditLine.totalLimit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="mt-2 overflow-hidden rounded-full bg-gray-200">
                  <div 
                    className="h-2 rounded-full bg-blue-600" 
                    style={{ width: `${(creditLine.usedAmount / creditLine.totalLimit) * 100}%` }}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-md bg-gray-50 px-4 py-5">
                    <dt className="truncate text-sm font-medium text-gray-500">Interest Rate</dt>
                    <dd className="mt-1 text-lg font-semibold text-gray-900">{creditLine.interestRate.toFixed(2)}%</dd>
                  </div>
                  <div className="overflow-hidden rounded-md bg-gray-50 px-4 py-5">
                    <dt className="truncate text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        {creditLine.status}
                      </span>
                    </dd>
                  </div>
                </div>
                <div className="mt-5">
                  <Link
                    href="/dashboard/zkredit/credit-management"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Manage Credit Line
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No credit line</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by setting up your credit line.</p>
                <div className="mt-6">
                  <Link
                    href="/dashboard/zkredit/credit-management"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    Set up credit line
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Locked Assets by Chain */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Locked Assets by Chain</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {SUPPORTED_CHAINS.map((chain) => {
              const lockedAmount = lockedByChain[chain.id] || 0;
              const hasLocked = lockedAmount > 0;
              
              return (
                <div key={chain.id} className="overflow-hidden rounded-md bg-gray-50 px-4 py-5">
                  <div className="flex items-center">
                    <div 
                      className="h-8 w-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: chain.color + '20' }}
                    >
                      <div 
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: chain.color }}
                      />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-900">{chain.name}</span>
                  </div>
                  <div className="mt-2">
                    {hasLocked ? (
                      <span className="text-lg font-semibold text-gray-900">
                        {lockedAmount.toLocaleString('en-US', { maximumFractionDigits: 4 })}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">No locked assets</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5">
            <Link
              href="/dashboard/zkredit/asset-locking"
              className="text-sm font-medium text-teal-600 hover:text-teal-500"
            >
              View all locked assets →
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">ZKredit Features</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Asset Locking */}
            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center space-y-3 hover:border-teal-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-teal-100 text-teal-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900">Asset Locking</h3>
                <p className="mt-1 text-xs text-gray-500">Lock assets to use for ZKredit operations</p>
              </div>
              <Link href="/dashboard/zkredit/asset-locking" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">Asset Locking</span>
              </Link>
            </div>

            {/* Credit Lines */}
            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center space-y-3 hover:border-blue-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900">Credit Lines</h3>
                <p className="mt-1 text-xs text-gray-500">Manage your credit lines and borrowing</p>
              </div>
              <Link href="/dashboard/zkredit/credit-lines" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">Credit Lines</span>
              </Link>
            </div>

            {/* Agent Management */}
            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center space-y-3 hover:border-purple-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900">Agent Management</h3>
                <p className="mt-1 text-xs text-gray-500">Configure and control your AI agents</p>
              </div>
              <Link href="/dashboard/zkredit/agent-management" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">Agent Management</span>
              </Link>
            </div>

            {/* Proof Generation */}
            <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex flex-col items-center space-y-3 hover:border-green-500">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-sm font-medium text-gray-900">Proof Generation</h3>
                <p className="mt-1 text-xs text-gray-500">Generate zero-knowledge proofs</p>
              </div>
              <Link href="/dashboard/zkredit/proof-generation" className="absolute inset-0 focus:outline-none">
                <span className="sr-only">Proof Generation</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
          <div className="mt-6 flow-root">
            <ul role="list" className="-mb-8">
              {recentActivity.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== recentActivity.length - 1 ? (
                      <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span
                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            activity.type === 'Agent Spend' ? 'bg-purple-100' :
                            activity.type === 'Proof Generated' ? 'bg-blue-100' :
                            activity.type === 'Asset Locked' ? 'bg-teal-100' :
                            activity.type === 'Credit Used' ? 'bg-red-100' :
                            'bg-green-100'
                          }`}
                        >
                          {activity.type === 'Agent Spend' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-purple-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                            </svg>
                          )}
                          {activity.type === 'Proof Generated' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                            </svg>
                          )}
                          {activity.type === 'Asset Locked' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-teal-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                          )}
                          {activity.type === 'Credit Used' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                            </svg>
                          )}
                          {activity.type === 'Credit Repaid' && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-600">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                            </svg>
                          )}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-900">
                            {activity.type}
                            {activity.agent && <span className="font-medium"> by {activity.agent}</span>}
                            {activity.proofType && <span className="font-medium"> ({activity.proofType})</span>}
                            {activity.amount && <span> - {activity.amount}</span>}
                            {activity.asset && <span> {activity.asset}</span>}
                            {activity.purpose && <span> for {activity.purpose}</span>}
                            {activity.chain && <span> on {activity.chain}</span>}
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          <time>{activity.time}</time>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ZKredit Features */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Agent Management */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Agent Management</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Configure AI agents with specific spending limits and chain restrictions.</p>
            </div>
            <div className="mt-5">
              <Link
                href="/dashboard/zkredit/agent-management"
                className="inline-flex items-center rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              >
                Manage Agents
              </Link>
            </div>
          </div>
        </div>

        {/* Proof Generator */}
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">ZK Proof Generator</h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Generate zero-knowledge proofs for assets, credit lines, and agent authority.</p>
            </div>
            <div className="mt-5">
              <Link
                href="/dashboard/zkredit/proof-generation"
                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Generate Proofs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
