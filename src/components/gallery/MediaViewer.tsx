'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Image from 'next/image';
import { XMarkIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface MediaViewerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMedia: {
    id: string;
    url: string;
    type: 'image' | 'video';
    title?: string;
    description?: string;
  };
  allMedia: Array<{
    id: string;
    url: string;
    type: 'image' | 'video';
    title?: string;
    description?: string;
  }>;
}

export function MediaViewer({ isOpen, onClose, currentMedia, allMedia }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(
    allMedia.findIndex((m) => m.id === currentMedia.id)
  );

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allMedia.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < allMedia.length - 1 ? prev + 1 : 0));
  };

  const current = allMedia[currentIndex];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/90" />
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
              <Dialog.Panel className="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all">
                <div className="absolute right-4 top-4 z-10">
                  <button
                    onClick={onClose}
                    className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="relative aspect-video w-full">
                  {current.type === 'image' ? (
                    <Image
                      src={current.url}
                      alt={current.title || ''}
                      fill
                      className="object-contain"
                      quality={100}
                      sizes="(max-width: 1280px) 100vw, 1280px"
                    />
                  ) : (
                    <iframe
                      src={current.url}
                      className="absolute inset-0 h-full w-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>

                <div className="absolute inset-y-0 left-4 flex items-center">
                  <button
                    onClick={handlePrevious}
                    className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="absolute inset-y-0 right-4 flex items-center">
                  <button
                    onClick={handleNext}
                    className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ArrowRightIcon className="h-6 w-6" />
                  </button>
                </div>

                {(current.title || current.description) && (
                  <div className="mt-4 text-white">
                    {current.title && (
                      <Dialog.Title as="h3" className="text-lg font-medium">
                        {current.title}
                      </Dialog.Title>
                    )}
                    {current.description && (
                      <Dialog.Description className="mt-2 text-sm text-gray-300">
                        {current.description}
                      </Dialog.Description>
                    )}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
