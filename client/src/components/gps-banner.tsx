import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import type { LocationStatus } from '@/hooks/use-current-building';
import type { Location } from '@/types';

export interface FloorChoice {
  spaceId: number;
  label: string;
}

interface GpsBannerProps {
  status: LocationStatus;
  /** The detected building, when status is "found". */
  building?: Location;
  /** The building's floors and areas to choose from. */
  floors: FloorChoice[];
  selectedSpaceId?: number;
  onSelectSpace: (spaceId: number) => void;
  /** Open the rating sheet for the selected floor. */
  onRate: () => void;
  /** Read the location again. */
  onRetry: () => void;
  /** Go to Profile to turn Geolocation on. */
  onTurnOn: () => void;
}

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * The "Rate your current location" banner on Home.
 *
 * Shows the building found from the phone's location and asks which floor
 * the student is on (GPS can't tell floors apart), then rates that floor.
 * When location is off, denied, unavailable, or not near a building, it says
 * so and offers the next step instead.
 */
export function GpsBanner({
  status,
  building,
  floors,
  selectedSpaceId,
  onSelectSpace,
  onRate,
  onRetry,
  onTurnOn,
}: GpsBannerProps) {
  if (status === 'found' && building) {
    const selected = floors.find((floor) => floor.spaceId === selectedSpaceId);
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Ionicons name="location" size={18} color={Colors.white} />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{`You're at ${building.name}`}</Text>
            <Text style={styles.subtitle}>
              {selected ? `${building.name} · ${selected.label}` : 'Which floor are you on?'}
            </Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.floorRow}>
          {floors.map((floor) => {
            const isSelected = floor.spaceId === selectedSpaceId;
            return (
              <Pressable
                key={floor.spaceId}
                onPress={() => onSelectSpace(floor.spaceId)}
                accessibilityRole="button"
                accessibilityLabel={`I'm on ${floor.label}`}
                accessibilityState={{ selected: isSelected }}
                style={[styles.floorChip, isSelected && styles.floorChipSelected]}>
                <Text style={[styles.floorText, isSelected && styles.floorTextSelected]}>{floor.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={onRate}
          disabled={!selected}
          accessibilityRole="button"
          accessibilityLabel="Rate this floor"
          accessibilityState={{ disabled: !selected }}
          style={[styles.rateButton, !selected && styles.rateButtonDisabled]}>
          <Ionicons name="star" size={14} color={Colors.maroon} />
          <Text style={styles.rateText}>{selected ? `Rate ${selected.label}` : 'Pick a floor to rate it'}</Text>
        </Pressable>
      </View>
    );
  }

  if (status === 'locating') {
    return (
      <View style={[styles.container, styles.row]} accessibilityLiveRegion="polite">
        <ActivityIndicator color={Colors.white} />
        <View style={styles.textWrap}>
          <Text style={styles.title}>Finding your building…</Text>
          <Text style={styles.subtitle}>Using your location to see where you are on campus</Text>
        </View>
      </View>
    );
  }

  const prompts: Record<'off' | 'denied' | 'unavailable' | 'not-near' | 'found', {
    icon: IconName;
    title: string;
    subtitle: string;
    label: string;
    onPress: () => void;
  }> = {
    off: {
      icon: 'navigate-outline',
      title: 'Rate where you are',
      subtitle: 'Turn on Geolocation in Profile to find the building you are in',
      label: 'Turn on Geolocation in Profile',
      onPress: onTurnOn,
    },
    denied: {
      icon: 'lock-closed-outline',
      title: 'Location permission is off',
      subtitle: 'Allow location access to rate where you are. Tap to try again.',
      label: 'Check my location again',
      onPress: onRetry,
    },
    unavailable: {
      icon: 'cloud-offline-outline',
      title: "Couldn't get your location",
      subtitle: 'Check that location services are on. Tap to try again.',
      label: 'Check my location again',
      onPress: onRetry,
    },
    'not-near': {
      icon: 'map-outline',
      title: "You're not near a rated building",
      subtitle: 'Tap to check again when you get to one.',
      label: 'Check my location again',
      onPress: onRetry,
    },
    // "found" without a building can't happen, but fall back to checking again.
    found: {
      icon: 'map-outline',
      title: "You're not near a rated building",
      subtitle: 'Tap to check again.',
      label: 'Check my location again',
      onPress: onRetry,
    },
  };
  const prompt = prompts[status];

  return (
    <Pressable
      onPress={prompt.onPress}
      accessibilityRole="button"
      accessibilityLabel={prompt.label}
      style={[styles.container, styles.row]}>
      <View style={styles.iconWrap}>
        <Ionicons name={prompt.icon} size={18} color={Colors.white} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{prompt.title}</Text>
        <Text style={styles.subtitle}>{prompt.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.maroon,
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.maroonSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.goldSoft,
  },
  subtitle: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.white,
    marginTop: 2,
  },
  floorRow: {
    gap: 8,
  },
  floorChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  floorChipSelected: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  floorText: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.white,
  },
  floorTextSelected: {
    color: Colors.maroon,
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 10,
  },
  rateButtonDisabled: {
    opacity: 0.6,
  },
  rateText: {
    fontFamily: Typography.bold,
    fontSize: 14,
    color: Colors.maroon,
  },
});
