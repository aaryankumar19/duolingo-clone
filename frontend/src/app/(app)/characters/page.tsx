'use client';

import React, { useState } from 'react';
import { AppHeader } from '@/components/layout/AppHeader';

interface CharTile {
  char: string;
  romaji: string;
}

const HIRAGANA_GRID: (CharTile | null)[] = [
  { char: 'あ', romaji: 'a' },
  { char: 'い', romaji: 'i' },
  { char: 'う', romaji: 'u' },
  { char: 'え', romaji: 'e' },
  { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' },
  { char: 'き', romaji: 'ki' },
  { char: 'く', romaji: 'ku' },
  { char: 'け', romaji: 'ke' },
  { char: 'こ', romaji: 'ko' },
  { char: 'さ', romaji: 'sa' },
  { char: 'し', romaji: 'shi' },
  { char: 'す', romaji: 'su' },
  { char: 'せ', romaji: 'se' },
  { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' },
  { char: 'ち', romaji: 'chi' },
  { char: 'つ', romaji: 'tsu' },
  { char: 'て', romaji: 'te' },
  { char: 'と', romaji: 'to' },
  { char: 'な', romaji: 'na' },
  { char: 'に', romaji: 'ni' },
  { char: 'ぬ', romaji: 'nu' },
  { char: 'ね', romaji: 'ne' },
  { char: 'の', romaji: 'no' },
  { char: 'は', romaji: 'ha' },
  { char: 'ひ', romaji: 'hi' },
  { char: 'ふ', romaji: 'fu' },
  { char: 'へ', romaji: 'he' },
  { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' },
  { char: 'み', romaji: 'mi' },
  { char: 'む', romaji: 'mu' },
  { char: 'め', romaji: 'me' },
  { char: 'も', romaji: 'mo' },
  { char: 'や', romaji: 'ya' },
  null,
  { char: 'ゆ', romaji: 'yu' },
  null,
  { char: 'よ', romaji: 'yo' },
  { char: 'ら', romaji: 'ra' },
  { char: 'り', romaji: 'ri' },
  { char: 'る', romaji: 'ru' },
  { char: 'れ', romaji: 're' },
  { char: 'ろ', romaji: 'ro' },
  { char: 'わ', romaji: 'wa' },
  null,
  null,
  null,
  { char: 'を', romaji: 'wo' },
  { char: 'ん', romaji: 'n' },
];

const KATAKANA_GRID: (CharTile | null)[] = [
  { char: 'ア', romaji: 'a' },
  { char: 'イ', romaji: 'i' },
  { char: 'ウ', romaji: 'u' },
  { char: 'エ', romaji: 'e' },
  { char: 'オ', romaji: 'o' },
  { char: 'カ', romaji: 'ka' },
  { char: 'キ', romaji: 'ki' },
  { char: 'ク', romaji: 'ku' },
  { char: 'ケ', romaji: 'ke' },
  { char: 'コ', romaji: 'ko' },
  { char: 'サ', romaji: 'sa' },
  { char: 'シ', romaji: 'shi' },
  { char: 'ス', romaji: 'su' },
  { char: 'セ', romaji: 'se' },
  { char: 'ソ', romaji: 'so' },
  { char: 'タ', romaji: 'ta' },
  { char: 'チ', romaji: 'chi' },
  { char: 'ツ', romaji: 'tsu' },
  { char: 'テ', romaji: 'te' },
  { char: 'ト', romaji: 'to' },
];

const KANJI_GRID: (CharTile | null)[] = [
  { char: '日', romaji: 'nichi' },
  { char: '本', romaji: 'hon' },
  { char: '人', romaji: 'hito' },
  { char: '月', romaji: 'tsuki' },
  { char: '火', romaji: 'hi' },
  { char: '水', romaji: 'mizu' },
  { char: '木', romaji: 'ki' },
  { char: '金', romaji: 'kane' },
  { char: '土', romaji: 'tsuchi' },
  { char: '山', romaji: 'yama' },
];

export default function CharactersPage() {
  const [activeTab, setActiveTab] = useState<'HIRAGANA' | 'KATAKANA' | 'KANJI'>('HIRAGANA');
  const [selectedChar, setSelectedChar] = useState<string | null>(null);

  const currentGrid =
    activeTab === 'HIRAGANA'
      ? HIRAGANA_GRID
      : activeTab === 'KATAKANA'
      ? KATAKANA_GRID
      : KANJI_GRID;

  const playCharSound = (char: string) => {
    setSelectedChar(char);
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(char);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full max-w-[1056px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-8 py-4 text-white">
      {/* ── Main Content ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center max-w-xl mx-auto w-full">
        {/* Top Tabs */}
        <div className="flex w-full border-b border-[#2b3840] mb-8">
          {(['HIRAGANA', 'KATAKANA', 'KANJI'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-colors cursor-pointer text-center relative ${
                activeTab === tab
                  ? 'text-[#1cb0f6] border-b-2 border-[#1cb0f6] -mb-px'
                  : 'text-[#778e9a] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Header Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-2">
          Let’s learn {activeTab.charAt(0) + activeTab.slice(1).toLowerCase()}!
        </h1>
        <p className="text-sm font-bold text-[#778e9a] text-center mb-6">
          Get to know the main writing system in Japanese
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md mb-10">
          <button className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl border-2 border-[#2b3840] bg-[#131f24] hover:bg-[#202f36] text-[#1cb0f6] font-extrabold text-sm uppercase tracking-wider transition cursor-pointer text-center">
            TIPS
          </button>
          <button className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] border-b-4 border-[#1482b8] active:border-b-0 active:translate-y-[2px] text-white font-extrabold text-sm uppercase tracking-wider transition shadow-md cursor-pointer text-center">
            LEARN THE CHARACTERS
          </button>
        </div>

        {/* Characters Grid (5 columns) */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4 w-full">
          {currentGrid.map((item, idx) => {
            if (!item) {
              return <div key={`empty-${idx}`} className="w-full aspect-square" />;
            }
            const isSelected = selectedChar === item.char;

            return (
              <button
                key={item.char + idx}
                onClick={() => playCharSound(item.char)}
                className={`w-full aspect-square bg-[#202f36] hover:bg-[#283b44] border-2 border-b-4 border-[#2b3840] hover:border-[#37464f] rounded-2xl flex flex-col items-center justify-center p-2 transition-all cursor-pointer select-none active:translate-y-[2px] active:border-b-2 ${
                  isSelected ? 'border-[#1cb0f6] bg-[#132d3a]' : ''
                }`}
              >
                <span className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {item.char}
                </span>
                <div className="w-6 h-1 bg-[#37464f] rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-[#778e9a]" />
                </div>
                <span className="text-[11px] font-bold text-[#778e9a] mt-1">
                  {item.romaji}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Right Sidebar ──────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-6 w-[310px] shrink-0">
        <AppHeader />

        {/* Practice Banner */}
        <div className="bg-[#202f36] border-2 border-[#2b3840] rounded-3xl p-5 flex flex-col gap-3 shadow-lg">
          <h3 className="text-base font-extrabold text-white">Master Hiragana</h3>
          <p className="text-xs font-bold text-[#778e9a] leading-relaxed">
            Practice reading and writing Japanese characters with interactive audio exercises!
          </p>
        </div>
      </div>
    </div>
  );
}
