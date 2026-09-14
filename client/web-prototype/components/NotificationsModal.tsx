import React from 'react';
import { X, Bell, Check, Clock, Volume2, Sparkles } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: string;
  unread: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh]">
        <div className="bg-[#590014] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#D99B26]" />
            <span className="font-bold text-sm tracking-tight text-white">Campus Live Alerts</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[10px] text-[#ffdada] hover:text-white font-bold flex items-center gap-1"
            >
              <Check className="w-3 h-3" /> Mark read
            </button>
            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-3 overflow-y-auto space-y-2.5 divide-y divide-stone-100 no-scrollbar">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`pt-2 first:pt-0 flex items-start gap-2.5 ${
                n.unread ? 'bg-amber-50/60 -mx-1 p-2 rounded-xl' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#FAF7F5] border border-stone-200 flex items-center justify-center text-[#6A1A24] shrink-0 mt-0.5">
                {n.type === 'quiet' ? (
                  <Volume2 className="w-4 h-4 text-[#2E6B38]" />
                ) : n.type === 'coffee' ? (
                  <Clock className="w-4 h-4 text-[#D99B26]" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#6A1A24]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-stone-400 shrink-0 ml-1">
                    {n.time}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
