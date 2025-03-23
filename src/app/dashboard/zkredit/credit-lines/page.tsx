'use client';

import { useState } from 'react';
import { useUser } from '@/lib/providers/user-provider';
import { CreditLine } from '@/lib/types';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import CreditLineCard from '@/components/zkredit/credit-line-card';
import CreditLineForm from '@/components/zkredit/credit-line-form';

export default function CreditLinesPage() {
  const { creditLines, refreshUserData, isLoading } = useUser();
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCreditLine, setSelectedCreditLine] = useState<CreditLine | undefined>(undefined);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [creditLineToClose, setCreditLineToClose] = useState<string | null>(null);

  // Handle credit line creation/update
  const handleSaveCreditLine = (creditLine: CreditLine) => {
    // In a real app, this would be an API call to save the credit line
    console.log('Saving credit line:', creditLine);
    
    // Refresh user data (in a real app, this would fetch updated data from the backend)
    refreshUserData();
    
    // Close the modal and reset the selected credit line
    setIsFormModalOpen(false);
    setSelectedCreditLine(undefined);
  };

  // Handle opening the edit modal
  const handleEditCreditLine = (creditLineId: string) => {
    const creditLine = creditLines.find(cl => cl.id === creditLineId);
    if (creditLine) {
      setSelectedCreditLine(creditLine);
      setIsFormModalOpen(true);
    }
  };

  // Handle opening the close confirmation modal
  const handleCloseClick = (creditLineId: string) => {
    setCreditLineToClose(creditLineId);
    setIsCloseModalOpen(true);
  };

  // Handle confirming credit line closure
  const handleConfirmClose = () => {
    if (creditLineToClose) {
      // In a real app, this would be an API call to close the credit line
      console.log('Closing credit line:', creditLineToClose);
      
      // Refresh user data
      refreshUserData();
      
      // Close the modal and reset the credit line to close
      setIsCloseModalOpen(false);
      setCreditLineToClose(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Credit Lines</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your ZKredit credit lines backed by locked assets
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={() => {
              setSelectedCreditLine(undefined);
              setIsFormModalOpen(true);
            }}
            className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            Create Credit Line
          </button>
        </div>
      </div>

      {/* Credit Line Overview */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Credit Overview</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Total Credit Limit</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                ${creditLines.reduce((sum, cl) => sum + cl.limit, 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Total Used</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                ${creditLines.reduce((sum, cl) => sum + cl.used, 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <dt className="truncate text-sm font-medium text-gray-500">Available Credit</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                ${creditLines.reduce((sum, cl) => sum + (cl.limit - cl.used), 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </dd>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Line Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {creditLines.length > 0 ? (
          creditLines.map((creditLine) => (
            <CreditLineCard
              key={creditLine.id}
              creditLine={creditLine}
              onEdit={handleEditCreditLine}
              onClose={handleCloseClick}
            />
          ))
        ) : (
          <div className="lg:col-span-2 text-center py-12 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No credit lines</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new credit line backed by your locked assets.</p>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedCreditLine(undefined);
                  setIsFormModalOpen(true);
                }}
                className="inline-flex items-center rounded-md bg-teal-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
              >
                Create Credit Line
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Credit Line Form Modal */}
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        {selectedCreditLine ? 'Edit Credit Line' : 'Create New Credit Line'}
                      </Dialog.Title>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <CreditLineForm
                      creditLine={selectedCreditLine}
                      onSave={handleSaveCreditLine}
                      onCancel={() => {
                        setIsFormModalOpen(false);
                        setSelectedCreditLine(undefined);
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Close Confirmation Modal */}
      <Transition.Root show={isCloseModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setIsCloseModalOpen}>
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
                        Close Credit Line
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to close this credit line? Any outstanding balance must be paid before closing.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      onClick={handleConfirmClose}
                    >
                      Close Credit Line
                    </button>
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => {
                        setIsCloseModalOpen(false);
                        setCreditLineToClose(null);
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
