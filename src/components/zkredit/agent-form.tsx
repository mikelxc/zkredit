'use client';

import { useState, useEffect } from 'react';
import { AgentConfig, SUPPORTED_CHAINS } from '@/lib/types/index';
import { v4 as uuidv4 } from 'uuid';

interface AgentFormProps {
  agent?: AgentConfig;
  onSave: (agent: AgentConfig) => void;
  onCancel: () => void;
}

export default function AgentForm({ agent, onSave, onCancel }: AgentFormProps) {
  const [formData, setFormData] = useState<AgentConfig>({
    id: '',
    userId: '',
    agentName: '',
    description: '',
    spendingLimitPerTx: 100,
    dailyLimit: 1000,
    monthlyLimit: 5000,
    allowedChains: [SUPPORTED_CHAINS[0].id],
    autoApproveThreshold: 50,
    notificationThreshold: 80,
    status: 'paused',
    createdAt: '',
    updatedAt: '',
  });

  // Initialize form with agent data if editing
  useEffect(() => {
    if (agent) {
      setFormData(agent);
    }
  }, [agent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (['spendingLimitPerTx', 'dailyLimit', 'monthlyLimit', 'autoApproveThreshold', 'notificationThreshold'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleChainToggle = (chainId: string) => {
    const updatedChains = formData.allowedChains.includes(chainId)
      ? formData.allowedChains.filter(id => id !== chainId)
      : [...formData.allowedChains, chainId];
    
    setFormData({
      ...formData,
      allowedChains: updatedChains,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new agent or update existing one
    const now = new Date().toISOString();
    const updatedAgent: AgentConfig = {
      ...formData,
      id: formData.id || uuidv4(),
      userId: formData.userId || 'current-user-id', // In a real app, this would be the current user's ID
      createdAt: formData.createdAt || now,
      updatedAt: now,
    };
    
    onSave(updatedAgent);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="agentName" className="block text-sm font-medium leading-6 text-gray-900">
            Agent Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="agentName"
              id="agentName"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              value={formData.agentName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
            Description
          </label>
          <div className="mt-2">
            <textarea
              name="description"
              id="description"
              rows={3}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Brief description of what this agent will be used for.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="spendingLimitPerTx" className="block text-sm font-medium leading-6 text-gray-900">
              Per Transaction Limit ($)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="spendingLimitPerTx"
                id="spendingLimitPerTx"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                value={formData.spendingLimitPerTx}
                onChange={handleInputChange}
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="dailyLimit" className="block text-sm font-medium leading-6 text-gray-900">
              Daily Limit ($)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="dailyLimit"
                id="dailyLimit"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                value={formData.dailyLimit}
                onChange={handleInputChange}
                min="0"
                step="1"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="monthlyLimit" className="block text-sm font-medium leading-6 text-gray-900">
              Monthly Limit ($)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="monthlyLimit"
                id="monthlyLimit"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                value={formData.monthlyLimit}
                onChange={handleInputChange}
                min="0"
                step="1"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Allowed Chains
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {SUPPORTED_CHAINS.map((chain) => (
              <div key={chain.id} className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input
                    id={`chain-${chain.id}`}
                    name={`chain-${chain.id}`}
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                    checked={formData.allowedChains.includes(chain.id)}
                    onChange={() => handleChainToggle(chain.id)}
                  />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label htmlFor={`chain-${chain.id}`} className="font-medium text-gray-900">
                    {chain.name}
                  </label>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Select the chains this agent is allowed to operate on.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="autoApproveThreshold" className="block text-sm font-medium leading-6 text-gray-900">
              Auto-Approve Threshold (%)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="autoApproveThreshold"
                id="autoApproveThreshold"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                value={formData.autoApproveThreshold}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="1"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Transactions below this % of the per-transaction limit will be auto-approved.
            </p>
          </div>

          <div>
            <label htmlFor="notificationThreshold" className="block text-sm font-medium leading-6 text-gray-900">
              Notification Threshold (%)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="notificationThreshold"
                id="notificationThreshold"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                value={formData.notificationThreshold}
                onChange={handleInputChange}
                min="0"
                max="100"
                step="1"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              You'll be notified when spending reaches this % of the daily limit.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
            Initial Status
          </label>
          <div className="mt-2">
            <select
              id="status"
              name="status"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
        >
          {agent ? 'Update Agent' : 'Create Agent'}
        </button>
      </div>
    </form>
  );
}
