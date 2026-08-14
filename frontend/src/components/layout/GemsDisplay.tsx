import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  gems: number;
}

export const GemsDisplay: React.FC<Props> = ({ gems }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Gems Button Trigger */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`flex items-center gap-2 font-extrabold text-base sm:text-lg text-[#1cb0f6] px-3 py-1.5 rounded-xl transition border cursor-pointer select-none ${
          isOpen
            ? 'bg-[#202f36] border-[#2b3840] shadow-md'
            : 'border-transparent hover:bg-[#202f36]/60'
        }`}
      >
        {/* Hexagon Blue Gem Icon */}
        <svg className="w-6 h-6 shrink-0 drop-shadow-sm" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L20 7V17L12 22L4 17V7L12 2Z"
            fill="#1cb0f6"
            stroke="#0284c7"
            strokeWidth="1.5"
          />
          <path
            d="M12 4L17.5 7.5V16.5L12 20L6.5 16.5V7.5L12 4Z"
            fill="#38bdf8"
          />
          <polygon points="12,4 17.5,7.5 12,12" fill="#7dd3fc" />
          <polygon points="6.5,7.5 12,4 12,12" fill="#bae6fd" />
        </svg>
        <span>{gems}</span>
      </button>

      {/* Popover Card UI */}
      {isOpen && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 w-[320px] sm:w-[340px] bg-[#131f24] border-2 border-[#2b3840] rounded-3xl p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 text-left before:absolute before:-top-3 before:left-0 before:right-0 before:h-4">
          {/* Top Pointer Arrow Centered */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#131f24] border-t border-l border-[#2b3840] rotate-45 z-20" />



          <div className="flex items-center gap-4">
            {/* Treasure Chest SVG Graphic */}
            <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
              <svg className="w-full h-full drop-shadow-lg" viewBox="0 0 100 100" fill="none">
                {/* Chest Shadow */}
                <ellipse cx="50" cy="88" rx="36" ry="6" fill="#090d0f" opacity="0.6"/>

                {/* Back Open Lid */}
                <path d="M14 42 C14 22 32 14 50 14 C68 14 86 22 86 42 Z" fill="#78350f" stroke="#451a03" strokeWidth="2"/>
                <path d="M18 40 C18 26 33 18 50 18 C67 18 82 26 82 40 Z" fill="#92400e"/>
                <ellipse cx="50" cy="40" rx="32" ry="8" fill="#451a03"/>

                {/* Glowing Gems in Chest */}
                <polygon points="40,32 50,20 60,32 50,44" fill="#38bdf8"/>
                <polygon points="40,32 50,44 33,44" fill="#0284c7"/>
                <polygon points="50,20 60,32 50,44" fill="#7dd3fc"/>

                <polygon points="24,38 34,26 44,38 34,48" fill="#38bdf8"/>
                <polygon points="24,38 34,48 18,48" fill="#0284c7"/>
                <polygon points="34,26 44,38 34,48" fill="#7dd3fc"/>

                <polygon points="56,36 66,24 76,36 66,46" fill="#38bdf8"/>
                <polygon points="56,36 66,46 50,46" fill="#0284c7"/>
                <polygon points="66,24 76,36 66,46" fill="#7dd3fc"/>

                {/* Sparkles */}
                <path d="M48 18 L50 12 L52 18 L58 20 L52 22 L50 28 L48 22 L42 20 Z" fill="#ffffff"/>
                <path d="M72 22 L73 18 L74 22 L78 23 L74 24 L73 28 L72 24 L68 23 Z" fill="#ffffff"/>

                {/* Chest Base Body */}
                <path d="M14 44 L86 44 L80 84 C80 87 77 89 74 89 L26 89 C23 89 20 87 20 84 Z" fill="#b45309" stroke="#451a03" strokeWidth="2"/>
                <path d="M20 44 L80 44 L76 84 L24 84 Z" fill="#d97706"/>

                {/* Golden Straps */}
                <rect x="25" y="44" width="9" height="42" fill="#fbbf24" stroke="#b45309"/>
                <rect x="66" y="44" width="9" height="42" fill="#fbbf24" stroke="#b45309"/>

                {/* Golden Lock Plate & Keyhole */}
                <rect x="41" y="52" width="18" height="24" rx="4" fill="#f59e0b" stroke="#78350f" strokeWidth="2"/>
                <circle cx="50" cy="61" r="3.5" fill="#451a03"/>
                <polygon points="48.5,61 51.5,61 52.5,70 47.5,70" fill="#451a03"/>
              </svg>
            </div>

            {/* Right Text Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-black text-2xl text-white tracking-tight leading-tight">
                Gems
              </h3>
              <p className="text-[#8496a0] font-extrabold text-sm mt-0.5 mb-3">
                You have {gems} gems
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  router.push('/shop');
                }}
                className="text-[#1cb0f6] hover:text-[#189bdc] font-black text-sm uppercase tracking-wider hover:underline cursor-pointer transition block"
              >
                GO TO SHOP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

