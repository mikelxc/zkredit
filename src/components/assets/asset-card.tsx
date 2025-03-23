'use client';

import { Asset } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface AssetCardProps {
  asset: Asset;
  onSelect?: (asset: Asset) => void;
}

export function AssetCard({ asset, onSelect }: AssetCardProps) {
  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format crypto amount based on value
  const formatCryptoAmount = (amount: number, ticker: string) => {
    if (ticker === 'BTC' && amount < 0.1) {
      return amount.toFixed(8);
    } else if (amount < 0.01) {
      return amount.toFixed(8);
    } else if (amount < 1) {
      return amount.toFixed(4);
    } else if (amount < 1000) {
      return amount.toFixed(2);
    } else {
      return amount.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
  };

  // Format last updated time
  const formatLastUpdated = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Calculate USD value
  const usdValue = asset.balance * asset.usdPrice;

  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-shadow ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={() => onSelect && onSelect(asset)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              {asset.ticker.substring(0, 1)}
            </div>
            {asset.name || asset.ticker}
          </CardTitle>
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
            {asset.source === 'wallet' ? 'Wallet' : asset.sourceName}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-semibold">
              {formatCryptoAmount(asset.balance, asset.ticker)} {asset.ticker}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-gray-500">Value:</span>
            <span className="font-medium">{formatCurrency(usdValue)}</span>
          </div>
          <div className="text-xs text-gray-500 pt-2">
            Updated {formatLastUpdated(asset.lastUpdated)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
