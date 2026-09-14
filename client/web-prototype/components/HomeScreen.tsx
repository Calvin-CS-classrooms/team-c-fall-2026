import React, { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ArrowRight,
  Star,
  Users,
  Clock,
  Volume2,
  Flame,
  Utensils,
  Lightbulb,
  CheckCircle,
  Navigation,
} from 'lucide-react';
import { Place, UserProfile } from '../types';

interface HomeScreenProps {
  user: UserProfile;
  places: Place[];
  onOpenRateModal: (placeId?: string, subLocation?: string) => void;
  onNavigateToPlace: (place: Place) => void;
  onSelectPlaceForDetail: (place: Place) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  places,
  onOpenRateModal,
  onNavigateToPlace,
  onSelectPlaceForDetail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'quiet' | 'trending' | 'dining'>('all');
  const [detectedLocation, setDetectedLocation] = useState<{ id: string; name: string; area: string }>({
    id: 'hekman-card',
    name: 'Hekman Library • Floor 2',
    area: 'Study Commons • Noise & Crowd check',
  });
  const [isChangingLocation, setIsChangingLocation] = useState(false);

  // Filter places according to search & quick filter pills
  const filteredPlaces = places.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentGuide.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'quiet') return p.busyStatus === 'quiet';
    if (activeFilter === 'trending') return p.busyLevel >= 60;
    if (activeFilter === 'dining') return p.category === 'dining';
    if (activeFilter === 'open') return true;
    return true;
  });

  // Carousel spots
  const popularSpots = places.slice(0, 5);

  const getStatusBadge = (place: Place) => {
    if (place.busyStatus === 'busy') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold shadow-xs">
          <Users className="w-3 h-3" />
          {place.busyLabel}
        </span>
      );
    }
    if (place.busyStatus === 'moderate') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFF4DB] text-[#C5832B] text-[10px] font-bold shadow-xs">
          <Clock className="w-3 h-3" />
          {place.busyLabel}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAF5EC] text-[#2E6B38] text-[10px] font-bold shadow-xs">
        <Volume2 className="w-3 h-3" />
        {place.busyLabel}
      </span>
    );
  };

  return (
    <div className="w-full flex flex-col gap-5 px-4 pt-4 pb-6 bg-[#FAF7F5]">
      {/* Greeting & Student Badge Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Welcome, {user.name.split(' ')[0]}!
            </h1>
            <span className="text-sm font-semibold text-stone-500">
              ({user.classYear.replace('Class of ', "'")})
            </span>
          </div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E6B38]/10 text-[#2E6B38] text-[11px] font-bold tracking-wide">
            <CheckCircle className="w-3.5 h-3.5 fill-[#2E6B38] text-white" />
            Verified Student
          </span>
        </div>
        <p className="text-xs text-stone-500 flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#2E6B38] animate-pulse" />
          Calvin University Campus Pulse • Sunny 64°F
        </p>
      </div>

      {/* Search Bar & Quick Filter Pills */}
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center w-full shadow-xs rounded-xl overflow-hidden bg-white border border-stone-200">
          <Search className="absolute left-3.5 text-stone-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, halls, dining, or spots..."
            className="w-full pl-10 pr-10 py-2.5 bg-transparent text-xs font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              Clear
            </button>
          ) : (
            <button
              aria-label="Filter options"
              className="absolute right-3 text-stone-400 hover:text-stone-700"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setActiveFilter(activeFilter === 'open' ? 'all' : 'open')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs active:scale-95 transition-all shrink-0 ${
              activeFilter === 'open'
                ? 'bg-[#6A1A24] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#2E6B38]" />
            Now Open
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === 'quiet' ? 'all' : 'quiet')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs active:scale-95 transition-all shrink-0 ${
              activeFilter === 'quiet'
                ? 'bg-[#6A1A24] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D99B26]" />
            Quiet Spots
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === 'trending' ? 'all' : 'trending')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs active:scale-95 transition-all shrink-0 ${
              activeFilter === 'trending'
                ? 'bg-[#6A1A24] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-[#ba1a1a]" />
            Trending
          </button>
          <button
            onClick={() => setActiveFilter(activeFilter === 'dining' ? 'all' : 'dining')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-2xs active:scale-95 transition-all shrink-0 ${
              activeFilter === 'dining'
                ? 'bg-[#6A1A24] text-white'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-[#C5832B]" />
            Dining
          </button>
        </div>
      </div>

      {/* Rate Location Hero CTA Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#4c0311] text-white shadow-md p-4 flex flex-col gap-2.5">
        {/* Glow */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#D99B26]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-5 h-5 text-[#D99B26] fill-[#D99B26] animate-bounce" />
            <span className="text-xs font-bold tracking-wider text-[#D99B26] uppercase">
              Rate Your Current Location
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-[#D99B26]/20 text-[#fdba45] text-[10px] font-bold uppercase tracking-wider">
            Active GPS
          </span>
        </div>

        <div className="flex items-center justify-between bg-[#6a1a24]/90 backdrop-blur-xs rounded-xl p-3 border border-white/10">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-sm font-bold text-white truncate">
              {detectedLocation.name}
            </span>
            <span className="text-[11px] text-[#ffdada]">
              {detectedLocation.area}
            </span>
          </div>
          <button
            onClick={() => onOpenRateModal(detectedLocation.id, detectedLocation.area)}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-[#D99B26] hover:bg-[#c98e1f] active:scale-95 text-[#4c0311] font-bold text-xs shadow-sm transition-all flex items-center gap-1"
          >
            <span>Rate</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Change location popover or quick selector */}
        {isChangingLocation && (
          <div className="bg-black/40 rounded-xl p-2.5 space-y-1.5 animate-in fade-in">
            <span className="text-[10px] font-bold text-[#D99B26] uppercase">
              Select Current Campus Zone:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {places.slice(0, 4).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setDetectedLocation({
                      id: p.id,
                      name: `${p.name} • Main`,
                      area: p.studentGuide.slice(0, 32) + '...',
                    });
                    setIsChangingLocation(false);
                  }}
                  className="px-2 py-1.5 rounded bg-white/10 hover:bg-white/20 text-left text-[11px] text-white truncate"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-[#ffdada]/90">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-[#D99B26]" />
            Updated 3 mins ago by 24 students
          </span>
          <button
            onClick={() => setIsChangingLocation(!isChangingLocation)}
            className="underline decoration-[#D99B26]/60 hover:text-white cursor-pointer font-medium"
          >
            {isChangingLocation ? 'Cancel' : 'Change location'}
          </button>
        </div>
      </div>

      {/* Section: Popular On-Campus Today */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <h2 className="text-base font-bold text-stone-900">Popular On-Campus Today</h2>
            <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping" />
          </div>
          <button
            onClick={() => onSelectPlaceForDetail(popularSpots[0])}
            className="text-xs font-semibold text-[#D99B26] hover:text-[#590014] flex items-center"
          >
            See all →
          </button>
        </div>

        {/* Horizontal Carousel */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
          {popularSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSelectPlaceForDetail(spot)}
              className="min-w-[240px] max-w-[240px] flex flex-col bg-white rounded-xl overflow-hidden shadow-xs border border-stone-200/80 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer shrink-0"
            >
              <div className="relative h-32 w-full bg-stone-100">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 right-2.5">
                  {getStatusBadge(spot)}
                </div>
                {spot.specialBadge && (
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-[#590014]/85 text-white text-[10px] font-bold backdrop-blur-2xs">
                    {spot.specialBadge}
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col gap-1 flex-1 justify-between">
                <div>
                  <span className="text-sm font-bold text-stone-900 truncate block">
                    {spot.name}
                  </span>
                  <span className="text-[11px] text-stone-500 line-clamp-1">
                    {spot.studentGuide}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-stone-100 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#D99B26] text-[#D99B26]" />
                    <span className="text-xs font-bold text-stone-800">{spot.rating}</span>
                    <span className="text-[10px] text-stone-400">({spot.reviewCount})</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#2E6B38] bg-emerald-50 px-1.5 py-0.5 rounded">
                    {spot.hours}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Top Rated Places & Events (Vertical List) */}
      <div className="flex flex-col gap-2.5 pb-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">Top Rated Places & Events</h2>
          <span className="text-xs text-stone-500">Real-time Student Feed</span>
        </div>

        <div className="flex flex-col gap-3">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlaceForDetail(place)}
              className="flex gap-3 p-3 bg-white rounded-xl shadow-xs border border-stone-200/80 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
            >
              <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-stone-100 relative">
                <img
                  src={place.image}
                  alt={place.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-stone-900 truncate">
                      {place.name}
                    </span>
                    <span className="shrink-0">
                      {getStatusBadge(place)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex items-center text-[#D99B26]">
                      <Star className="w-3.5 h-3.5 fill-[#D99B26]" />
                      <span className="text-xs font-bold text-stone-800 ml-1">
                        {place.rating}
                      </span>
                    </div>
                    <span className="text-stone-300">•</span>
                    <span className="text-[11px] text-stone-500 truncate">
                      {place.amenityHighlights}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-500 line-clamp-1 mt-1">
                  {place.studentGuide}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Campus Fact & Quick Suggestion Footer Card */}
        <div className="p-3.5 rounded-xl bg-white border border-stone-200 flex items-center justify-between mt-1 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#590014] text-[#D99B26] flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-stone-800">
                Looking for silent study?
              </span>
              <span className="text-[11px] text-stone-500">
                Hekman 4th floor quiet pods have 12 open desks right now.
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigateToPlace(places[0])}
            className="text-xs font-bold text-[#6A1A24] hover:underline flex items-center gap-1 shrink-0 ml-2"
          >
            <Navigation className="w-3 h-3" />
            Navigate
          </button>
        </div>
      </div>
    </div>
  );
};
