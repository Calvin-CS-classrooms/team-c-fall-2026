import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { TopHeader } from '../components/TopHeader';
import { SurveySpaceCard } from '../components/SurveySpaceCard';
import type { CampusSpace } from '../data/surveySpaces';
import { SURVEY_NOTICE } from '../utils/recommendationEngine';
import { colors } from '../theme';

export function PlaceDetailsScreen({ location, onBack, onProfileClick }: {
  location?: CampusSpace; onBack: () => void; onProfileClick: () => void;
}) {
  return <View style={styles.container}>
    <TopHeader type="subscreen" title="Location Details" onBack={onBack} onProfileClick={onProfileClick} rightBadgeType="initial" />
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.note}>{SURVEY_NOTICE}</Text>
      {location ? <SurveySpaceCard space={location} showReview /> : <Text style={styles.note}>No survey data is available for this location. Return to search to select a surveyed place.</Text>}
      <Text style={styles.note}>Building hours, live desk counts, Wi-Fi speeds, and current conditions are not available in this dataset.</Text>
    </ScrollView>
  </View>;
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, gap: 16, paddingBottom: 100 },
  note: { color: colors.subtext7, fontSize: 14, lineHeight: 21 },
});
