'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { AgentConfig } from '@/lib/types';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import AgentCard from '@/components/zkredit/agent-card';
import AgentForm from '@/components/zkredit/agent-form';

export default function AgentManagementPage() {
  const { agentConfigs, refreshUserData, isLoading } = useUser();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState<string | null>(null);

  // Handle agent creation/update
  const handleSaveAgent = (agent: AgentConfig) => {
    // In a real app, this would be an API call to save the agent
    console.log('Saving agent:', agent);
    
    // Refresh user data (in a real app, this would fetch updated data from the backend)
    refreshUserData();
    
    // Close the modal and reset the selected agent
    setIsFormModalOpen(false);
    setSelectedAgent(undefined);
  };

  // Handle opening the edit modal
  const handleEditAgent = (agentId: string) => {
    const agent = agentConfigs.find((a: AgentConfig) => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      setIsFormModalOpen(true);
    }
  };

  // Handle opening the delete confirmation modal
  const handleDeleteClick = (agentId: string) => {
    setAgentToDelete(agentId);
    setIsDeleteModalOpen(true);
  };

  // Handle confirming agent deletion
  const handleConfirmDelete = () => {
    if (agentToDelete) {
      // In a real app, this would be an API call to delete the agent
      console.log('Deleting agent:', agentToDelete);
      
      // Refresh user data
      refreshUserData();
      
      // Close the modal and reset the agent to delete
      setIsDeleteModalOpen(false);
      setAgentToDelete(null);
    }
  };

  // Handle toggling agent status
  const handleToggleStatus = (agentId: string, newStatus: 'active' | 'paused') => {
    // In a real app, this would be an API call to update the agent status
    console.log('Toggling agent status:', agentId, newStatus);
    
    // Refresh user data
    refreshUserData();
  };

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
          <h1 className="text-2xl font-bold text-gray-900">AI Agent Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure and manage AI agents for automated operations
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => {
              setSelectedAgent(undefined);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Create New Agent
          </button>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 gap-6">
        {agentConfigs.length > 0 ? (
          agentConfigs.map((agent: AgentConfig) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onEdit={handleEditAgent}
              onDelete={handleDeleteClick}
              onToggleStatus={handleToggleStatus}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No agents configured</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new AI agent.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedAgent(undefined);
                  setIsFormModalOpen(true);
                }}
                className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Create New Agent
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Agent Form Modal */}
      <Transition.Root show={isFormModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsFormModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-teal-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {selectedAgent ? 'Edit Agent' : 'Create New Agent'}
                      </Dialog.Title>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <AgentForm
                      agent={selectedAgent}
                      onSave={handleSaveAgent}
                      onCancel={() => {
                        setIsFormModalOpen(false);
                        setSelectedAgent(undefined);
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Delete Confirmation Modal */}
      <Transition.Root show={isDeleteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsDeleteModalOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-red-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Delete Agent
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete this agent? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleConfirmDelete}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setIsDeleteModalOpen(false);
                        setAgentToDelete(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
