'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/use-auth-store';
import { ES, US, FR, JP, DE, IN, KR, IT, CN, RU } from 'country-flag-icons/react/3x2';
import { Globe, ChevronDown } from 'lucide-react';

const LANGUAGE_COURSES = [
  { id: 'spanish', name: 'Spanish', count: '42M learners', Flag: ES },
  { id: 'french', name: 'French', count: '23M learners', Flag: FR },
  { id: 'japanese', name: 'Japanese', count: '18M learners', Flag: JP },
  { id: 'german', name: 'German', count: '16M learners', Flag: DE },
  { id: 'english', name: 'English', count: '30M learners', Flag: US },
  { id: 'italian', name: 'Italian', count: '10M learners', Flag: IT },
  { id: 'chinese', name: 'Chinese', count: '9.3M learners', Flag: CN },
  { id: 'russian', name: 'Russian', count: '7.8M learners', Flag: RU },
  { id: 'hindi', name: 'Hindi', count: '14M learners', Flag: IN },
  { id: 'korean', name: 'Korean', count: '12M learners', Flag: KR },
];

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [siteLanguage, setSiteLanguage] = useState('ENGLISH');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/learn');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#131f24] text-white flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-20 h-20 bg-[#58cc02] rounded-3xl flex items-center justify-center shadow-lg border-b-4 border-[#46a302]">
            <Image
              src="/duolingo_logo.png"
              alt="Duolingo"
              width={60}
              height={60}
              className="object-contain brightness-0 invert"
            />
          </div>
          <p className="text-sm font-extrabold text-[#58cc02] uppercase tracking-widest">
            Loading Duolingo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#4b4b4b] flex flex-col justify-between font-sans selection:bg-[#58cc02] selection:text-white">
      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6 sm:px-10">
          <Link href="/" className="flex items-center cursor-pointer py-1">
            <Image
              src="/duolingo_logo.png"
              alt="Duolingo"
              width={160}
              height={36}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="text-xs font-extrabold text-[#afafaf] hover:text-[#4b4b4b] flex items-center gap-2 cursor-pointer uppercase tracking-widest transition py-1.5 px-3.5 rounded-xl border border-gray-200 hover:border-gray-300"
            >
              <Globe className="w-4 h-4 text-[#1cb0f6]" />
              <span>SITE LANGUAGE: {siteLanguage}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border-2 border-gray-200 rounded-2xl shadow-xl py-2 z-40">
                {['ENGLISH', 'SPANISH', 'FRENCH'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSiteLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition ${
                      siteLanguage === lang
                        ? 'text-[#1cb0f6] bg-blue-50'
                        : 'text-[#4b4b4b] hover:bg-gray-50'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 py-10 md:py-16 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Hero Graphic */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-[440px] aspect-square flex items-center justify-center">
              <Image
                src="/duolingo_hero.png"
                alt="Duolingo Characters"
                width={500}
                height={500}
                priority
                className="w-full h-auto object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Hero Actions */}
          <div className="flex flex-col items-center md:items-center text-center justify-center space-y-8 max-w-md mx-auto md:mx-0">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-[#4b4b4b] leading-[1.25] tracking-tight">
              The free, fun, and effective way to learn a language!
            </h1>

            <div className="flex flex-col gap-3.5 w-full max-w-sm">
              <Link
                href="/welcome"
                className="w-full py-4 bg-[#58cc02] hover:bg-[#61e002] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#46a302] active:shadow-none active:translate-y-[4px] transition-all text-center select-none block cursor-pointer"
              >
                GET STARTED
              </Link>

              <Link
                href="/login"
                className="w-full py-4 bg-white hover:bg-gray-50 border-2 border-[#e5e5e5] text-[#1cb0f6] font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#e5e5e5] active:shadow-none active:translate-y-[4px] transition-all text-center select-none block cursor-pointer"
              >
                I ALREADY HAVE AN ACCOUNT
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Language Course Ribbon */}
      <footer className="w-full border-t border-gray-200 bg-gray-50/50 py-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 flex flex-col gap-4">
          <p className="text-xs font-extrabold text-[#afafaf] uppercase tracking-widest text-center">
            LEARN A LANGUAGE WITH DUOLINGO
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {LANGUAGE_COURSES.map(({ id, name, count, Flag }) => (
              <Link
                key={id}
                href="/welcome"
                className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl hover:border-[#1cb0f6] hover:shadow-md transition cursor-pointer group"
              >
                <Flag className="w-6 h-4 rounded-sm shadow-xs object-cover" />
                <div className="flex flex-col text-left">
                  <span className="text-xs font-extrabold text-[#4b4b4b] group-hover:text-[#1cb0f6] transition">
                    {name}
                  </span>
                  <span className="text-[10px] font-bold text-[#afafaf]">{count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
