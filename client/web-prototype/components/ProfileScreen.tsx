import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  Shield,
  Terminal,
  BadgeCheck,
  Lock,
  ExternalLink,
  ChevronRight,
  MapPin,
  EyeOff,
  BellRing,
  Heart,
  BookOpen,
  Scale,
  Headphones,
  LogOut,
  Coffee,
  Dumbbell,
  AlertCircle,
} from 'lucide-react';
import { UserProfile, Place } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  places: Place[];
  onUpdatePrivacy: (key: keyof UserProfile['privacy']) => void;
  onToggleFavorite: (placeId: string) => void;
  onNavigateToPlace: (place: Place) => void;
  onSignOut: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  places,
  onUpdatePrivacy,
  onToggleFavorite,
  onNavigateToPlace,
  onSignOut,
}) => {
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [resourceModal, setResourceModal] = useState<string | null>(null);

  const favoritePlaces = places.filter((p) => p.isFavorite);

  return (
    <div className="w-full flex flex-col gap-5 px-4 pt-4 pb-10 bg-[#FAF7F5]">
      {/* Profile Showcase Bento Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-stone-200/90 shadow-sm">
        {/* Decorative Maroon Header Accent */}
        <div className="h-20 bg-gradient-to-r from-[#4c0311] via-[#6a1a24] to-[#590014] relative flex items-start justify-end p-3">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fdba45_1px,transparent_1px)] [background-size:12px_12px]" />
          <div className="relative px-3 py-1 rounded-full bg-[#fdba45] text-[#281900] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Class of 2026</span>
          </div>
        </div>

        {/* Avatar & Identity */}
        <div className="px-4 pb-4 pt-0 relative">
          <div className="flex items-end justify-between -mt-10 mb-3">
            <div className="relative">
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover shadow-md ring-4 ring-white bg-white"
              />
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#2E6B38] text-white flex items-center justify-center shadow-xs ring-2 ring-white">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 bg-[#FAF7F5] border border-stone-200/80 px-3.5 py-1.5 rounded-full shadow-2xs">
              <div className="text-center">
                <p className="text-sm font-black text-[#4c0311] leading-none">
                  {user.ratingsCount}
                </p>
                <p className="text-[10px] font-semibold text-stone-500 mt-0.5">
                  Ratings
                </p>
              </div>
              <div className="w-px h-5 bg-stone-300" />
              <div className="text-center">
                <p className="text-sm font-black text-[#D99B26] leading-none">
                  4.9
                </p>
                <p className="text-[10px] font-semibold text-stone-500 mt-0.5">
                  Impact
                </p>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-lg font-bold text-stone-900 tracking-tight">
              {user.name}
            </h1>
            <p className="text-xs font-semibold text-stone-600 mt-0.5">
              Calvin University • {user.classYear}
            </p>
            <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#C5832B]" />
              <span>{user.major}</span>
            </p>
          </div>

          {/* Verified Badge Banner */}
          <div className="mt-3.5 p-3 rounded-xl bg-[#FAF7F5] border border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#2E6B38]/15 text-[#2E6B38] flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-stone-900 truncate">
                    Verified Calvin Knight
                  </span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E6B38]" />
                </div>
                <p className="text-[11px] text-stone-500 truncate">
                  {user.email} SSO Verified
                </p>
              </div>
            </div>
            <BadgeCheck className="text-stone-400 w-5 h-5 shrink-0" />
          </div>
        </div>
      </div>

      {/* Membership Proof & Access */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-[#D99B26]" />
            Membership Proof & Access
          </h2>
          <span className="text-[10px] font-bold text-[#2E6B38] uppercase bg-[#EAF5EC] px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        <div className="rounded-2xl bg-white border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2E6B38] animate-pulse" />
                <p className="text-xs font-bold text-stone-900">
                  Active Student Membership
                </p>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Calvin Student ID: <span className="font-bold text-stone-800">{user.studentId}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-medium text-stone-400 block">
                Expires
              </span>
              <span className="text-xs font-bold text-[#590014]">
                Valid May 2026
              </span>
            </div>
          </div>

          {/* Explanatory SSO notice */}
          <div className="p-3 rounded-xl bg-[#fcf1f2] border border-[#dbc0c0] flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-[#4c0311] shrink-0 mt-0.5" />
            <p className="text-xs text-stone-700 leading-relaxed">
              <strong className="text-[#4c0311]">Calvin Single Sign-On (SSO)</strong> authentication guarantees only currently enrolled students and campus staff can post ratings. This maintains authentic crowd statistics and eliminates spam.
            </p>
          </div>

          {/* Security Proof Token Bar */}
          <div className="flex items-center justify-between pt-1 text-stone-500 text-xs">
            <span className="text-[11px] flex items-center gap-1 text-[#2E6B38] font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Identity Token Synced Today
            </span>
            <button
              onClick={() => alert('Calvin SSO Portal: Valid and authenticated.')}
              className="text-xs text-[#6A1A24] hover:underline font-bold"
            >
              SSO Portal →
            </button>
          </div>
        </div>
      </div>

      {/* Preferences & Telemetry */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#4c0311]" />
          Preferences & Telemetry
        </h2>

        <div className="rounded-2xl bg-white border border-stone-200 p-4 shadow-xs space-y-3.5">
          {/* Toggle 1: Geolocation */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#4c0311]" />
                <p className="text-xs font-bold text-stone-900">Campus Geolocation</p>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Auto-detects when you walk into Hekman, Commons, or Spoelhof for 1-tap rating prompts.
              </p>
            </div>

            <button
              onClick={() => onUpdatePrivacy('geolocation')}
              className={`w-12 h-6 rounded-full relative flex items-center px-0.5 transition-colors focus:outline-none shrink-0 cursor-pointer ${
                user.privacy.geolocation ? 'bg-[#6a1a24]' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  user.privacy.geolocation ? 'translate-x-6 bg-[#fdba45]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-stone-100" />

          {/* Toggle 2: Anonymous Mode */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <EyeOff className="w-4 h-4 text-[#C5832B]" />
                <p className="text-xs font-bold text-stone-900">Anonymous Mode</p>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Conceal your name & avatar on live busyness reports and public event feeds.
              </p>
            </div>

            <button
              onClick={() => onUpdatePrivacy('anonymousMode')}
              className={`w-12 h-6 rounded-full relative flex items-center px-0.5 transition-colors focus:outline-none shrink-0 cursor-pointer ${
                user.privacy.anonymousMode ? 'bg-[#6a1a24]' : 'bg-stone-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                  user.privacy.anonymousMode ? 'translate-x-6 bg-[#fdba45]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="h-px bg-stone-100" />

          {/* Smart Library Alert */}
          <div className="rounded-xl bg-[#FAF7F5] border border-stone-200/80 p-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <BellRing className="w-5 h-5 text-[#D99B26] shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">
                  Smart Library Alert
                </p>
                <p className="text-[11px] text-stone-500 truncate">
                  Alert me when Hekman Library drops below 50% capacity
                </p>
              </div>
            </div>

            <button
              onClick={() => onUpdatePrivacy('capacityAlerts')}
              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all shrink-0 ${
                user.privacy.capacityAlerts
                  ? 'bg-[#EAF5EC] text-[#2E6B38]'
                  : 'bg-stone-200 text-stone-600'
              }`}
            >
              {user.privacy.capacityAlerts ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>

      {/* Favorite Campus Spots Shelf */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-[#590014] fill-[#590014]" />
            Favorite Campus Spots
          </h2>
          <span className="text-xs text-stone-400 font-semibold">
            {favoritePlaces.length} pinned
          </span>
        </div>

        <div className="space-y-2">
          {favoritePlaces.map((place) => (
            <div
              key={place.id}
              className="rounded-2xl bg-white border border-stone-200 p-3 flex items-center justify-between shadow-2xs hover:shadow-xs transition-shadow"
            >
              <button
                onClick={() => onNavigateToPlace(place)}
                className="flex items-center gap-3 min-w-0 text-left flex-1"
              >
                <div className="w-11 h-11 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                  {place.id.includes('hekman') ? (
                    <BookOpen className="w-5 h-5 text-[#4c0311]" />
                  ) : place.id.includes('peets') ? (
                    <Coffee className="w-5 h-5 text-[#C5832B]" />
                  ) : (
                    <Dumbbell className="w-5 h-5 text-[#2E6B38]" />
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-stone-900 truncate">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5 text-[11px]">
                    <span
                      className={`font-semibold ${
                        place.busyStatus === 'busy'
                          ? 'text-[#ba1a1a]'
                          : place.busyStatus === 'moderate'
                          ? 'text-[#C5832B]'
                          : 'text-[#2E6B38]'
                      }`}
                    >
                      {place.busyLabel}
                    </span>
                    <span className="text-stone-300">•</span>
                    <span className="text-stone-400 truncate">
                      {place.noiseLevel}
                    </span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onToggleFavorite(place.id)}
                className="p-2 text-[#D99B26] hover:text-[#590014] transition-colors"
                title="Remove from favorites"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}

          {favoritePlaces.length === 0 && (
            <div className="p-4 rounded-xl bg-white border border-stone-200 text-center text-xs text-stone-500">
              No favorite spots pinned yet. Tap the bookmark icon on any spot in Explore to pin it here!
            </div>
          )}
        </div>
      </div>

      {/* Help & Campus Resources */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#4c0311]" />
          Help & Campus Resources
        </h2>

        <div className="rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs divide-y divide-stone-100">
          <button
            onClick={() => setResourceModal('guide')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#590014]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">
                  New Student Guide to Calvin Landmarks
                </p>
                <p className="text-[11px] text-stone-500">
                  Learn building abbreviations, tunnel routes & peak hours
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => setResourceModal('code')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#590014]">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">
                  Community Guidelines & Rating Code
                </p>
                <p className="text-[11px] text-stone-500">
                  How we keep reviews helpful, respectful, and transparent
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>

          <button
            onClick={() => setResourceModal('it')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-stone-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FAF7F5] flex items-center justify-center text-[#590014]">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-900">
                  Calvin IT HelpDesk Support
                </p>
                <p className="text-[11px] text-stone-500">
                  Issues with SSO credentials or location beacons?
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        </div>
      </div>

      {/* Sign Out & Build Info */}
      <div className="space-y-3 pt-1">
        <button
          onClick={() => setShowSignOutConfirm(true)}
          className="w-full py-3 px-4 rounded-xl bg-rose-50 text-[#ba1a1a] font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors border border-rose-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Calvin SSO</span>
        </button>

        <div className="text-center space-y-0.5">
          <p className="text-[11px] font-semibold text-stone-400">
            Calvin Ratings App • v2.4.1 (Build 1876)
          </p>
          <p className="text-[10px] text-stone-400">
            Grand Rapids, Michigan • Verified Collegiate Node
          </p>
        </div>
      </div>

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xs bg-white rounded-2xl p-5 border border-stone-200 text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-stone-900">Sign Out of Calvin SSO?</h3>
            <p className="text-xs text-stone-500">
              You will need to verify with your @calvin.edu account to post ratings again.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-stone-100 font-bold text-xs text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowSignOutConfirm(false);
                  onSignOut();
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resource Modal */}
      {resourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-5 border border-stone-200 space-y-3 shadow-2xl">
            <h3 className="font-bold text-sm text-[#4c0311]">
              {resourceModal === 'guide' && 'Calvin Campus Navigation Guide'}
              {resourceModal === 'code' && 'Calvin Ratings Community Code'}
              {resourceModal === 'it' && 'Calvin University HelpDesk'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {resourceModal === 'guide' &&
                'Tip: Winter tunnel access links Hekman Library, Commons Dining Hall, and Science building basement corridors during snow season.'}
              {resourceModal === 'code' &&
                'All ratings are reviewed by student moderation algorithm. Submissions should be constructive, timely, and reflect real-time conditions.'}
              {resourceModal === 'it' &&
                'IT HelpDesk located in Hekman Library 2nd Floor, or reach out at helpdesk@calvin.edu or extension 6-8500.'}
            </p>
            <button
              onClick={() => setResourceModal(null)}
              className="w-full py-2 bg-stone-100 rounded-xl font-bold text-xs text-stone-800 hover:bg-stone-200"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
