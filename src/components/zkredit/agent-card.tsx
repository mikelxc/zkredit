'use client';

import { AgentConfig, SUPPORTED_CHAINS } from '@/lib/types/index';

interface AgentCardProps {
  agent: AgentConfig;
  onEdit: (agentId: string) => void;
  onDelete: (agentId: string) => void;
  onToggleStatus: (agentId: string, newStatus: 'active' | 'paused') => void;
}

export default function AgentCard({ agent, onEdit, onDelete, onToggleStatus }: AgentCardProps) {
  // Get chain names from chain IDs
  const chainNames = agent.allowedChains.map(chainId => {
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    return chain ? chain.name : chainId;
  });

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              agent.status === 'active' ? 'bg-purple-100' : 'bg-gray-100'
            }`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-6 w-6 ${
                agent.status === 'active' ? 'text-purple-600' : 'text-gray-600'
              }`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{agent.agentName}</h3>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {agent.status}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onToggleStatus(agent.id, agent.status === 'active' ? 'paused' : 'active')}
              className={`inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium ${
                agent.status === 'active' 
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {agent.status === 'active' ? 'Pause' : 'Activate'}
            </button>
            <button
              onClick={() => onEdit(agent.id)}
              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(agent.id)}
              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-red-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Spending Limits</h4>
            <div className="mt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Per Transaction:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${agent.spendingLimitPerTx.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Daily Limit:</span>
                <span className="text-sm font-medium text-gray-900">
                  ${agent.dailyLimit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Allowed Chains</h4>
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {chainNames.map((chainName) => (
                  <span 
                    key={chainName} 
                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                  >
                    {chainName}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500">Recent Activity</h4>
          <div className="mt-2 text-sm text-gray-500">
            {/* This would be real data in a production app */}
            <p>No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
