'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { loadStripe } from '@stripe/stripe-js/pure';
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
  const { user } = useUser();
  const [selectedPackage, setSelectedPackage] = useState(packages[0]);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const purchase = useMutation(api.tokens.purchase);

  const handlePackageSelect = async (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg);
    setClientSecret(null);

    if (!user) {
      toast.error('Please sign in to purchase tokens');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: pkg.price,
          tokens: pkg.tokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      if (!data.clientSecret) {
        throw new Error('No client secret received');
      }

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Failed to create payment intent:', error);
      toast.error((error as Error).message || 'Failed to initialize payment');
    } finally {
      setIsLoading(false);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-[#141414] p-6 text-left align-middle shadow-xl transition-all border border-white/10">
                <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-white mb-8">
                  Purchase Tokens
                </Dialog.Title>

                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-4 rounded border cursor-pointer transition ${
                        selectedPackage.id === pkg.id
                          ? 'border-white bg-white/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                      onClick={() => handlePackageSelect(pkg)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-medium text-white">{pkg.name}</h4>
                          <p className="text-sm text-gray-400">{pkg.tokens} tokens</p>
                        </div>
                        <div className="text-xl font-medium text-white">${pkg.price}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {clientSecret && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: {
                        theme: 'night',
                        variables: {
                          colorPrimary: '#ffffff',
                          colorBackground: '#1a1a1a',
                          colorText: '#ffffff',
                          fontFamily: 'system-ui, sans-serif',
                        },
                      },
                    }}
                  >
                    <PaymentElement options={{ layout: 'tabs' }} />
                    <div className="mt-8 flex justify-end gap-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm text-white/70 hover:text-white transition"
                        onClick={onClose}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!stripePromise || isProcessing}
                        className="px-4 py-2 text-sm bg-white text-black rounded hover:bg-white/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={async () => {
                          if (!stripePromise) {
                            toast.error('Stripe not initialized');
                            return;
                          }

                          setIsProcessing(true);
                          try {
                            const stripe = await stripePromise;
                            const { error, paymentIntent } = await stripe.confirmPayment({
                              elements: null,
                              confirmParams: {
                                return_url: `${window.location.origin}/payment-success`,
                              },
                              redirect: 'if_required',
                            });

                            if (error) {
                              toast.error(error.message || 'Payment failed');
                              throw error;
                            }

                            if (paymentIntent.status === 'succeeded') {
                              await purchase({
                                userId: user!.id,
                                amount: selectedPackage.tokens,
                                paymentIntentId: paymentIntent.id,
                              });
                              toast.success('Payment successful!');
                              onClose();
                            }
                          } catch (error) {
                            console.error('Payment failed:', error);
                          } finally {
                            setIsProcessing(false);
                          }
                        }}
                      >
                        {isProcessing ? 'Processing...' : `Pay $${selectedPackage.price}`}
                      </button>
                    </div>
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
