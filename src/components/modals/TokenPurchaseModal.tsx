'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'react-hot-toast';

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName?: string;
  tokenCost?: number;
  availableTokens?: number;
}

export function TokenPurchaseModal({
  isOpen,
  onClose,
  toolName,
  tokenCost = 0,
  availableTokens = 0,
}: TokenPurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const purchaseTokens = useMutation(api.tokens.purchase);

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      await purchaseTokens({ amount: quantity * 10 }); // 10 tokens per purchase
      toast.success(`Successfully purchased ${quantity * 10} tokens!`);
      onClose();
    } catch (error) {
      console.error('Failed to purchase tokens:', error);
      toast.error('Failed to purchase tokens');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-[#111111] p-6 text-left align-middle shadow-xl transition-all border border-white/10">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4"
                >
                  {toolName ? `Purchase Tokens for ${toolName}` : 'Purchase Tokens'}
                </Dialog.Title>

                {toolName && tokenCost && (
                  <div className="mb-4">
                    <p className="text-gray-400">
                      This tool requires {tokenCost} tokens to use.
                      You currently have {availableTokens} tokens.
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Quantity (10 tokens per purchase)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 bg-[#222222] rounded border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="mt-4">
                  <p className="text-gray-400 mb-2">
                    Total Cost: ${quantity * 0.99}
                  </p>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePurchase}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Purchase'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
