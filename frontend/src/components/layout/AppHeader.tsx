'use client';

import React, { useState } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import { StreakDisplay } from './StreakDisplay';
import { XPDisplay } from './XPDisplay';
import { HeartsDisplay } from './HeartsDisplay';
import { GemsDisplay } from './GemsDisplay';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { userApi } from '@/lib/api/user/api';
import { ES } from 'country-flag-icons/react/3x2';

export const AppHeader: React.FC = () => {
  const { user } = useAuthStore();
  const [isHeartModalOpen, setIsHeartModalOpen] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [refillError, setRefillError] = useState<string | null>(null);

  const hearts = user?.hearts ?? 5;
  const gems = user?.gems ?? 500;
  const streak = user?.streak ?? 0;

  const handleRefillHearts = async () => {
    if (gems < 100) {
      setRefillError('You need at least 100 gems to refill hearts.');
      return;
    }
    setIsRefilling(true);
    setRefillError(null);
    try {
      await userApi.refillHearts();
      setIsHeartModalOpen(false);
    } catch (err: any) {
      setRefillError(err?.message || 'Failed to refill hearts.');
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-end px-4 sm:px-8 py-3 bg-[#131f24] border-b-2 border-[#2b3840] text-white">
        {/* User Stats Counters */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2 cursor-pointer p-1.5 rounded-xl hover:bg-[#202f36] transition border border-transparent">
            <ES className="w-6 h-4 rounded-xs shadow-xs object-cover" />
          </div>

          <StreakDisplay streak={streak} />
          <GemsDisplay gems={gems} />
          <div onClick={() => setIsHeartModalOpen(true)} className="cursor-pointer">
            <HeartsDisplay hearts={hearts} />
          </div>
        </div>
      </header>

      {/* Refill Hearts Modal */}
      <Modal
        isOpen={isHeartModalOpen}
        onClose={() => {
          setIsHeartModalOpen(false);
          setRefillError(null);
        }}
        title="Need More Hearts?"
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 bg-red-100 rounded-3xl flex items-center justify-center text-[#ff4b4b] shadow-inner">
            <svg className="w-10 h-10 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <p className="text-sm font-bold text-[#777777] leading-relaxed">
            You currently have <span className="text-[#ff4b4b] font-extrabold">{hearts} hearts</span>. Refill to full hearts for <span className="text-[#1cb0f6] font-extrabold">100 gems</span>!
          </p>

          {refillError && (
            <div className="w-full p-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-200">
              {refillError}
            </div>
          )}

          <div className="flex flex-col gap-2.5 w-full pt-2">
            <Button
              variant="primary"
              fullWidth
              disabled={hearts >= 5 || isRefilling}
              onClick={handleRefillHearts}
            >
              {isRefilling ? 'REFILLING...' : hearts >= 5 ? 'HEARTS FULL' : 'REFILL HEARTS (100 GEMS)'}
            </Button>

            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                setIsHeartModalOpen(false);
                setRefillError(null);
              }}
            >
              NO THANKS
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
