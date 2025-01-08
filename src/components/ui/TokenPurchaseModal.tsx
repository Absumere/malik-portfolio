'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const packages = [
  { id: 1, name: 'Starter Pack', tokens: 100, price: 10 },
  { id: 2, name: 'Pro Pack', tokens: 500, price: 45 },
  { id: 3, name: 'Enterprise Pack', tokens: 1000, price: 80 },
];

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TokenPurchaseModal({ isOpen, onClose }: TokenPurchaseModalProps) {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const createPaymentIntent = useMutation(api.tokens.createPaymentIntent);

  const handlePackageSelect = async (pkg: typeof packages[0]) => {
    if (!user) {
      toast.error('Please sign in to purchase tokens');
      return;
    }

    setSelectedPackage(pkg);
    setIsProcessing(true);

    try {
      const secret = await createPaymentIntent({
        amount: pkg.price * 100, // Convert to cents
        userId: user._id,
        packageId: pkg.id,
      });

      setClientSecret(secret);
    } catch (error) {
      toast.error('Failed to initialize payment');
      console.error('Payment initialization error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast.success('Payment successful! Tokens added to your account.');
    onClose();
  };

  const handlePaymentError = (error: Error) => {
    toast.error('Payment failed. Please try again.');
    console.error('Payment error:', error);
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
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black p-6 border border-white/10 backdrop-blur-xl shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white mb-4"
                >
                  Purchase Tokens
                </Dialog.Title>

                {!clientSecret ? (
                  <div className="space-y-4">
                    {packages.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => handlePackageSelect(pkg)}
                        disabled={isProcessing}
                        className={`w-full p-4 rounded-lg border ${
                          selectedPackage.id === pkg.id
                            ? 'border-white/20 bg-white/10'
                            : 'border-white/5 hover:border-white/20 hover:bg-white/5'
                        } transition-colors`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-white font-medium">{pkg.name}</h4>
                            <p className="text-sm text-gray-400">
                              {pkg.tokens} tokens
                            </p>
                          </div>
                          <p className="text-lg font-medium text-white">
                            ${pkg.price}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentElement />
                  </Elements>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
