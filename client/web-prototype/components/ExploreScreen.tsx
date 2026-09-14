import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  Coffee,
  Sparkles,
  Dumbbell,
  Church,
  MapPin,
  Map as MapIcon,
  List,
  Star,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Volume2,
  Zap,
  Navigation,
  Clock,
  CreditCard,
  PlusCircle,
  X,
  Compass,
  Check,
} from 'lucide-react';
import { Place, CategoryType } from '../types';

interface ExploreScreenProps {
  places: Place[];
  onToggleFavorite: (placeId: string) => void;
  onOpenRateModal: (placeId: string, subLocation: string) => void;
  onNavigateToPlace: (place: Place) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  places,
  onToggleFavorite,
  onOpenRateModal,
  onNavigateToPlace,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [expandedFloorId, setExpandedFloorId] = useState<string | null>(null);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [modalType, setModalType] = useState<'menu' | 'schedule' | 'service' | 'addSpot' | null>(null);
  const [activeModalPlace, setActiveModalPlace] = useState<Place | null>(null);

  // New spot form state
  const [newSpotName, setNewSpotName] = useState('');
  const [newSpotCategory, setNewSpotCategory] = useState<'study' | 'dining' | 'athletics' | 'events' | 'chapel'>('study');
  const [newSpotLocation, setNewSpotLocation] = useState('');
  const [newSpotSuccess, setNewSpotSuccess] = useState(false);

