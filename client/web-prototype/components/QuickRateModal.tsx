import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, MapPin } from 'lucide-react';
import { Place } from '../types';

interface QuickRateModalProps {
  isOpen: boolean;
  onClose: () => void;
  places: Place[];
  defaultPlaceId?: string;
  defaultSubLocation?: string;
  onSubmitRating: (review: {
    placeId: string;
    placeName: string;
    subLocation: string;
    rating: number;
    capacityPercent: number;
    noiseLevel: string;
    tags: string[];
    comment: string;
  }) => void;
}

export const QuickRateModal: React.FC<QuickRateModalProps> = ({
  isOpen,
  onClose,
  places,
  defaultPlaceId = 'hekman-card',
  defaultSubLocation = 'Floor 2 Commons',
  onSubmitRating,
}) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState(defaultPlaceId);
  const [selectedSubLocation, setSelectedSubLocation] = useState(defaultSubLocation);
  const [starRating, setStarRating] = useState(5);
  const [crowdLevel, setCrowdLevel] = useState<'quiet' | 'moderate' | 'packed'>('packed');
  const [noiseLevel, setNoiseLevel] = useState('Low Buzz');
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Outlets Available', 'Natural Light']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  const availableTags = [
    'Outlets Available',
    'Natural Light',
    'Booths Open',
    'AC Cold',
    'Quiet Zone',
    'Short Line',
    'Strong Wi-Fi',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const getCapacityFromCrowd = (level: 'quiet' | 'moderate' | 'packed') => {
    switch (level) {
      case 'quiet':
        return 30;
      case 'moderate':
        return 60;
      case 'packed':
        return 85;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitRating({
        placeId: currentPlace.id,
        placeName: currentPlace.name,
        subLocation: selectedSubLocation,
        rating: starRating,
        capacityPercent: getCapacityFromCrowd(crowdLevel),
        noiseLevel: noiseLevel,
        tags: selectedTags,
        comment: comment.trim() || 'Live campus vibe check submitted anonymously.',
      });

      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-t-2xl sm:rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#590014] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D99B26] animate-ping" />
            <h3 className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#D99B26]" />
              Live Campus Quick-Rate
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 bg-[#FAF7F5]">
            <div className="w-16 h-16 rounded-full bg-[#2E6B38] text-white flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h4 className="text-xl font-bold text-[#4c0311]">Rating Broadcasted!</h4>
            <p className="text-xs text-stone-600 max-w-xs">
              Thank you for keeping Calvin University updated. Your review is 100% peer-anonymous.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 no-scrollbar">
            {/* Spot Selector */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Select Campus Location
              </label>
              <select
                value={selectedPlaceId}
                onChange={(e) => {
                  setSelectedPlaceId(e.target.value);
                  const p = places.find((item) => item.id === e.target.value);
                  if (p?.floors && p.floors.length > 0) {
                    setSelectedSubLocation(p.floors[0].name);
                  } else {
                    setSelectedSubLocation('Main Common Area');
                  }
                }}
                className="w-full h-10 px-3 rounded-lg bg-stone-100 border border-stone-200 text-sm font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#D99B26]"
              >
                {places.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Area Sub-selector */}
              {currentPlace.floors && currentPlace.floors.length > 0 ? (
                <div className="mt-2">
                  <label className="block text-[10px] font-semibold text-stone-500 mb-1">
                    Floor or Zone
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {currentPlace.floors.map((fl) => (
                      <button
                        type="button"
                        key={fl.floor}
                        onClick={() => setSelectedSubLocation(fl.name)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                          selectedSubLocation === fl.name
                            ? 'bg-[#6A1A24] text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {fl.floor}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Star Rating */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-center">
              <span className="text-xs font-semibold text-stone-600 block mb-1">
                How is the vibe & condition right now?
              </span>
              <div className="flex justify-center items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= starRating
                          ? 'fill-[#D99B26] text-[#D99B26]'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#C5832B] mt-1 block">
                {starRating === 5 && '⭐️⭐️⭐️⭐️⭐️ 5.0 Exceptional'}
                {starRating === 4 && '⭐️⭐️⭐️⭐️ 4.0 Great Study Vibe'}
                {starRating === 3 && '⭐️⭐️⭐️ 3.0 Decent / Average'}
                {starRating === 2 && '⭐️⭐️ 2.0 Crowded / Noisy'}
                {starRating === 1 && '⭐️ 1.0 Not Recommended Now'}
              </span>
            </div>

            {/* Live Crowd Level */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Current Crowding
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setCrowdLevel('quiet')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    crowdLevel === 'quiet'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/40'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">🌿</span>
                  <span>Quiet (&lt;40%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCrowdLevel('moderate')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    crowdLevel === 'moderate'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-400/40'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">☕</span>
                  <span>Moderate (60%)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCrowdLevel('packed')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                    crowdLevel === 'packed'
                      ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-400/40'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span className="text-base">🔥</span>
                  <span>Packed (85%+)</span>
                </button>
              </div>
            </div>

            {/* Noise Level */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Noise Level
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Whisper Quiet', 'Low Buzz', 'Social'].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setNoiseLevel(lvl)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                      noiseLevel === lvl
                        ? 'bg-[#6A1A24] text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Tag Badges */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Tag Amenities (Tap to toggle)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#fdba45] text-[#590014] font-bold ring-1 ring-[#D99B26]'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tip note */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1">
                Anonymous Student Tip (Optional)
              </label>
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g., Bring a sweater, sunny desks on the west side open!"
                className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#D99B26]"
              />
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-[#590014] hover:bg-[#4c0311] text-[#D99B26] font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#D99B26]" />
                    <span>Publish Live Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
