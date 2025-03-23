'use client';

import { useState, useEffect } from 'react';
import { CreditLine } from '@/lib/types';
import { useUser } from '@/lib/providers/user-provider';
import { v4 as uuidv4 } from 'uuid';

interface CreditLineFormProps {
  creditLine?: CreditLine;
  onSave: (creditLine: CreditLine) => void;
  onCancel: () => void;
}

export default function CreditLineForm({ creditLine, onSave, onCancel }: CreditLineFormProps) {
  const { lockedBalances } = useUser();
  const [formData, setFormData] = useState<CreditLine>({
    id: '',
    userId: '',
    name: '',
    limit: 1000,
    used: 0,
    interestRate: 5.0,
    collateralAssetIds: [],
    status: 'active',
    createdAt: '',
    updatedAt: '',
    expiresAt: '',
  });

  // Initialize form with credit line data if editing
  useEffect(() => {
    if (creditLine) {
      setFormData(creditLine);
    } else {
      // Set default expiration date to 1 year from now for new credit lines
      const defaultExpiration = new Date();
      defaultExpiration.setFullYear(defaultExpiration.getFullYear() + 1);
      
      setFormData(prev => ({
        ...prev,
        expiresAt: defaultExpiration.toISOString().split('T')[0],
      }));
    }
  }, [creditLine]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle numeric inputs
    if (['limit', 'used', 'interestRate'].includes(name)) {
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

  const handleCollateralToggle = (assetId: string) => {
    const updatedCollateral = formData.collateralAssetIds.includes(assetId)
      ? formData.collateralAssetIds.filter(id => id !== assetId)
      : [...formData.collateralAssetIds, assetId];
    
    setFormData({
      ...formData,
      collateralAssetIds: updatedCollateral,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new credit line or update existing one
    const now = new Date().toISOString();
    const updatedCreditLine: CreditLine = {
      ...formData,
      id: formData.id || uuidv4(),
      userId: formData.userId || 'current-user-id', // In a real app, this would be the current user's ID
      createdAt: formData.createdAt || now,
      updatedAt: now,
    };
    
    onSave(updatedCreditLine);
  };

  // Get available locked assets for collateral
  const availableCollateral = lockedBalances.filter(
    lock => lock.purpose === 'Credit Backing'
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
            Credit Line Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="limit" className="block text-sm font-medium leading-6 text-gray-900">
              Credit Limit ($)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="limit"
                id="limit"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                value={formData.limit}
                onChange={handleInputChange}
                min="0"
                step="100"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="used" className="block text-sm font-medium leading-6 text-gray-900">
              Used Amount ($)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="used"
                id="used"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                value={formData.used}
                onChange={handleInputChange}
                min="0"
                step="100"
                required
                disabled={!creditLine} // Only allow editing used amount for existing credit lines
              />
            </div>
          </div>

          <div>
            <label htmlFor="interestRate" className="block text-sm font-medium leading-6 text-gray-900">
              Interest Rate (%)
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="interestRate"
                id="interestRate"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
                value={formData.interestRate}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="expiresAt" className="block text-sm font-medium leading-6 text-gray-900">
            Expiration Date
          </label>
          <div className="mt-2">
            <input
              type="date"
              name="expiresAt"
              id="expiresAt"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-teal-600 sm:text-sm sm:leading-6"
              value={formData.expiresAt.split('T')[0]}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">
            Status
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

        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Collateral Assets
          </label>
          {availableCollateral.length > 0 ? (
            <div className="mt-2 space-y-2">
              {availableCollateral.map((lock) => (
                <div key={lock.id} className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input
                      id={`collateral-${lock.id}`}
                      name={`collateral-${lock.id}`}
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                      checked={formData.collateralAssetIds.includes(lock.id)}
                      onChange={() => handleCollateralToggle(lock.id)}
                    />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor={`collateral-${lock.id}`} className="font-medium text-gray-900">
                      Asset Lock #{lock.id.substring(0, 8)}
                    </label>
                    <p className="text-gray-500">
                      Amount: {lock.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-2 text-sm text-gray-500">
              <p>No assets are locked for credit backing. Lock assets first to use as collateral.</p>
            </div>
          )}
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
          {creditLine ? 'Update Credit Line' : 'Create Credit Line'}
        </button>
      </div>
    </form>
  );
}
