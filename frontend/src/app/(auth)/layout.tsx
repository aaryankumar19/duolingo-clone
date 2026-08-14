import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#131f24] text-white flex flex-col justify-between selection:bg-[#1cb0f6] selection:text-white">
      {children}
    </div>
  );
}
