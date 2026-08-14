'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth/api';
import { useAuthStore } from '@/store/use-auth-store';
import { Button } from '@/components/ui/Button';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, initializeAuth } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/learn');
    }
  }, [isAuthenticated, router]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current));
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await authApi.login({
        identifier: identifier.trim(),
        password,
      });
      router.push('/learn');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid email/username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#131f24] text-white flex flex-col justify-between p-4 sm:p-6 relative font-sans select-none">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#202f36] border-2 border-[#1cb0f6] text-[#1cb0f6] px-6 py-3 rounded-2xl font-extrabold text-xs tracking-widest uppercase shadow-2xl animate-bounce">
          ✨ {toastMsg}
        </div>
      )}

      {/* Top Header Bar */}
      <header className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link
          href="/login"
          className="p-2 text-[#52656d] hover:text-white active:scale-95 transition-all rounded-xl flex items-center justify-center cursor-pointer select-none"
          title="Duolingo"
        >
          <Image
            src="/duolingo_logo.svg"
            alt="duolingo"
            width={140}
            height={32}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>

        <Link
          href="/register"
          className="px-4 py-2 bg-[#131f24] hover:bg-[#202f36] border-2 border-[#2b3840] text-[#4b5563] hover:text-white font-extrabold text-[12px] uppercase tracking-widest rounded-2xl shadow-[0_3px_0_0_#2b3840] active:shadow-none active:translate-y-[3px] transition-all cursor-pointer select-none"
        >
          SIGN UP
        </Link>
      </header>

      {/* Main Form Container */}
      <main className="w-full max-w-[375px] mx-auto my-auto flex flex-col items-center px-2 py-6">
        <div className="w-24 h-24 relative mb-4">
          <Image
            src="/duo/3aeb9f981f17977278cf.svg"
            alt="Duo Waving"
            width={96}
            height={96}
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-[26px] font-extrabold text-white text-center mb-6 tracking-wide">
          Log in
        </h1>

        {errorMsg && (
          <div className="w-full mb-5 p-3.5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 font-bold text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
          <input
            type="text"
            required
            placeholder="Email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full h-12 px-4 bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl font-bold text-white placeholder-[#778e9a] outline-none text-[15px] transition-colors"
          />

          <div className="relative w-full">
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 pl-4 pr-24 bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl font-bold text-white placeholder-[#778e9a] outline-none text-[15px] transition-colors"
            />
            <button
              type="button"
              onClick={() => triggerToast('Forgot password coming soon')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-extrabold text-[#52656d] hover:text-[#849aa5] active:opacity-70 uppercase tracking-widest transition-opacity cursor-pointer select-none"
            >
              FORGOT?
            </button>
          </div>

          <Button
            type="submit"
            variant="secondary"
            fullWidth
            disabled={isLoading || !identifier.trim() || !password}
          >
            {isLoading ? 'LOGGING IN...' : 'LOG IN'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5 w-full">
          <div className="flex-1 border-t-2 border-[#2b3840]"></div>
          <span className="px-3 text-[11px] font-extrabold text-[#4b5860] uppercase tracking-widest">
            OR
          </span>
          <div className="flex-1 border-t-2 border-[#2b3840]"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            onClick={() => triggerToast('Google login coming soon')}
            className="flex items-center justify-center gap-2 h-11 px-3 bg-transparent hover:bg-[#202f36] border-2 border-[#37464f] rounded-2xl shadow-[0_3px_0_0_#2b3840] active:shadow-none active:translate-y-[3px] transition-all cursor-pointer select-none"
          >
            <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-[#4285f4] font-extrabold text-[12px] tracking-wider uppercase">
              GOOGLE
            </span>
          </button>

          <button
            type="button"
            onClick={() => triggerToast('Facebook login coming soon')}
            className="flex items-center justify-center gap-2 h-11 px-3 bg-transparent hover:bg-[#202f36] border-2 border-[#37464f] rounded-2xl shadow-[0_3px_0_0_#2b3840] active:shadow-none active:translate-y-[3px] transition-all cursor-pointer select-none"
          >
            <svg className="w-[18px] h-[18px] fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-[#1877f2] font-extrabold text-[12px] tracking-wider uppercase">
              FACEBOOK
            </span>
          </button>
        </div>
      </main>

      <footer className="py-2"></footer>
    </div>
  );
};
