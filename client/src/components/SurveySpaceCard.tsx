import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import type { CampusSpace } from '../data/surveySpaces';
import { surveyPercentage } from '../utils/surveyScores';
import { SPACE_PHOTOS } from '../data/spacePhotos';
import { colors } from '../theme';

export function SurveySpaceCard({ space, onViewDetails, showReview = false, showPhoto = false }: {
  space: CampusSpace; onViewDetails?: (id: string) => void; showReview?: boolean; showPhoto?: boolean;
}) {
  const photo = showPhoto ? SPACE_PHOTOS[space.id] : undefined;
  return <View style={styles.card}>
    {photo && <>
      <Image source={photo.source} style={styles.photo} resizeMode="cover" accessibilityLabel={photo.description} />
      <Text style={styles.caption}>{photo.description} · Photo: Calvin University</Text>
    </>}
    <Text style={styles.title}>{space.name}</Text>
    <Text style={styles.text}>Overall: {surveyPercentage(space.overallRating)} · Study: {surveyPercentage(space.studySuitability)}</Text>
    <Text style={styles.text}>Outlets: {surveyPercentage(space.outletAvailability)} · Seating: {surveyPercentage(space.seatingAvailability)}</Text>
    <Text style={styles.text}>Survey noise: {space.noiseLevel} · Crowd: {space.crowdLevel}</Text>
    <Text style={styles.text}>Best use: {space.bestUse} · Typical use: {space.typicalTime}</Text>
    {showReview && <>
      <Text style={styles.text}>Reported usage frequency: {space.frequency}</Text>
      <Text style={styles.text}>Student survey review: “{space.review}”</Text>
    </>}
    {onViewDetails && <TouchableOpacity style={styles.button} onPress={() => onViewDetails(space.id)} accessibilityRole="button">
      <Text style={styles.buttonText}>View Details</Text>
    </TouchableOpacity>}
  </View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 16, gap: 10 },
  photo: { width: '100%', aspectRatio: 16 / 9, borderRadius: 12 },
  caption: { color: colors.subtext7, fontSize: 11, lineHeight: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  text: { color: colors.subtext7, fontSize: 14, lineHeight: 21 },
  button: { backgroundColor: colors.maroon, padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: '700' },
});
