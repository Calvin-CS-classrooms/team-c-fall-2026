import React, { useState } from 'react';
import {
  INITIAL_PLACES,
  INITIAL_USER_RATINGS,
  INITIAL_USER_PROFILE,
  NOTIFICATIONS,
} from './data/mockData';
import { TabType, Place, UserRating, UserProfile } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { RatingsScreen } from './components/RatingsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { QuickRateModal } from './components/QuickRateModal';
import { NotificationsModal, NotificationItem } from './components/NotificationsModal';
import { DirectionsModal } from './components/DirectionsModal';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [places, setPlaces] = useState<Place[]>(INITIAL_PLACES);
  const [userRatings, setUserRatings] = useState<UserRating[]>(INITIAL_USER_RATINGS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);

  // Modals state
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rateModalPlaceId, setRateModalPlaceId] = useState<string>('hekman-card');
  const [rateModalSubLocation, setRateModalSubLocation] = useState<string>('2nd Floor Commons');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [navigatingPlace, setNavigatingPlace] = useState<Place | null>(null);

  // Desktop view toggle (enclosed in mobile device frame vs fluid)
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Toggle place favorite
  const handleToggleFavorite = (placeId: string) => {
    setPlaces((prev) =>
      prev.map((p) => (p.id === placeId ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  // Open Quick Rate modal for a specific place
  const handleOpenRateModal = (placeId?: string, subLocation?: string) => {
    if (placeId) setRateModalPlaceId(placeId);
    if (subLocation) setRateModalSubLocation(subLocation);
    setIsRateModalOpen(true);
  };

  // Add rating submission
  const handleAddRating = (newReview: {
    placeId: string;
    placeName: string;
    subLocation: string;
    rating: number;
    capacityPercent: number;
    noiseLevel: string;
    tags: string[];
    comment: string;
  }) => {
    const createdReview: UserRating = {
      id: `rev-${Date.now()}`,
      placeId: newReview.placeId,
      placeName: newReview.placeName,
      subLocation: `${newReview.subLocation} • Just now`,
      timeAgo: 'Just now',
      rating: newReview.rating,
      capacityPercent: newReview.capacityPercent,
      noiseLevel: newReview.noiseLevel,
      tags: newReview.tags,
      comment: newReview.comment,
      helpfulVotes: 1,
      hasVotedHelpful: false,
    };

    // Update reviews feed
    setUserRatings((prev) => [createdReview, ...prev]);

    // Update user stats
    setUser((prev) => ({
      ...prev,
      ratingsCount: prev.ratingsCount + 1,
      helpfulVotesCount: prev.helpfulVotesCount + 1,
    }));

    // Update place stats & busy status
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === newReview.placeId) {
          const newBusyStatus =
            newReview.capacityPercent > 75
              ? 'busy'
              : newReview.capacityPercent > 40
              ? 'moderate'
              : 'quiet';
          return {
            ...p,
            busyLevel: newReview.capacityPercent,
            busyLabel: `${newReview.capacityPercent}% Busy`,
            busyStatus: newBusyStatus,
            rating: Number(((p.rating * p.reviewCount + newReview.rating) / (p.reviewCount + 1)).toFixed(1)),
            reviewCount: p.reviewCount + 1,
          };
        }
        return p;
      })
    );
  };

  // Delete review
  const handleDeleteRating = (id: string) => {
    setUserRatings((prev) => prev.filter((r) => r.id !== id));
    setUser((prev) => ({
      ...prev,
      ratingsCount: Math.max(0, prev.ratingsCount - 1),
    }));
  };

  // Upvote review
  const handleUpvoteRating = (id: string) => {
    const rating = userRatings.find((item) => item.id === id);
    const voteChange = rating?.hasVotedHelpful ? -1 : 1;

    setUserRatings((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const alreadyVoted = r.hasVotedHelpful;
          return {
            ...r,
            helpfulVotes: alreadyVoted ? r.helpfulVotes - 1 : r.helpfulVotes + 1,
            hasVotedHelpful: !alreadyVoted,
          };
        }
        return r;
      })
    );

    setUser((prev) => ({
      ...prev,
      helpfulVotesCount: Math.max(0, prev.helpfulVotesCount + voteChange),
    }));
  };

  // Update privacy toggle in profile
  const handleUpdatePrivacy = (key: keyof UserProfile['privacy']) => {
    setUser((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key],
      },
    }));
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // Sign out / re-authenticate simulation
  const handleSignOut = () => {
    setUser((prev) => ({
      ...prev,
      ssoVerified: false,
    }));
    setTimeout(() => {
      alert('You have signed out. Tap anywhere to simulate quick re-login.');
      setUser((prev) => ({
        ...prev,
        ssoVerified: true,
      }));
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#1e1b1b] flex flex-col items-center justify-center py-0 sm:py-6 px-0 sm:px-4 antialiased selection:bg-[#D99B26]/30 selection:text-[#590014]">
      {/* Viewport Control Bar (Desktop Only) */}
      <aside aria-label="Desktop Controls" className="hidden sm:flex items-center justify-between w-full max-w-md mb-2 px-2 text-xs text-stone-400">
        <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#D99B26]" />
          <span>Calvin Ratings • Mobile Viewport</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
            title="Toggle phone frame bezels"
          >
            {isPhoneFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-[#D99B26]" />
                <span>Fluid</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-[#D99B26]" />
                <span>Device Frame</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Device Viewport Enclosure (max-w-md, rounded corners, subtle drop shadow, fixed status bar & bottom navigation) */}
      <div
        className={`w-full max-w-md bg-[#FAF7F5] flex flex-col min-h-screen sm:min-h-[844px] sm:max-h-[890px] overflow-hidden ${
          isPhoneFrame
            ? 'sm:rounded-[44px] sm:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_12px_#2b2627,0_0_0_14px_#3f3839]'
            : 'sm:rounded-2xl sm:shadow-2xl'
        } relative transition-all duration-300`}
      >
        {/* Fixed Top Header (Status bar + Calvin branding) */}
        <Header
          currentTab={currentTab}
          user={user}
          unreadCount={unreadCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onNavigateToProfile={() => setCurrentTab('profile')}
        />

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
          {currentTab === 'home' && (
            <HomeScreen
              user={user}
              places={places}
              onOpenRateModal={handleOpenRateModal}
              onNavigateToPlace={(p) => setNavigatingPlace(p)}
              onSelectPlaceForDetail={(p) => {
                setCurrentTab('explore');
                setTimeout(() => {
                  const el = document.getElementById(p.id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 150);
              }}
            />
          )}

          {currentTab === 'explore' && (
            <ExploreScreen
              places={places}
              onToggleFavorite={handleToggleFavorite}
              onOpenRateModal={handleOpenRateModal}
              onNavigateToPlace={(p) => setNavigatingPlace(p)}
            />
          )}

          {currentTab === 'ratings' && (
            <RatingsScreen
              user={user}
              places={places}
              userRatings={userRatings}
              onAddRating={handleAddRating}
              onDeleteRating={handleDeleteRating}
              onUpvoteRating={handleUpvoteRating}
              onUpdateUserRatingsCount={(delta) =>
                setUser((prev) => ({
                  ...prev,
                  ratingsCount: Math.max(0, prev.ratingsCount + delta),
                }))
              }
            />
          )}

          {currentTab === 'profile' && (
            <ProfileScreen
              user={user}
              places={places}
              onUpdatePrivacy={handleUpdatePrivacy}
              onToggleFavorite={handleToggleFavorite}
              onNavigateToPlace={(p) => setNavigatingPlace(p)}
              onSignOut={handleSignOut}
            />
          )}
        </main>

        {/* Fixed Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onChangeTab={(tab) => setCurrentTab(tab)}
          ratingsBadgeCount={userRatings.length}
        />

        {/* Quick Rate Modal Drawer */}
        <QuickRateModal
          isOpen={isRateModalOpen}
          onClose={() => setIsRateModalOpen(false)}
          places={places}
          defaultPlaceId={rateModalPlaceId}
          defaultSubLocation={rateModalSubLocation}
          onSubmitRating={handleAddRating}
        />

        {/* Notifications Alert Center */}
        <NotificationsModal
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllNotificationsRead}
        />

        {/* Campus Wayfinder / Directions Modal */}
        <DirectionsModal
          place={navigatingPlace}
          onClose={() => setNavigatingPlace(null)}
        />
      </div>
    </div>
  );
}
