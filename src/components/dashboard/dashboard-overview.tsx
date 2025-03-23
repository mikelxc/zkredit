'use client';

import { useUser } from '@/lib/providers/user-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset, ZkProof, AgentConfig } from '@/lib/types';

export function DashboardOverview() {
  const { assets, zkProofs, agentConfigs, creditLine, isLoading } = useUser();

  // Calculate total portfolio value
  const calculateTotalValue = (assets: Asset[]) => {
    return assets.reduce((total, asset) => total + asset.balance * asset.usdPrice, 0);
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Count active agents
  const countActiveAgents = (agents: AgentConfig[]) => {
    return agents.filter(agent => agent.status === 'active').length;
  };

  // Count valid proofs
  const countValidProofs = (proofs: ZkProof[]) => {
    return proofs.filter(proof => proof.status === 'valid').length;
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalValue = calculateTotalValue(assets);
  const availableCredit = creditLine?.availableCredit || 0;
  const activeAgents = countActiveAgents(agentConfigs);
  const validProofs = countValidProofs(zkProofs);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Portfolio Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-gray-500 mt-1">
            Across {assets.length} assets
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Available Credit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(availableCredit)}</div>
          <p className="text-xs text-gray-500 mt-1">
            {creditLine ? `${(creditLine.utilizationRate).toFixed(1)}% utilized` : 'No credit line'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Active Agents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAgents}</div>
          <p className="text-xs text-gray-500 mt-1">
            Out of {agentConfigs.length} total agents
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Valid Proofs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{validProofs}</div>
          <p className="text-xs text-gray-500 mt-1">
            Out of {zkProofs.length} total proofs
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
