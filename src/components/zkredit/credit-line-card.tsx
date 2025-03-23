'use client';

import { CreditLine } from '@/lib/types';

interface CreditLineCardProps {
  creditLine: CreditLine;
  onEdit: (creditLineId: string) => void;
  onClose: (creditLineId: string) => void;
}

export default function CreditLineCard({ creditLine, onEdit, onClose }: CreditLineCardProps) {
  // Calculate utilization percentage
  const utilizationPercentage = creditLine.limit > 0 
    ? (creditLine.used / creditLine.limit) * 100 
    : 0;
  
  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{creditLine.name}</h3>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              creditLine.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {creditLine.status}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(creditLine.id)}
              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit
            </button>
            <button
              onClick={() => onClose(creditLine.id)}
              className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-red-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Credit Limit:</span>
            <span className="text-sm font-medium text-gray-900">
              ${creditLine.limit.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">Used:</span>
            <span className="text-sm font-medium text-gray-900">
              ${creditLine.used.toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">Available:</span>
            <span className="text-sm font-medium text-gray-900">
              ${(creditLine.limit - creditLine.used).toLocaleString('en-US', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">Interest Rate:</span>
            <span className="text-sm font-medium text-gray-900">
              {creditLine.interestRate.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Utilization</span>
            <span className="text-sm font-medium text-gray-900">
              {utilizationPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                utilizationPercentage > 80 ? 'bg-red-600' : 
                utilizationPercentage > 50 ? 'bg-yellow-400' : 
                'bg-green-500'
              }`} 
              style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-gray-500">Created:</span>
            <p className="text-sm font-medium text-gray-900">{formatDate(creditLine.createdAt)}</p>
          </div>
          <div>
            <span className="text-sm text-gray-500">Expires:</span>
            <p className="text-sm font-medium text-gray-900">{formatDate(creditLine.expiresAt)}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-500">Collateral</h4>
          <div className="mt-2 text-sm text-gray-900">
            {creditLine.collateralAssetIds.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {creditLine.collateralAssetIds.map((assetId) => (
                  <span 
                    key={assetId} 
                    className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                  >
                    Asset #{assetId.substring(0, 8)}
                  </span>
                ))}
              </div>
            ) : (
              <p>No collateral assets</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
