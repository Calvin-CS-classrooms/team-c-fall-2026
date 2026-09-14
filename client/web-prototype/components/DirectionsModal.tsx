import React from 'react';
import { X, Navigation, Footprints, Clock, MapPin, CheckCircle } from 'lucide-react';
import { Place } from '../types';

interface DirectionsModalProps {
  place: Place | null;
  onClose: () => void;
}

export const DirectionsModal: React.FC<DirectionsModalProps> = ({ place, onClose }) => {
  if (!place) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="bg-[#590014] text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#D99B26]" />
            <h3 className="font-bold text-sm tracking-tight text-white">
              Campus Wayfinder
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 text-stone-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Destination
            </span>
            <h4 className="text-base font-bold text-stone-900">{place.name}</h4>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#6A1A24]" />
              {place.subLocation}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#FAF7F5] p-2.5 rounded-xl border border-stone-200/80 text-xs">
            <div className="flex items-center gap-2">
              <Footprints className="w-4 h-4 text-[#2E6B38]" />
              <div>
                <span className="text-[10px] text-stone-400 block font-semibold">Walk Time</span>
                <span className="font-bold text-stone-800">~2 - 3 Mins</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C5832B]" />
              <div>
                <span className="text-[10px] text-stone-400 block font-semibold">Distance</span>
                <span className="font-bold text-stone-800">{place.distance || '220m'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
              Walking Route Instructions
            </span>
            <div className="space-y-1.5 border-l-2 border-[#D99B26] pl-3 py-1">
              <p className="text-stone-700">
                1. Head South through North Lawn Commons toward Central Quad.
              </p>
              <p className="text-stone-700">
                2. Enter through the main glass vestibule doors.
              </p>
              <p className="text-stone-700">
                3. Elevators and study carrels are straight ahead on your left.
              </p>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50 text-[#2E6B38] text-xs font-semibold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>Accessible entrance & automatic doors available.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#590014] text-[#D99B26] font-bold text-xs shadow-sm hover:brightness-110 active:scale-98 transition-all"
          >
            Start Walking Navigation
          </button>
        </div>
      </div>
    </div>
  );
};
