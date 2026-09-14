import React from 'react';
import { Bell, ShieldCheck } from 'lucide-react';
import { TabType, UserProfile } from '../types';

interface HeaderProps {
  currentTab: TabType;
  user: UserProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onNavigateToProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  user,
  unreadCount,
  onOpenNotifications,
  onNavigateToProfile,
}) => {
  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'home':
        return 'Home';
      case 'explore':
        return 'Explore';
      case 'ratings':
        return 'My Ratings';
      case 'profile':
        return 'Profile';
    }
  };

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-[#590014] text-white shadow-[0_2px_14px_rgba(76,3,17,0.28)] select-none">
      {/* iOS / Mobile Status Bar */}
      <div className="h-6 pt-1 px-5 flex items-center justify-between text-[11px] font-medium text-white/90">
        <span>9:41</span>
        {/* Dynamic Island / Camera slit */}
        <div className="w-20 h-3.5 bg-black/40 rounded-full flex items-center justify-center gap-1.5 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D99B26]/80 animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-black/60" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-tighter">5G</span>
          {/* Signal bars */}
          <div className="flex items-end gap-0.5 h-2.5">
            <div className="w-0.5 h-1 bg-white rounded-xs" />
            <div className="w-0.5 h-1.5 bg-white rounded-xs" />
            <div className="w-0.5 h-2 bg-white rounded-xs" />
            <div className="w-0.5 h-2.5 bg-white rounded-xs" />
          </div>
          {/* Battery */}
          <div className="w-4 h-2 border border-white/80 rounded-xs p-0.5 flex items-center">
            <div className="w-2.5 h-full bg-[#D99B26] rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Logo and Name */}
        <div className="flex items-center gap-2.5">
          {/* Calvin Crest Badge */}
          <div className="w-8 h-8 rounded-full bg-[#D99B26] flex items-center justify-center text-[#590014] font-black text-xs shadow-inner ring-2 ring-white/20">
            <span className="tracking-tighter font-serif text-[11px]">CU</span>
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-base text-[#D99B26] leading-none tracking-tight">
              Calvin Ratings
            </span>
            <span className="text-[10px] font-semibold text-[#ffdada] uppercase tracking-wider mt-0.5">
              {getTabTitle(currentTab)}
            </span>
          </div>
        </div>

        {/* Action icons: Notifications & Profile Avatar */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 active:scale-95 transition-all"
          >
            <Bell className="w-5 h-5 text-white/95" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#D99B26] ring-2 ring-[#590014] animate-pulse" />
            )}
          </button>

          <button
            onClick={onNavigateToProfile}
            aria-label="Open Profile"
            className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-[#D99B26]/80 hover:ring-[#D99B26] transition-all active:scale-95 focus:outline-none"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            {user.ssoVerified && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#2E6B38] rounded-full ring-1 ring-white flex items-center justify-center">
                <ShieldCheck className="w-2 h-2 text-white" />
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
