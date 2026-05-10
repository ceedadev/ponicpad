import React from 'react';
import type { Page, RouterState } from '../types';

interface Props {
  currentPage: Page;
  navigate: (r: RouterState) => void;
  children: React.ReactNode;
}

interface NavItem {
  page: Page;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { page: 'dashboard', label: 'Home', icon: '🏠' },
  { page: 'batches', label: 'Batches', icon: '🌱' },
  { page: 'nutrients', label: 'Nutrients', icon: '⚗️' },
  { page: 'schedule', label: 'Schedule', icon: '📅' },
  { page: 'reference', label: 'Reference', icon: '📖' },
];

export default function Layout({ currentPage, navigate, children }: Props) {
  const activeNavPage = currentPage === 'batch-detail' ? 'batches' : currentPage === 'settings' ? null : currentPage;

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto relative flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => navigate({ page: 'dashboard' })}
          className="flex items-center gap-2"
        >
          <span className="text-2xl">🌿</span>
          <span className="text-lg font-bold text-green-700">PonicPad</span>
        </button>
        <button
          onClick={() => navigate({ page: 'settings' })}
          className={`p-2 rounded-xl transition-colors ${
            currentPage === 'settings' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:bg-gray-100'
          }`}
          aria-label="Settings"
        >
          ⚙️
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        {children}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="flex">
          {NAV_ITEMS.map(item => {
            const isActive = activeNavPage === item.page;
            return (
              <button
                key={item.page}
                onClick={() => navigate({ page: item.page })}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 transition-colors ${
                  isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-xl leading-tight">{item.icon}</span>
                <span className={`text-xs font-medium ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
