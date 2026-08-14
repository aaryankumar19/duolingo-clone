'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api/auth/api';

export const RegisterForm: React.FC = () => {
  const router = useRouter();

  // Registration step (1 = Age, 2 = Profile details)
  const [step, setStep] = useState<1 | 2>(1);

  // Form states
  const [age, setAge] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((current) => (current === msg ? null : current));
    }, 3000);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || parseInt(age, 10) < 1 || parseInt(age, 10) > 120) {
      setErrorMsg('Please enter a valid age between 1 and 120.');
      return;
    }
    setErrorMsg(null);
    setStep(2);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      await authApi.register({
        email: email.trim(),
        password,
        age: age ? parseInt(age, 10) : undefined,
        name: name.trim() ? name.trim() : undefined,
      });
      router.push('/welcome');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to create profile. Please check your information.');
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
        {step === 1 ? (
          <Link
            href="/"
            className="p-2 text-[#52656d] hover:text-white active:scale-95 transition-all rounded-xl flex items-center justify-center cursor-pointer select-none"
            title="Close"
          >
            <svg className="w-5 h-5 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setStep(1);
            }}
            className="p-2 text-[#52656d] hover:text-white active:scale-95 transition-all rounded-xl flex items-center justify-center cursor-pointer select-none"
            title="Back"
          >
            <svg className="w-5 h-5 stroke-current stroke-[3]" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}

        <Link
          href="/login"
          className="px-4 py-2 bg-[#131f24] hover:bg-[#202f36] border-2 border-[#2b3840] text-[#4b5563] hover:text-white font-extrabold text-[12px] uppercase tracking-widest rounded-2xl shadow-[0_3px_0_0_#2b3840] active:shadow-none active:translate-y-[3px] transition-all cursor-pointer select-none"
        >
          LOGIN
        </Link>
      </header>

      {/* Main Content Container */}
      <main className="w-full max-w-[375px] mx-auto my-auto flex flex-col items-center px-2 py-6">
        {/* Step 1: How old are you? */}
        {step === 1 && (
          <>
            <h1 className="text-[26px] font-extrabold text-white text-center mb-6 tracking-wide">
              How old are you?
            </h1>

            {errorMsg && (
              <div className="w-full mb-5 p-3.5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 font-bold text-xs text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleNextStep} className="w-full flex flex-col gap-3.5">
              <div>
                <input
                  type="number"
                  min="1"
                  max="120"
                  required
                  placeholder="Age"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  className="w-full h-12 px-4 bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl font-bold text-white placeholder-[#778e9a] outline-none text-[15px] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <p className="text-[12px] font-bold text-[#778e9a] mt-2.5 leading-relaxed text-left">
                  Providing your age ensures you get the right Duolingo experience. For more details, please visit our{' '}
                  <span
                    onClick={() => triggerToast('Coming Soon')}
                    className="underline text-[#778e9a] hover:text-white cursor-pointer"
                  >
                    Privacy Policy
                  </span>
                  .
                </p>
              </div>

              <button
                type="submit"
                disabled={!age || parseInt(age, 10) < 1}
                className="w-full h-12 mt-1 bg-[#1cb0f6] hover:bg-[#24b9ff] text-white font-extrabold text-[13px] uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#1899d6] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer select-none disabled:bg-[#37464f] disabled:text-[#52656d] disabled:shadow-none disabled:cursor-not-allowed disabled:translate-y-0"
              >
                NEXT
              </button>
            </form>
          </>
        )}

        {/* Step 2: Create your profile */}
        {step === 2 && (
          <>
            <h1 className="text-[26px] font-extrabold text-white text-center mb-6 tracking-wide">
              Create your profile
            </h1>

            {errorMsg && (
              <div className="w-full mb-5 p-3.5 bg-red-500/10 border-2 border-red-500/30 rounded-2xl text-red-400 font-bold text-xs text-center">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="w-full flex flex-col gap-3.5">
              {/* Optional Name Field */}
              <input
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 px-4 bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl font-bold text-white placeholder-[#778e9a] outline-none text-[15px] transition-colors"
              />

              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl font-bold text-white placeholder-[#778e9a] outline-none text-[15px] transition-colors"
              />

              <div className="relative w-full">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-4 pr-12 bg-[#131f24] border-2 border-[#37464f] focus:border-[#1cb0f6] rounded-2xl font-bold text-white placeholder-[#778e9a] outline-none text-[15px] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#52656d] hover:text-[#849aa5] active:opacity-70 transition-opacity p-1 cursor-pointer select-none"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.17c0-1.66-1.34-3-3-3l-.17.02z" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || !email.trim() || !password}
                className="w-full h-12 mt-1 bg-[#1cb0f6] hover:bg-[#24b9ff] text-white font-extrabold text-[13px] uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#1899d6] active:shadow-none active:translate-y-[4px] transition-all cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0"
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </form>
          </>
        )}

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
            onClick={() => triggerToast('Coming Soon')}
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
            onClick={() => triggerToast('Coming Soon')}
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

        {/* Legal Disclaimer */}
        <div className="mt-8 text-center text-[11px] font-bold text-[#52656d] leading-[1.6] max-w-[340px]">
          <p className="mb-2">
            By signing in to Duolingo, you agree to our{' '}
            <span
              onClick={() => triggerToast('Coming Soon')}
              className="underline text-[#778e9a] hover:text-white cursor-pointer"
            >
              Terms
            </span>{' '}
            and{' '}
            <span
              onClick={() => triggerToast('Coming Soon')}
              className="underline text-[#778e9a] hover:text-white cursor-pointer"
            >
              Privacy Policy
            </span>
            .
          </p>
          <p>
            This site is protected by reCAPTCHA Enterprise and the Google{' '}
            <span
              onClick={() => triggerToast('Coming Soon')}
              className="underline text-[#778e9a] hover:text-white cursor-pointer"
            >
              Privacy Policy
            </span>{' '}
            and{' '}
            <span
              onClick={() => triggerToast('Coming Soon')}
              className="underline text-[#778e9a] hover:text-white cursor-pointer"
            >
              Terms of Service
            </span>{' '}
            apply.
          </p>
        </div>
      </main>

      <footer className="py-2"></footer>
    </div>
  );
};
