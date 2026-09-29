import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CALVIN_LOGO_URL } from '../data/mockData';
import { colors } from '../theme';

interface TopHeaderProps {
  type?: 'feed' | 'subscreen';
  title?: string;
  onBack?: () => void;
  onMenu?: () => void;
  onProfileClick?: () => void;
  rightBadgeType?: 'avatar' | 'initial' | 'notifications';
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  type = 'subscreen',
  title = 'Create Rating',
  onBack,
  onMenu,
  onProfileClick,
  rightBadgeType = 'avatar',
}) => {
  if (type === 'feed') {
    return (
      <View style={styles.header}>
        <View style={styles.headerInner}>
          <TouchableOpacity onPress={onMenu} style={styles.iconBtn} accessibilityLabel="Menu">
            <MaterialIcons name="menu" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.logoGroup}>
            <Image source={{ uri: CALVIN_LOGO_URL }} style={styles.logo} />
            <View>
              <Text style={styles.logoTitle}>
                Calvin <Text style={styles.logoTitleAccent}>Ratings</Text>
              </Text>
              <Text style={styles.logoSubtitle}>CAMPUS PULSE</Text>
            </View>
          </View>

          <View style={styles.rightGroup}>
            <TouchableOpacity style={styles.iconBtn} accessibilityLabel="Notifications">
              <MaterialIcons name="notifications" size={22} color={colors.text} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onProfileClick} style={styles.avatarBtn} accessibilityLabel="User Profile">
              <MaterialIcons name="person" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      <View style={styles.headerInner}>
        <View style={styles.leftGroup}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn} accessibilityLabel="Go Back">
              <MaterialIcons name="arrow-back" size={24} color={colors.dark} />
            </TouchableOpacity>
          )}
          <Image source={{ uri: CALVIN_LOGO_URL }} style={styles.logo} />
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        <TouchableOpacity onPress={onProfileClick} style={styles.avatarBtn} accessibilityLabel="User Profile">
          {rightBadgeType === 'initial' ? (
            <Text style={styles.avatarInitial}>C</Text>
          ) : (
            <MaterialIcons name="person" size={18} color={colors.white} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingTop: 48,
  },
  headerInner: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    height: 32,
    width: 32,
    resizeMode: 'contain',
  },
  logoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.maroon,
  },
  logoTitleAccent: {
    color: '#c27803',
  },
  logoSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.subtext4,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.maroon,
    borderWidth: 2,
    borderColor: colors.bg,
  },
  avatarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    marginLeft: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.dark,
    flexShrink: 1,
  },
});

