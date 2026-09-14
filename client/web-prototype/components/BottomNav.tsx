import React from 'react';
import { Home, Compass, Star, User } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  ratingsBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  ratingsBadgeCount,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'explore',
      label: 'Explore',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'ratings',
      label: 'My Ratings',
      icon: <Star className="w-5 h-5" />,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <User className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="sticky bottom-0 inset-x-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-xl border-t border-[#EBE4DF] shadow-[0_-3px_12px_rgba(0,0,0,0.05)] select-none">
      <div className="flex justify-around items-center h-16 px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex-1 h-full flex flex-col items-center justify-center gap-1 transition-all group ${
                isActive ? 'text-[#D99B26]' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {/* Active top line indicator */}
              {isActive && (
                <div className="absolute top-0 w-9 h-0.5 bg-[#D99B26] rounded-full shadow-[0_1px_3px_rgba(217,155,38,0.6)]" />
              )}

              {/* Icon */}
              <div className="relative">
                <div
                  className={`transition-transform duration-200 ${
                    isActive ? 'scale-110 font-bold' : 'group-hover:scale-105'
                  }`}
                >
                  {tab.icon}
                </div>
                {tab.id === 'ratings' && ratingsBadgeCount && ratingsBadgeCount > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold bg-[#6A1A24] text-white rounded-full leading-tight">
                    {ratingsBadgeCount}
                  </span>
                ) : null}
              </div>

              {/* Label */}
              <span
                className={`text-[11px] leading-none transition-all ${
                  isActive ? 'font-bold text-[#D99B26]' : 'font-medium text-stone-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Home indicator bar (iPhone gesture line) */}
      <div className="w-full flex justify-center pb-1 pt-0.5 bg-white">
        <div className="w-32 h-1 bg-stone-300 rounded-full" />
      </div>
    </nav>
  );
};
