'use client';

import { formatDistanceToNow } from 'date-fns';
import { AgentConfig } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

interface AgentCardProps {
  agent: AgentConfig;
  onToggleStatus?: (agentId: string, newStatus: 'active' | 'inactive') => void;
  onEdit?: (agentId: string) => void;
  onDelete?: (agentId: string) => void;
}

export function AgentCard({ agent, onToggleStatus, onEdit, onDelete }: AgentCardProps) {
  // Format status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format dates for display
  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  // Handle status toggle
  const handleStatusToggle = () => {
    if (onToggleStatus) {
      const newStatus = agent.status === 'active' ? 'inactive' : 'active';
      onToggleStatus(agent.id, newStatus);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{agent.name}</CardTitle>
          <Badge className={getStatusColor(agent.status)}>
            {agent.status.toUpperCase()}
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          {agent.type}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Permissions:</span>
            <div className="flex gap-1">
              {agent.permissions.filter(Boolean).map((permission, index) => (
                <span key={index} className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">
                  {permission}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Created:</span>
            <span>{formatDate(agent.createdAt)}</span>
          </div>
          {agent.lastActive && (
            <div className="flex justify-between">
              <span className="text-gray-500">Last Active:</span>
              <span>{formatDate(agent.lastActive)}</span>
            </div>
          )}
          {agent.config && agent.config.maxGasPrice && (
            <div className="flex justify-between">
              <span className="text-gray-500">Max Gas:</span>
              <span>{agent.config.maxGasPrice} Gwei</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          <Switch 
            checked={agent.status === 'active'} 
            onCheckedChange={handleStatusToggle}
            disabled={!onToggleStatus}
          />
          <span className="text-sm">
            {agent.status === 'active' ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(agent.id)}
              className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(agent.id)}
              className="text-sm px-3 py-1 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
