'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  PlusCircle, 
  Settings, 
  RefreshCw, 
  Power, 
  Trash2,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  BarChart
} from 'lucide-react';

// Mock agent templates
const AGENT_TEMPLATES = [
  { 
    id: 'defi-trader', 
    name: 'DeFi Trader', 
    description: 'Automated trading across DEXs based on market conditions',
    icon: 'chart',
    requiredProofs: ['balance'],
    chains: ['Ethereum', 'Base', 'Arbitrum']
  },
  { 
    id: 'yield-optimizer', 
    name: 'Yield Optimizer', 
    description: 'Automatically moves funds to highest yield opportunities',
    icon: 'money',
    requiredProofs: ['ownership', 'balance'],
    chains: ['Ethereum', 'Polygon', 'Optimism']
  },
  { 
    id: 'nft-trader', 
    name: 'NFT Trader', 
    description: 'Monitors and trades NFTs based on floor price changes',
    icon: 'image',
    requiredProofs: ['ownership'],
    chains: ['Ethereum', 'Base']
  },
  { 
    id: 'payment-processor', 
    name: 'Payment Processor', 
    description: 'Handles recurring payments and subscriptions',
    icon: 'credit-card',
    requiredProofs: ['balance'],
    chains: ['Ethereum', 'Polygon', 'Base']
  },
];

export default function AgentsPage() {
  const { agentConfigs, zkProofs, isLoading } = useUser();
  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [newAgentName, setNewAgentName] = useState('');
  const [selectedProof, setSelectedProof] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter active and inactive agents
  const activeAgents = agentConfigs.filter(agent => agent.status === 'active');
  const inactiveAgents = agentConfigs.filter(agent => agent.status !== 'active');
  
  // Filter active proofs
  const validProofs = zkProofs.filter(proof => proof.status === 'valid');

  // Mock function to create a new agent
  const handleCreateAgent = async () => {
    setIsCreatingAgent(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real app, this would call an API to create the agent
    // and then refresh the agent list
    
    setIsCreatingAgent(false);
    setIsDialogOpen(false);
    setNewAgentName('');
    setSelectedTemplate('');
    setSelectedProof('');
    
    // Redirect to the dashboard in a real app
    // router.push('/dashboard');
  };

  // Mock function to toggle agent status
  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    // In a real app, this would call an API to update the agent status
    console.log(`Toggling agent ${agentId} from ${currentStatus} to ${currentStatus === 'active' ? 'inactive' : 'active'}`);
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
          <h1 className="text-2xl font-bold text-gray-900">AI Agents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure AI agents to operate with your zero-knowledge proofs
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create a New AI Agent</DialogTitle>
                <DialogDescription>
                  Configure an AI agent to operate on your behalf using zero-knowledge proofs
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agent-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="agent-name"
                    placeholder="My Trading Agent"
                    className="col-span-3"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agent-template" className="text-right">
                    Template
                  </Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {AGENT_TEMPLATES.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedTemplate && (
                  <div className="rounded-md bg-blue-50 p-4 mt-2">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Zap className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          {AGENT_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                        </h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            {AGENT_TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                          </p>
                          <div className="mt-2">
                            <span className="font-medium">Supported Chains: </span>
                            {AGENT_TEMPLATES.find(t => t.id === selectedTemplate)?.chains.join(', ')}
                          </div>
                          <div className="mt-1">
                            <span className="font-medium">Required Proofs: </span>
                            {AGENT_TEMPLATES.find(t => t.id === selectedTemplate)?.requiredProofs.join(', ')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="agent-proof" className="text-right">
                    ZK Proof
                  </Label>
                  <Select
                    value={selectedProof}
                    onValueChange={setSelectedProof}
                    disabled={validProofs.length === 0}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder={validProofs.length === 0 ? "No valid proofs available" : "Select a proof"} />
                    </SelectTrigger>
                    <SelectContent>
                      {validProofs.map((proof) => (
                        <SelectItem key={proof.id} value={proof.id}>
                          {proof.proofType} - {proof.assetTicker || 'Asset'} Proof
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {validProofs.length === 0 && (
                  <div className="rounded-md bg-yellow-50 p-4 mt-2">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">No Valid Proofs</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            You need to generate at least one valid zero-knowledge proof before creating an agent.
                          </p>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-yellow-800 font-medium"
                            onClick={() => {
                              // Navigate to proofs page in a real app
                              window.location.href = '/dashboard/proofs';
                            }}
                          >
                            Generate a proof <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="auto-start" className="text-right">
                    Auto-start
                  </Label>
                  <div className="flex items-center space-x-2 col-span-3">
                    <Switch id="auto-start" />
                    <Label htmlFor="auto-start">Start agent immediately after creation</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateAgent}
                  disabled={!newAgentName || !selectedTemplate || !selectedProof || isCreatingAgent}
                >
                  {isCreatingAgent ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Agent'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Active Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Active Agents</CardTitle>
          <CardDescription>
            AI agents currently running on your behalf
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeAgents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Shield className="mr-1 h-3 w-3" />
                        {agent.proofId.substring(0, 8)}...
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAgentStatus(agent.id, agent.status)}
                        >
                          <Power className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <Cpu className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No active agents</h3>
              <p className="mt-1 text-sm text-gray-500">Create an agent to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inactive Agents */}
      {inactiveAgents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Inactive Agents</CardTitle>
            <CardDescription>
              AI agents that are currently paused
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inactiveAgents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Shield className="mr-1 h-3 w-3" />
                        {agent.proofId.substring(0, 8)}...
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gray-100 text-gray-800">
                        Inactive
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(agent.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toggleAgentStatus(agent.id, agent.status)}
                        >
                          <Power className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Agent Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Available Agent Templates</CardTitle>
          <CardDescription>
            Pre-configured AI agents that you can deploy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AGENT_TEMPLATES.map((template) => (
              <div 
                key={template.id} 
                className="flex flex-col p-6 border rounded-lg hover:border-blue-500 transition-colors"
              >
                <div className="h-12 w-12 mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  {template.icon === 'chart' && <BarChart className="h-6 w-6 text-blue-600" />}
                  {template.icon === 'money' && <Zap className="h-6 w-6 text-blue-600" />}
                  {template.icon === 'image' && <Globe className="h-6 w-6 text-blue-600" />}
                  {template.icon === 'credit-card' && <Cpu className="h-6 w-6 text-blue-600" />}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                <p className="mt-1 text-sm text-gray-500 flex-grow">
                  {template.description}
                </p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setIsDialogOpen(true);
                  }}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
