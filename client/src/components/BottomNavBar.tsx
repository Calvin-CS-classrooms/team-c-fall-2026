import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';

export type MainTab = 'explore' | 'map' | 'profile';

interface BottomNavBarProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  onCreateRating: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  onCreateRating,
}) => {
  return (
    <View style={styles.nav}>
      <View style={styles.navInner}>
        {/* Explore Tab */}
        <TouchableOpacity
          onPress={() => onSelectTab('explore')}
          style={styles.tab}
          accessibilityLabel="Explore Tab"
        >
          <MaterialIcons
            name="explore"
            size={22}
            color={currentTab === 'explore' ? colors.maroon : colors.subtext3}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'explore' && styles.tabLabelActive,
            ]}
          >
            Explore
          </Text>
          <View
            style={[
              styles.tabDot,
              currentTab === 'explore' ? styles.tabDotActive : styles.tabDotInactive,
            ]}
          />
        </TouchableOpacity>

        {/* Map Tab */}
        <TouchableOpacity
          onPress={() => onSelectTab('map')}
          style={styles.tab}
          accessibilityLabel="Campus Map Tab"
        >
          <MaterialIcons
            name="map"
            size={22}
            color={currentTab === 'map' ? colors.maroon : colors.subtext3}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'map' && styles.tabLabelActive,
            ]}
          >
            Map
          </Text>
          <View
            style={[
              styles.tabDot,
              currentTab === 'map' ? styles.tabDotActive : styles.tabDotInactive,
            ]}
          />
        </TouchableOpacity>

        {/* Center Maroon Action Button (Create Rating) */}
        <View style={styles.centerSlot}>
          <TouchableOpacity
            onPress={onCreateRating}
            accessibilityLabel="Rate Location"
            style={styles.centerBtn}
          >
            <MaterialIcons name="add" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

        {/* Profile Tab */}
        <TouchableOpacity
          onPress={() => onSelectTab('profile')}
          style={styles.tab}
          accessibilityLabel="Profile Tab"
        >
          <MaterialIcons
            name="account-circle"
            size={22}
            color={currentTab === 'profile' ? colors.maroon : colors.subtext3}
          />
          <Text
            style={[
              styles.tabLabel,
              currentTab === 'profile' && styles.tabLabelActive,
            ]}
          >
            Profile
          </Text>
          <View
            style={[
              styles.tabDot,
              currentTab === 'profile' ? styles.tabDotActive : styles.tabDotInactive,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingBottom: 24,
  },
  navInner: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  tab: {
    minWidth: 56,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    color: colors.subtext3,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: colors.maroon,
    fontWeight: '600',
  },
  tabDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  tabDotActive: {
    backgroundColor: colors.maroon,
  },
  tabDotInactive: {
    backgroundColor: 'transparent',
  },
  centerSlot: {
    minWidth: 56,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

