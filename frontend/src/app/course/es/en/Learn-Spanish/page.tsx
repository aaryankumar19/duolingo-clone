'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ES } from 'country-flag-icons/react/3x2';

export default function LearnSpanishPage() {
  const [siteLanguage, setSiteLanguage] = useState('ENGLISH');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#4b4b4b] flex flex-col justify-between font-sans selection:bg-[#58cc02] selection:text-white">
      {/* Top Navigation Header */}
      <header className="w-full bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6 sm:px-10">
          {/* Official Duolingo Logo */}
          <Link href="/" className="flex items-center cursor-pointer py-1">
            <Image
              src="/duolingo_logo.png"
              alt="duolingo"
              width={160}
              height={36}
              priority
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>

          {/* Site Language Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="text-xs font-extrabold text-[#afafaf] hover:text-[#4b4b4b] flex items-center gap-1.5 cursor-pointer uppercase tracking-widest transition-colors py-1 px-2 rounded-lg"
            >
              SITE LANGUAGE: {siteLanguage}
              <svg
                className={`w-3.5 h-3.5 transition-transform ${
                  showLanguageDropdown ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border-2 border-gray-200 rounded-2xl shadow-xl py-2 z-40">
                {['ENGLISH'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setSiteLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-extrabold uppercase tracking-wider transition-colors ${
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

      {/* Main Hero Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 py-8 md:py-16 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Hero Graphic Illustration */}
          <div className="flex justify-center items-center order-1 md:order-1">
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

          {/* Right Hero Content & Action Buttons */}
          <div className="flex flex-col items-center md:items-center text-center justify-center order-2 md:order-2 space-y-8 max-w-md mx-auto md:mx-0">
            <h1 className="text-2xl sm:text-3xl md:text-[32px] font-extrabold text-[#4b4b4b] leading-[1.25] tracking-tight">
              Learn Spanish in just 5 minutes a day. For free.
            </h1>

            <div className="flex flex-col gap-3.5 w-full max-w-sm">
              <Link
                href="/register"
                className="w-full py-3.5 bg-[#58cc02] hover:bg-[#61e002] text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#46a302] active:shadow-none active:translate-y-[4px] transition-all text-center select-none block cursor-pointer"
              >
                GET STARTED
              </Link>

              <Link
                href="/login"
                className="w-full py-3.5 bg-white hover:bg-gray-50 border-2 border-[#e5e5e5] text-[#1cb0f6] font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_0_0_#e5e5e5] active:shadow-none active:translate-y-[4px] transition-all text-center select-none block cursor-pointer"
              >
                I ALREADY HAVE AN ACCOUNT
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Spanish Specific Banner Ribbon */}
      <footer className="w-full border-t border-gray-200/80 bg-white py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-10 flex items-center justify-center gap-3 text-center">
          <ES className="w-10 h-7 rounded-[5px] shadow-sm object-cover shrink-0" />
          <span className="text-sm sm:text-base font-extrabold text-[#4b4b4b] tracking-tight">
            The world's most popular way to learn Spanish online
          </span>
        </div>
      </footer>
    </div>
  );
}