  const categories: { id: CategoryType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: null },
    { id: 'study', label: 'Study & Quiet', icon: <BookOpen className="w-3.5 h-3.5 text-[#C5832B]" /> },
    { id: 'dining', label: 'Dining & Cafes', icon: <Coffee className="w-3.5 h-3.5 text-[#D99B26]" /> },
    { id: 'events', label: 'Live Events', icon: <Sparkles className="w-3.5 h-3.5 text-[#f87b84]" /> },
    { id: 'athletics', label: 'Athletics & Rec', icon: <Dumbbell className="w-3.5 h-3.5 text-[#2E6B38]" /> },
    { id: 'chapel', label: 'Chapel & Arts', icon: <Church className="w-3.5 h-3.5 text-[#6A1A24]" /> },
  ];

  const filteredPlaces = places.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentGuide.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handlePinClick = (cardId: string) => {
    setHighlightedCardId(cardId);
    const element = document.getElementById(cardId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedCardId(null);
    }, 2000);
  };

  const handleAddSpotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpotName.trim()) return;
    setNewSpotSuccess(true);
    setTimeout(() => {
      setNewSpotSuccess(false);
      setModalType(null);
      setNewSpotName('');
      setNewSpotLocation('');
    }, 1200);
  };

  return (
    <div className="w-full flex flex-col bg-[#FAF7F5] min-h-full pb-8">
      {/* Sticky Search & Discovery Filter Bar */}
      <div className="sticky top-0 z-30 bg-[#FAF7F5]/95 backdrop-blur-md px-4 pt-3 pb-2 shadow-xs border-b border-stone-200/60">
        {/* Search Input */}
        <div className="relative flex items-center w-full">
          <Search className="absolute left-3.5 text-stone-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search buildings, dining, study spots, events..."
            className="w-full h-10 pl-10 pr-9 rounded-xl bg-stone-100/90 text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#D99B26] border border-stone-200 shadow-2xs transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 -mx-4 px-4">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all shadow-2xs shrink-0 ${
                  isActive
                    ? 'bg-[#4c0311] text-white font-bold'
                    : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-50 font-medium'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 flex flex-col gap-4 pt-3">
        {/* Live Geolocation Pill Bar */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200 shadow-2xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#4c0311]/10 text-[#4c0311] shrink-0">
              <Compass className="w-4 h-4" />
              <span className="absolute w-2 h-2 rounded-full bg-[#D99B26] animate-ping" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                Detected Location
              </span>
              <p className="text-xs font-bold text-stone-800 truncate">
                On-Campus • North Lawn Commons
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsCheckedIn(!isCheckedIn)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              isCheckedIn
                ? 'bg-[#2E6B38] text-white'
                : 'bg-[#ffdada] text-[#4c0311] hover:bg-[#ffb3b5]'
            }`}
          >
            {isCheckedIn ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Checked In</span>
              </>
            ) : (
              <span>Check-in</span>
            )}
          </button>
        </div>

        {/* Campus Map Interactive Overview Card */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapIcon className="text-[#D99B26] w-4 h-4" />
              <h2 className="text-sm font-bold text-stone-900">Campus Density Map</h2>
            </div>

            {/* List vs Map view toggle switch */}
            <div className="flex items-center p-0.5 rounded-lg bg-stone-200 shadow-inner">
              <button
                onClick={() => setViewMode('map')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'map'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'list'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>
            </div>
          </div>

          {/* Stylized Interactive Map Card */}
          {viewMode === 'map' && (
            <div className="relative w-full h-56 rounded-2xl overflow-hidden shadow-md bg-stone-800 select-none border border-stone-300">
              {/* Aerial Map Background */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center brightness-[0.92] contrast-[1.05]"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_BIBNP9lZXwjepVtnHQwQOSZBLB74QcUpjWsQyhx7W9huQh8BP1GxAledXDmgxeDHFMtNFojF_WxPIPz6bjifuHXPLwGURCARJMoIX9k5IKm_Df4ExHmdI5GZWcvkrlzzQjUMDciDYx2c8mcXKkNj2YQ01e_hXyLSEihCOH25Ekk6BEe1QVTV4LFrpmxHemlkZ8RukqbsO8LZwdyJGfMh3U5krnhvfExNn2wRlej2xX_zriCQQ7U')",
                }}
              />
              {/* Soft Tinted University Grid Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#590014]/80 via-[#590014]/25 to-transparent" />

              {/* Pin 1: Hekman Library (High 85%) */}
              <button
                onClick={() => handlePinClick('hekman-card')}
                className="absolute top-10 left-[22%] -translate-x-1/2 flex flex-col items-center group cursor-pointer active:scale-95 transition-transform z-10"
              >
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#BA1A1A] text-white shadow-lg ring-2 ring-white">
                  <BookOpen className="w-3 h-3" />
                  <span className="text-[10px] font-bold">85% Busy</span>
                </div>
                <div className="w-1.5 h-2 bg-[#BA1A1A] -mt-0.5" />
                <span className="mt-0.5 text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  Hekman
                </span>
              </button>

              {/* Pin 2: Spoelhof / Peet's (30%) */}
              <button
                onClick={() => handlePinClick('peets-card')}
                className="absolute top-16 right-[24%] translate-x-1/2 flex flex-col items-center group cursor-pointer active:scale-95 transition-transform z-10"
              >
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D99B26] text-stone-900 shadow-lg ring-2 ring-white">
                  <Coffee className="w-3 h-3" />
                  <span className="text-[10px] font-bold">Peet's • 30%</span>
                </div>
                <div className="w-1.5 h-2 bg-[#D99B26] -mt-0.5" />
                <span className="mt-0.5 text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  Spoelhof
                </span>
              </button>

              {/* Pin 3: Calvin Chapel */}
              <button
                onClick={() => handlePinClick('chapel-card')}
                className="absolute bottom-10 left-[34%] -translate-x-1/2 flex flex-col items-center group cursor-pointer active:scale-95 transition-transform z-10"
              >
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#fdba45] text-[#281900] shadow-lg ring-2 ring-white">
                  <Church className="w-3 h-3" />
                  <span className="text-[10px] font-bold">LOFT 9 PM</span>
                </div>
                <div className="w-1.5 h-2 bg-[#fdba45] -mt-0.5" />
                <span className="mt-0.5 text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  Chapel
                </span>
              </button>

              {/* Pin 4: Van Noord Arena */}
              <button
                onClick={() => handlePinClick('vannoord-card')}
                className="absolute bottom-11 right-[22%] flex flex-col items-center group cursor-pointer active:scale-95 transition-transform z-10"
              >
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2E6B38] text-white shadow-lg ring-2 ring-white">
                  <Dumbbell className="w-3 h-3" />
                  <span className="text-[10px] font-bold">Fieldhouse</span>
                </div>
                <div className="w-1.5 h-2 bg-[#2E6B38] -mt-0.5" />
                <span className="mt-0.5 text-[10px] font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  Van Noord
                </span>
              </button>

              {/* Map Floating Legend */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-md text-stone-800 text-[10px] font-bold shadow-md border border-stone-100">
                <span className="flex items-center gap-1 text-stone-600">
                  <span className="w-2 h-2 rounded-full bg-[#2E6B38]" /> Quiet
                </span>
                <span className="flex items-center gap-1 text-stone-600">
                  <span className="w-2 h-2 rounded-full bg-[#D99B26]" /> Moderate
                </span>
                <span className="flex items-center gap-1 text-stone-600">
                  <span className="w-2 h-2 rounded-full bg-[#BA1A1A]" /> Busy
                </span>
                <span className="flex items-center gap-1 text-[#4c0311] font-black">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D99B26] animate-ping" /> Live GPS
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Landmark Directory & Guide */}
        <section className="flex flex-col gap-3">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">Campus Directory & Guide</h2>
              <p className="text-xs text-stone-500">
                Insider student tips, crowd capacity & best study hours
              </p>
            </div>
            <span className="text-[10px] font-bold text-[#D99B26] uppercase">
              {filteredPlaces.length} SPOTS FOUND
            </span>
          </div>

          {/* Directory Cards Grid */}
          <div className="flex flex-col gap-4">
            {filteredPlaces.map((place) => {
              const isExpanded = expandedFloorId === place.id;
              const isCardHighlighted = highlightedCardId === place.id;

              return (
                <article
                  key={place.id}
                  id={place.id}
                  className={`flex flex-col rounded-2xl bg-white border border-stone-200/90 shadow-xs overflow-hidden transition-all duration-300 ${
                    isCardHighlighted
                      ? 'ring-4 ring-[#D99B26] shadow-xl scale-[1.01]'
                      : 'hover:shadow-md'
                  }`}
                >
                  {/* Card Image Banner */}
                  <div className="relative w-full h-40 bg-stone-100">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Star Rating Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md shadow-xs text-xs font-bold text-stone-800">
                      <Star className="w-3.5 h-3.5 fill-[#D99B26] text-[#D99B26]" />
                      <span>{place.rating}</span>
                      <span className="text-stone-400 font-normal">({place.reviewCount})</span>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute top-3 right-3">
                      {place.busyStatus === 'busy' && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-pulse" />
                          <span>{place.busyLabel}</span>
                        </div>
                      )}
                      {place.busyStatus === 'moderate' && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF4DB] text-[#C5832B] text-[10px] font-bold shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#D99B26]" />
                          <span>{place.busyLabel}</span>
                        </div>
                      )}
                      {place.busyStatus === 'quiet' && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF5EC] text-[#2E6B38] text-[10px] font-bold shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-[#2E6B38]" />
                          <span>{place.busyLabel}</span>
                        </div>
                      )}
                    </div>

                    {place.specialBadge && (
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-[#590014]/85 text-white text-[10px] font-bold backdrop-blur-2xs">
                        {place.specialBadge}
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 flex flex-col gap-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-stone-900 leading-tight">
                          {place.name}
                        </h3>
                        <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#6A1A24]" />
                          {place.subLocation}
                        </p>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={() => onToggleFavorite(place.id)}
                        aria-label="Save to Favorites"
                        className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-95 ${
                          place.isFavorite
                            ? 'bg-[#6A1A24] text-[#D99B26]'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {place.isFavorite ? (
                          <BookmarkCheck className="w-5 h-5 fill-[#D99B26]" />
                        ) : (
                          <Bookmark className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    {/* Student Insider Guide Highlight Box */}
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[#4c0311] text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5 text-[#D99B26]" />
                        <span>Student Insider Guide</span>
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed">
                        {place.studentGuide}
                      </p>
                    </div>

                    {/* Specs / Badges row */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-100/90">
                        <Volume2 className="w-4 h-4 text-[#2E6B38] shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-stone-400 font-semibold uppercase">
                            Noise Level
                          </span>
                          <span className="text-xs font-bold text-stone-800 truncate">
                            {place.noiseLevel}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-lg bg-stone-100/90">
                        <Zap className="w-4 h-4 text-[#C5832B] shrink-0" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-[10px] text-stone-400 font-semibold uppercase">
                            Amenities
                          </span>
                          <span className="text-xs font-bold text-stone-800 truncate">
                            {place.amenityHighlights}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Floor-by-Floor Breakdown */}
                    {place.floors && place.floors.length > 0 && (
                      <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50">
                        <button
                          onClick={() => setExpandedFloorId(isExpanded ? null : place.id)}
                          className="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors"
                        >
                          <span>Floor-by-Floor Noise & Capacity</span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-stone-500" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-stone-500" />
                          )}
                        </button>

                        {isExpanded && (
                          <div className="px-3 pb-3 space-y-2 border-t border-stone-200 pt-2 bg-white">
                            {place.floors.map((fl) => (
                              <div
                                key={fl.floor}
                                className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-0"
                              >
                                <div>
                                  <span className="font-bold text-stone-800 block">
                                    {fl.floor}: {fl.name}
                                  </span>
                                  <span className="text-[10px] text-stone-500">
                                    {fl.noise} • {fl.openSeats} seats open
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      fl.capacity > 75
                                        ? 'bg-rose-100 text-rose-800'
                                        : fl.capacity > 40
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    {fl.capacity}% Busy
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Row */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onOpenRateModal(place.id, place.subLocation)}
                        className="flex-1 py-2 rounded-xl bg-[#4c0311] hover:bg-[#6a1a24] text-white font-bold text-xs shadow-xs active:scale-98 transition-all text-center"
                      >
                        Rate This Spot
                      </button>

                      {place.id === 'peets-card' ? (
                        <button
                          onClick={() => {
                            setActiveModalPlace(place);
                            setModalType('menu');
                          }}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1"
                        >
                          <Coffee className="w-3.5 h-3.5 text-[#D99B26]" />
                          <span>Menu</span>
                        </button>
                      ) : place.id === 'vannoord-card' ? (
                        <button
                          onClick={() => {
                            setActiveModalPlace(place);
                            setModalType('schedule');
                          }}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1"
                        >
                          <Clock className="w-3.5 h-3.5 text-[#2E6B38]" />
                          <span>Schedule</span>
                        </button>
                      ) : place.id === 'chapel-card' ? (
                        <button
                          onClick={() => {
                            setActiveModalPlace(place);
                            setModalType('service');
                          }}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1"
                        >
                          <Church className="w-3.5 h-3.5 text-[#6A1A24]" />
                          <span>Services</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onNavigateToPlace(place)}
                          className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1"
                        >
                          <Navigation className="w-3.5 h-3.5 text-[#6A1A24]" />
                          <span>Navigate</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Empty Search State */}
          {filteredPlaces.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-stone-200 text-center gap-2 shadow-xs my-3">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-stone-800">
                No campus spots match your query
              </h4>
              <p className="text-xs text-stone-500 max-w-xs">
                Try searching for another building, hall, cafe, or tap &quot;All&quot; to reset filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 px-4 py-1.5 rounded-full bg-[#4c0311] text-white font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Suggest New Spot Card */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#eae0e1]/70 border border-stone-300/80 text-stone-900 shadow-2xs mb-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D99B26]/20 flex items-center justify-center text-[#C5832B] shrink-0">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900">New spot on campus?</h4>
              <p className="text-[11px] text-stone-600">Suggest a student lounge or pop-up event</p>
            </div>
          </div>
          <button
            onClick={() => setModalType('addSpot')}
            className="px-3 py-1.5 rounded-lg bg-[#590014] text-[#D99B26] text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs hover:brightness-110 active:scale-95"
          >
            + Add Spot
          </button>
        </div>
      </div>

      {/* Pop-up Modals for Menu, Schedule, Service times, Add Spot */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-bold text-sm text-[#4c0311]">
                {modalType === 'menu' && "Peet's Coffee • Spoelhof Menu"}
                {modalType === 'schedule' && 'Van Noord Arena • Open Rec Hours'}
                {modalType === 'service' && 'Calvin Chapel • Services & Gatherings'}
                {modalType === 'addSpot' && 'Suggest New Campus Spot'}
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 text-xs text-stone-700 space-y-3">
              {modalType === 'menu' && (
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Major Dickason's Cold Brew</span>
                    <span className="font-bold text-[#C5832B]">$4.25 / 1 Sw</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Iced Caramel Macchiato</span>
                    <span className="font-bold text-[#C5832B]">$4.85</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Blueberry Scone & Muffin</span>
                    <span className="font-bold text-[#C5832B]">$3.50</span>
                  </div>
                  <p className="text-[11px] text-stone-500 pt-1">
                    Accepts Knightly Dining Dollars, Meal Swipes, and Apple Pay.
                  </p>
                </div>
              )}

              {modalType === 'schedule' && (
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Climbing Wall Open Hours</span>
                    <span className="font-bold text-[#2E6B38]">4:00 PM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Weight Room Access</span>
                    <span className="font-bold text-[#2E6B38]">6:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Pickup Basketball (Court 2)</span>
                    <span className="font-bold text-[#2E6B38]">Open All Day</span>
                  </div>
                </div>
              )}

              {modalType === 'service' && (
                <div className="space-y-2">
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Daily Campus Chapel</span>
                    <span className="font-bold text-[#6A1A24]">10:00 AM - 10:20 AM</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">LOFT Evening Praise</span>
                    <span className="font-bold text-[#6A1A24]">Wednesdays 9:00 PM</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="font-semibold">Quiet Prayer Room (Lower)</span>
                    <span className="font-bold text-[#6A1A24]">Always Open</span>
                  </div>
                </div>
              )}

              {modalType === 'addSpot' && (
                <form onSubmit={handleAddSpotSubmit} className="space-y-3">
                  {newSpotSuccess ? (
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold">
                      Spot suggested! Calvin student ambassadors will verify shortly.
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                          Spot Name
                        </label>
                        <input
                          type="text"
                          required
                          value={newSpotName}
                          onChange={(e) => setNewSpotName(e.target.value)}
                          placeholder="e.g. DeVries 3rd Floor Solarium"
                          className="w-full px-3 py-2 border rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                          Category
                        </label>
                        <select
                          value={newSpotCategory}
                          onChange={(e) => setNewSpotCategory(e.target.value as any)}
                          className="w-full px-3 py-2 border rounded-lg text-xs"
                        >
                          <option value="study">Study & Quiet</option>
                          <option value="dining">Dining & Cafes</option>
                          <option value="athletics">Athletics & Rec</option>
                          <option value="events">Live Events</option>
                          <option value="chapel">Chapel & Arts</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-stone-500 mb-1">
                          Location / Building
                        </label>
                        <input
                          type="text"
                          value={newSpotLocation}
                          onChange={(e) => setNewSpotLocation(e.target.value)}
                          placeholder="e.g. Near greenhouse doors"
                          className="w-full px-3 py-2 border rounded-lg text-xs"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#4c0311] text-[#D99B26] font-bold text-xs"
                      >
                        Submit Campus Spot
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>

            {modalType !== 'addSpot' && (
              <button
                onClick={() => setModalType(null)}
                className="w-full py-2 rounded-xl bg-stone-100 font-bold text-stone-700 text-xs mt-2"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
