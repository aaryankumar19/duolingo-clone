'use client';

import React, { useState } from 'react';
import { Heart, Gem } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { userApi } from '@/lib/api/user/api';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface Props {
  hearts: number;
}

export const HeartsDisplay: React.FC<Props> = ({ hearts }) => {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefilling, setIsRefilling] = useState(false);
  const [refillError, setRefillError] = useState<string | null>(null);
  const [isUnlimitedModalOpen, setIsUnlimitedModalOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const gems = user?.gems ?? 500;
  const maxHearts = 5;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleRefillHearts = async () => {
    if (hearts >= maxHearts) return;
    if (gems < 100) {
      setRefillError('You need at least 100 gems to refill hearts.');
      return;
    }
    setIsRefilling(true);
    setRefillError(null);
    try {
      await userApi.refillHearts();
    } catch (err: any) {
      setRefillError(err?.message || 'Failed to refill hearts.');
    } finally {
      setIsRefilling(false);
    }
  };

  return (
    <>
      <div
        className="relative inline-block text-left"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Hearts Button Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className={`flex items-center gap-2 font-extrabold text-base sm:text-lg text-[#FF4B4B] px-3 py-1.5 rounded-xl transition border cursor-pointer select-none ${
            isOpen
              ? 'bg-[#202f36] border-[#2b3840] shadow-md'
              : 'border-transparent hover:bg-[#202f36]/60'
          }`}
        >
          <Heart className="w-6 h-6 fill-[#FF4B4B] text-[#FF4B4B]" />
          <span>{hearts}</span>
        </button>

        {/* Popover Card UI */}
        {isOpen && (
          <div className="absolute top-full right-0 mt-1.5 w-[320px] sm:w-[350px] bg-[#131f24] border-2 border-[#2b3840] rounded-3xl p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4 text-left before:absolute before:-top-3 before:left-0 before:right-0 before:h-4">
            {/* Top Pointer Arrow Right Aligned */}
            <div className="absolute -top-1.5 right-6 w-3 h-3 bg-[#131f24] border-t border-l border-[#2b3840] rotate-45 z-20" />



            {/* TOP SECTION: Header & Hearts Row */}
            <div>
              <h3 className="font-black text-2xl text-white tracking-tight leading-tight text-center mb-3">
                Hearts
              </h3>

              {/* 5 Hearts Row */}
              <div className="flex justify-center items-center gap-2 mb-3">
                {Array.from({ length: maxHearts }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-7 h-7 transition-all ${
                      i < hearts
                        ? 'fill-[#ff4b4b] text-[#ff4b4b] drop-shadow-md scale-100'
                        : 'fill-[#202f36] text-[#37464f] opacity-60 scale-90'
                    }`}
                  />
                ))}
              </div>

              {/* Status Subtitle */}
              <h4 className="font-extrabold text-base sm:text-lg text-white text-center">
                {hearts >= maxHearts ? 'You have full hearts' : `You have ${hearts} ${hearts === 1 ? 'heart' : 'hearts'}`}
              </h4>
              <p className="text-[#8496a0] font-bold text-xs text-center mt-0.5">
                {hearts >= maxHearts ? 'Keep on learning' : 'Refill hearts or practice to earn more!'}
              </p>

              {refillError && (
                <div className="mt-2.5 p-2.5 bg-red-900/30 text-red-400 rounded-xl text-xs font-bold border border-red-800/50 text-center">
                  {refillError}
                </div>
              )}
            </div>

            {/* ACTION CARDS LIST */}
            <div className="space-y-2.5">
              {/* CARD 1: UNLIMITED HEARTS */}
              <button
                type="button"
                onClick={() => setIsUnlimitedModalOpen(true)}
                className="w-full bg-[#18262d] hover:bg-[#202f36] border-2 border-[#2b3840] p-3.5 rounded-2xl flex items-center justify-between transition cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  {/* Infinity Rainbow Heart Icon */}
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ce82ff] via-[#ec4899] to-[#ff9600] flex items-center justify-center shadow-sm shrink-0">
                    <svg className="w-5 h-5 text-white fill-white" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </div>
                  <span className="font-black text-xs sm:text-sm text-white tracking-wider uppercase">
                    UNLIMITED HEARTS
                  </span>
                </div>

                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ce82ff] to-[#ec4899] font-black text-xs tracking-wider uppercase shrink-0">
                  FREE TRIAL
                </span>
              </button>

              {/* CARD 2: REFILL HEARTS */}
              <button
                type="button"
                disabled={hearts >= maxHearts || isRefilling}
                onClick={handleRefillHearts}
                className="w-full bg-[#18262d] hover:bg-[#202f36] border-2 border-[#2b3840] p-3.5 rounded-2xl flex items-center justify-between transition cursor-pointer group disabled:opacity-50 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#202f36] border border-[#2b3840] flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-black text-xs sm:text-sm text-white tracking-wider uppercase">
                    {isRefilling ? 'REFILLING...' : 'REFILL HEARTS'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-white font-black text-xs shrink-0">
                  <Gem className="w-4 h-4 text-[#8496a0] fill-[#52656d]" />
                  <span>350</span>
                </div>
              </button>

              {/* CARD 3: PRACTICE TO EARN HEARTS */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push('/learn');
                }}
                className="w-full bg-[#18262d] hover:bg-[#202f36] border-2 border-[#2b3840] p-3.5 rounded-2xl flex items-center justify-between transition cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#202f36] border border-[#2b3840] flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 fill-white text-white" />
                  </div>
                  <span className="font-black text-xs sm:text-sm text-white tracking-wider uppercase">
                    PRACTICE TO EARN HEARTS
                  </span>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Super Duolingo Unlimited Hearts Trial Modal */}
      <Modal
        isOpen={isUnlimitedModalOpen}
        onClose={() => setIsUnlimitedModalOpen(false)}
        title="Super Duolingo"
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-20 h-20 bg-gradient-to-tr from-[#ce82ff] via-[#ec4899] to-[#ff9600] rounded-3xl flex items-center justify-center text-white shadow-lg">
            <svg className="w-12 h-12 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h3 className="text-xl font-black text-white">Never Run Out of Hearts!</h3>

          <p className="text-sm font-bold text-[#8496a0] leading-relaxed max-w-sm">
            Upgrade to Super Duolingo for unlimited hearts, zero ads, and personalized practice sessions.
          </p>

          <div className="flex flex-col gap-2.5 w-full pt-2">
            <Button
              variant="primary"
              fullWidth
              onClick={() => {
                setIsUnlimitedModalOpen(false);
                router.push('/shop');
              }}
            >
              START 2-WEEK FREE TRIAL
            </Button>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setIsUnlimitedModalOpen(false)}
            >
              NO THANKS
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

