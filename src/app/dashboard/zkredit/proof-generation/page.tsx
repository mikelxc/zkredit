'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ProofGenerationForm from '@/components/zkredit/proof-generation-form';
import { SUPPORTED_CHAINS } from '@/lib/types/index';

export default function ProofGenerationPage() {
  const { zkProofs, refreshUserData, isLoading } = useUser();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedProofId, setGeneratedProofId] = useState<string | null>(null);

  // Handle successful proof generation
  const handleProofGenerated = (proofId: string) => {
    setGeneratedProofId(proofId);
    setIsFormModalOpen(false);
    setIsSuccessModalOpen(true);
    refreshUserData();
  };

  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get chain name from chain ID
  const getChainName = (chainId: string) => {
    const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
    return chain ? chain.name : chainId;
  };

  // Get proof type display name
  const getProofTypeDisplay = (type: string) => {
    switch (type) {
      case 'ownership':
        return 'Asset Ownership';
      case 'balance':
        return 'Balance Threshold';
      case 'credit':
        return 'Credit Worthiness';
      default:
        return type;
    }
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
          <h1 className="text-2xl font-bold text-gray-900">ZK Proof Generation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Generate zero-knowledge proofs for your assets and credit
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => setIsFormModalOpen(true)}
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Generate New Proof
          </button>
        </div>
      </div>

      {/* ZK Proof Explainer */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">About Zero-Knowledge Proofs</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Zero-knowledge proofs allow you to prove facts about your assets without revealing sensitive information.
              These proofs can be used across different blockchains to verify your financial status while maintaining privacy.
            </p>
          </div>
          <div className="mt-5">
            <div className="rounded-md bg-gray-50 px-6 py-5">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Asset Ownership</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Prove that you own specific assets without revealing your identity or exact holdings.
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Balance Threshold</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Prove that you have at least a certain balance without revealing the exact amount.
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">Credit Worthiness</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    Prove that you have sufficient credit worthiness based on your assets and history.
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generated Proofs Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Your Generated Proofs</h3>
          
          {zkProofs.length > 0 ? (
            <div className="mt-4 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead>
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Proof ID</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Asset</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Target Chain</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {zkProofs.map((proof) => (
                        <tr key={proof.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                            {proof.id.substring(0, 8)}...
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              proof.proofType === 'ownership' ? 'bg-purple-100 text-purple-800' :
                              proof.proofType === 'balance' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {getProofTypeDisplay(proof.proofType)}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {proof.assetTicker}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {getChainName(proof.targetChain)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(proof.createdAt)}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                            <button
                              className="text-teal-600 hover:text-teal-900"
                              onClick={() => {
                                // In a real app, this would copy the proof to the clipboard
                                // or download it as a file
                                console.log('Exporting proof:', proof.id);
                                alert(`Proof ${proof.id.substring(0, 8)}... exported!`);
                              }}
                            >
                              Export<span className="sr-only">, {proof.id}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
              </svg>
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No proofs generated</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by generating a new zero-knowledge proof.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(true)}
                  className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  Generate New Proof
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Proof Generation Modal */}
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-teal-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Generate Zero-Knowledge Proof
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Select an asset and proof type to generate a zero-knowledge proof.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <ProofGenerationForm
                      onProofGenerated={handleProofGenerated}
                      onCancel={() => setIsFormModalOpen(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Success Modal */}
      <Transition.Root show={isSuccessModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsSuccessModalOpen}>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Proof Generated Successfully
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Your zero-knowledge proof has been generated and is ready to use. You can export it or view it in your list of proofs.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                      onClick={() => setIsSuccessModalOpen(false)}
                    >
                      Got it
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
