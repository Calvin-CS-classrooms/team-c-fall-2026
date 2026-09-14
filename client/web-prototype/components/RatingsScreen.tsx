import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  Zap,
  MapPin,
  Users,
  Volume2,
  VolumeX,
  Headphones,
  MessagesSquare,
  Star,
  Snowflake,
  Plug,
  Sun,
  Armchair,
  Coffee,
  Send,
  Check,
  ThumbsUp,
  Edit3,
  Trash2,
  Utensils,
  BookOpen,
} from 'lucide-react';
import { Place, UserRating, UserProfile } from '../types';

interface RatingsScreenProps {
  user: UserProfile;
  places: Place[];
  userRatings: UserRating[];
  onAddRating: (rating: Omit<UserRating, 'id' | 'timeAgo' | 'helpfulVotes'>) => void;
  onDeleteRating: (id: string) => void;
  onUpvoteRating: (id: string) => void;
  onUpdateUserRatingsCount: (delta: number) => void;
}

export const RatingsScreen: React.FC<RatingsScreenProps> = ({
  user,
  places,
  userRatings,
  onAddRating,
  onDeleteRating,
  onUpvoteRating,
}) => {
  // Submission Form State
  const [selectedPlaceId, setSelectedPlaceId] = useState('hekman-card');
  const [selectedSubLocation, setSelectedSubLocation] = useState('2nd Floor Commons');
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [capacity, setCapacity] = useState(85);
  const [noiseLevel, setNoiseLevel] = useState('Quiet Study Focus');
  const [starRating, setStarRating] = useState(4);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Outlets Available',
    'Natural Light',
  ]);
  const [tipNote, setTipNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeTabFilter, setActiveTabFilter] = useState<'active' | 'archived'>('active');
  const [editingRatingId, setEditingRatingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const currentPlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  const quickTagsList = [
    { label: 'AC Cold', icon: <Snowflake className="w-3.5 h-3.5" /> },
    { label: 'Outlets Available', icon: <Plug className="w-3.5 h-3.5" /> },
    { label: 'Natural Light', icon: <Sun className="w-3.5 h-3.5" /> },
    { label: 'Booths Open', icon: <Armchair className="w-3.5 h-3.5" /> },
    { label: 'Coffee Line Long', icon: <Coffee className="w-3.5 h-3.5" /> },
  ];

  const toggleTag = (tagLabel: string) => {
    if (selectedTags.includes(tagLabel)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagLabel));
    } else {
      setSelectedTags([...selectedTags, tagLabel]);
    }
  };

  const getCapacityBadge = (val: number) => {
    if (val < 40) {
      return {
        label: `${val}% (Plenty of Seats)`,
        className: 'bg-[#EAF5EC] text-[#2E6B38]',
      };
    }
    if (val < 75) {
      return {
        label: `${val}% (Moderate)`,
        className: 'bg-[#FFF4DB] text-[#C5832B]',
      };
    }
    return {
      label: `${val}% Busy (Nearly Full)`,
      className: 'bg-[#ffdad6] text-[#ba1a1a]',
    };
  };

  const capacityBadge = getCapacityBadge(capacity);

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();

    onAddRating({
      placeId: currentPlace.id,
      placeName: currentPlace.name,
      subLocation: selectedSubLocation,
      rating: starRating,
      capacityPercent: capacity,
      noiseLevel: noiseLevel,
      tags: selectedTags,
      comment:
        tipNote.trim() ||
        'Live campus report: comfortable atmosphere with good student focus today.',
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setTipNote('');
    }, 2000);
  };

  const handleStartEdit = (item: UserRating) => {
    setEditingRatingId(item.id);
    setEditText(item.comment);
  };

  const handleSaveEdit = (item: UserRating) => {
    item.comment = editText;
    setEditingRatingId(null);
  };

  return (
    <div className="w-full flex flex-col gap-4 px-4 pt-4 pb-8 bg-[#FAF7F5]">
      {/* Privacy & Verification Shield Banner */}
      <div className="bg-[#fcf1f2] rounded-xl p-3.5 border border-[#dbc0c0] shadow-2xs flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#6a1a24] text-[#D99B26] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#4c0311]">
              100% Peer Anonymous
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#2E6B38]/15 text-[#2E6B38] text-[10px] font-bold">
              Verified Student
            </span>
          </div>
          <p className="text-[11px] text-stone-600 mt-1 leading-relaxed">
            Your Calvin email confirms authentication only. Reviews and live occupancy reports never link to your name, student ID, or personal profile.
          </p>
        </div>
      </div>

      {/* Campus Impact Dashboard Widget */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <span className="text-[10px] font-bold text-[#C5832B] uppercase tracking-wider block">
              Student Contributor
            </span>
            <h2 className="text-base font-bold text-[#4c0311] leading-tight">
              Your Campus Impact
            </h2>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#ffdeae]/60 flex items-center justify-center text-[#7f5700]">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-[#FAF7F5] p-2.5 rounded-xl flex flex-col items-center text-center border border-stone-100">
            <span className="text-xl font-black text-[#4c0311]">
              {user.ratingsCount}
            </span>
            <span className="text-[10px] font-semibold text-stone-500 mt-0.5">
              Ratings Shared
            </span>
          </div>

          <div className="bg-[#FAF7F5] p-2.5 rounded-xl flex flex-col items-center text-center border border-stone-100">
            <span className="text-xl font-black text-[#D99B26]">
              {user.helpfulVotesCount}
            </span>
            <span className="text-[10px] font-semibold text-stone-500 mt-0.5">
              Helpful Votes
            </span>
          </div>

          <div className="bg-[#FAF7F5] p-2.5 rounded-xl flex flex-col items-center text-center border border-stone-100">
            <div className="flex items-center gap-1 text-[#C5832B] font-bold text-xs">
              <span>Knight</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-semibold text-stone-500 mt-0.5">
              Gold Tier
            </span>
          </div>
        </div>

        {/* Trust Meter micro-display */}
        <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-stone-100 text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#2E6B38]" />
            <span className="text-[11px]">
              Accuracy Index: <strong className="text-stone-900">{user.accuracyRate}% verified</strong>
            </span>
          </div>
          <span className="text-[10px] font-bold text-[#C5832B] bg-[#FFF4DB] px-2 py-0.5 rounded-full">
            Top 5%
          </span>
        </div>
      </div>

      {/* Active Location Quick-Rate Card */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D99B26] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D99B26]" />
            </span>
            <span className="text-[10px] text-[#7f5700] uppercase font-bold tracking-wider">
              Current Detected Location
            </span>
          </div>
          <button
            onClick={() => setIsChangingLocation(!isChangingLocation)}
            className="text-xs font-bold text-[#4c0311] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <MapPin className="w-3 h-3" />
            {isChangingLocation ? 'Done' : 'Change'}
          </button>
        </div>

        {/* Selected location display */}
        <div className="mt-1">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
            {currentPlace.name}
            <span className="text-xs text-stone-500 font-normal">
              {selectedSubLocation}
            </span>
          </h3>
          <p className="text-[11px] text-stone-500 mt-0.5">
            Help fellow Knights know what to expect right now!
          </p>
        </div>

        {/* Change location selector */}
        {isChangingLocation && (
          <div className="mt-2.5 p-2 bg-stone-50 rounded-xl border border-stone-200 space-y-2 animate-in fade-in">
            <label className="block text-[10px] font-bold uppercase text-stone-500">
              Select Spot
            </label>
            <select
              value={selectedPlaceId}
              onChange={(e) => {
                setSelectedPlaceId(e.target.value);
                const p = places.find((item) => item.id === e.target.value);
                if (p?.floors && p.floors.length > 0) {
                  setSelectedSubLocation(p.floors[0].name);
                } else {
                  setSelectedSubLocation('Main Zone');
                }
              }}
              className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white border border-stone-300 text-stone-800"
            >
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sliders and inputs form */}
        <form onSubmit={handleSubmitRating} className="mt-4 space-y-4">
          {/* Live Capacity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="capacity-range"
                className="text-xs font-bold text-stone-800 flex items-center gap-1.5"
              >
                <Users className="w-4 h-4 text-[#C5832B]" />
                Capacity / Crowding
              </label>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${capacityBadge.className}`}
              >
                {capacityBadge.label}
              </span>
            </div>
            <input
              id="capacity-range"
              type="range"
              min="10"
              max="100"
              step="5"
              value={capacity}
              onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
              className="w-full accent-[#4c0311] h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-semibold px-1 mt-0.5">
              <span>Empty</span>
              <span>Moderate</span>
              <span>Maxed Out</span>
            </div>
          </div>

          {/* Noise Level Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-[#C5832B]" />
                Noise Level
              </label>
              <span className="text-[10px] font-bold text-[#2E6B38]">
                {noiseLevel}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setNoiseLevel('Whisper Quiet')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                  noiseLevel === 'Whisper Quiet'
                    ? 'bg-[#4c0311] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <VolumeX className="w-4 h-4" />
                <span>Whisper</span>
              </button>

              <button
                type="button"
                onClick={() => setNoiseLevel('Quiet Study Focus')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                  noiseLevel === 'Quiet Study Focus'
                    ? 'bg-[#4c0311] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>Low Buzz</span>
              </button>

              <button
                type="button"
                onClick={() => setNoiseLevel('Lively Social')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition-all ${
                  noiseLevel === 'Lively Social'
                    ? 'bg-[#4c0311] text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <MessagesSquare className="w-4 h-4" />
                <span>Social</span>
              </button>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-stone-800">
                Vibe & Experience Rating
              </span>
              <span className="text-xs font-black text-[#C5832B]">
                {starRating}.0 Stars
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 py-2 bg-[#FAF7F5] rounded-xl border border-stone-200/80">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setStarRating(val)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      val <= starRating
                        ? 'fill-[#D99B26] text-[#D99B26]'
                        : 'text-stone-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Campus Quick Tags */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block mb-1.5">
              Tap Quick Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickTagsList.map((tag) => {
                const isSelected = selectedTags.includes(tag.label);
                return (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => toggleTag(tag.label)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-[#fdba45] text-[#281900] font-bold ring-1 ring-[#D99B26]'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {tag.icon}
                    <span>{tag.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Short Note Field */}
          <div className="bg-stone-50 rounded-xl p-2.5 border border-stone-200">
            <input
              type="text"
              value={tipNote}
              onChange={(e) => setTipNote(e.target.value)}
              placeholder="Add an anonymous quick tip (e.g. bring layers, fast wifi)..."
              className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-full bg-[#6a1a24] hover:bg-[#4c0311] text-[#D99B26] font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Post Anonymous Live Rating</span>
          </button>
        </form>

        {/* Success celebration toast overlay */}
        {isSubmitted && (
          <div className="absolute inset-0 bg-[#4c0311]/95 backdrop-blur-sm rounded-2xl p-6 flex flex-col items-center justify-center text-center text-white animate-in fade-in duration-200 z-20">
            <div className="w-14 h-14 rounded-full bg-[#D99B26] text-[#4c0311] flex items-center justify-center shadow-lg mb-2.5 animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <span className="text-lg font-bold text-[#D99B26]">
              Rating Broadcasted!
            </span>
            <p className="text-xs text-[#ffdada] mt-1 max-w-xs">
              Thanks for helping Calvin students plan their day. Your identity remains 100% private.
            </p>
          </div>
        )}
      </div>

      {/* User Contributions & History Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#4c0311]">Your Activity</h2>
            <span className="text-xs text-stone-500">
              Manage or remove anonymous submissions
            </span>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center p-0.5 bg-stone-200 rounded-lg text-xs">
            <button
              onClick={() => setActiveTabFilter('active')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                activeTabFilter === 'active'
                  ? 'bg-white text-[#4c0311] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Active ({userRatings.length})
            </button>
            <button
              onClick={() => setActiveTabFilter('archived')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                activeTabFilter === 'archived'
                  ? 'bg-white text-[#4c0311] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        {/* Activity Reviews List */}
        {activeTabFilter === 'active' && (
          <div className="space-y-3">
            {userRatings.map((item) => {
              const isEditing = editingRatingId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-[#4c0311] shrink-0">
                        {item.placeId.includes('hekman') ? (
                          <BookOpen className="w-5 h-5" />
                        ) : item.placeId.includes('dining') || item.placeId.includes('commons') ? (
                          <Utensils className="w-5 h-5" />
                        ) : (
                          <Coffee className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-stone-900 leading-tight">
                          {item.placeName}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5 text-[11px] text-stone-500">
                          <span>{item.subLocation}</span>
                          <span>•</span>
                          <span>{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-[#ffdeae]/40 text-[#7f5700] px-2 py-0.5 rounded-full text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#D99B26] text-[#D99B26]" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    <span className="px-2 py-0.5 rounded-md bg-[#FFF4DB] text-[#C5832B] text-[10px] font-bold flex items-center gap-1">
                      <Users className="w-3 h-3" /> {item.capacityPercent}% Capacity
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium">
                      {item.noiseLevel}
                    </span>
                    {item.tags.map((tg) => (
                      <span
                        key={tg}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] font-medium"
                      >
                        {tg}
                      </span>
                    ))}
                  </div>

                  {/* Comment */}
                  {isEditing ? (
                    <div className="space-y-1.5">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-stone-50"
                        rows={2}
                      />
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setEditingRatingId(null)}
                          className="px-2.5 py-1 text-xs text-stone-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(item)}
                          className="px-3 py-1 bg-[#6A1A24] text-white rounded-md text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-800 bg-[#FAF7F5] p-2.5 rounded-xl border border-stone-200/60 leading-relaxed italic">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  )}

                  {/* Helpfulness counter and actions */}
                  <div className="flex items-center justify-between pt-1 text-xs text-stone-500 border-t border-stone-100">
                    <button
                      onClick={() => onUpvoteRating(item.id)}
                      className={`flex items-center gap-1 text-xs font-semibold active:scale-95 transition-all ${
                        item.hasVotedHelpful
                          ? 'text-[#2E6B38] font-bold'
                          : 'text-stone-500 hover:text-[#2E6B38]'
                      }`}
                    >
                      <ThumbsUp
                        className={`w-3.5 h-3.5 ${
                          item.hasVotedHelpful ? 'fill-[#2E6B38]' : ''
                        }`}
                      />
                      <span>{item.helpfulVotes} students found helpful</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(item)}
                        className="text-stone-400 hover:text-stone-700 flex items-center gap-0.5 text-[11px] font-semibold"
                      >
                        <Edit3 className="w-3 h-3" /> Edit
                      </button>
                      <button
                        onClick={() => onDeleteRating(item.id)}
                        className="text-rose-500 hover:text-rose-700 flex items-center gap-0.5 text-[11px] font-semibold"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTabFilter === 'archived' && (
          <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
            No archived reviews. All your recent submissions are currently active on the campus pulse feed!
          </div>
        )}
      </div>

      {/* Community Guidelines Micro Banner */}
      <div className="text-center py-2">
        <p className="text-[11px] text-stone-400 leading-relaxed max-w-xs mx-auto">
          Calvin University Honor Code applies. Ratings help maintain wholesome, flourishing spaces for all.
        </p>
      </div>
    </div>
  );
};
