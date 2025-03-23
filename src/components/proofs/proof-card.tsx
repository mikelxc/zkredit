'use client';

import { formatDistanceToNow } from 'date-fns';
import { ZkProof } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProofCardProps {
  proof: ZkProof;
  onVerify?: (proofId: string) => void;
  onShare?: (proofId: string) => void;
}

export function ProofCard({ proof, onVerify, onShare }: ProofCardProps) {
  // Format status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'invalid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Format proof type for display
  const formatProofType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Format dates for display
  const formatDate = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            {proof.publicInputs.assetType} {formatProofType(proof.type)} Proof
          </CardTitle>
          <Badge className={getStatusColor(proof.status)}>
            {proof.status.toUpperCase()}
          </Badge>
        </div>
        <CardDescription>
          Created {formatDate(proof.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Proof ID:</span>
            <span className="font-mono text-xs truncate max-w-[180px]">{proof.id}</span>
          </div>
          {proof.type === 'balance' && proof.publicInputs.thresholdMet !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Threshold Met:</span>
              <span>{proof.publicInputs.thresholdMet ? 'Yes' : 'No'}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">Expires:</span>
            <span>{formatDate(proof.expiresAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Verifications:</span>
            <span>{proof.verificationCount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        {onVerify && (
          <button
            onClick={() => onVerify(proof.id)}
            className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
          >
            Verify
          </button>
        )}
        {onShare && (
          <button
            onClick={() => onShare(proof.id)}
            className="text-sm px-3 py-1 bg-gray-50 text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
          >
            Share
          </button>
        )}
      </CardFooter>
    </Card>
  );
}
