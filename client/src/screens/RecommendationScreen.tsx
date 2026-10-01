import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { TopHeader } from '../components/TopHeader';
import { SurveySpaceCard } from '../components/SurveySpaceCard';
import { getRecommendation, type RecommendationResult } from '../utils/recommendationEngine';
import { colors } from '../theme';

interface RecommendationScreenProps {
  userQuery?: string;
  onViewDetails: (locationId: string) => void;
  onAskFollowUp?: (text: string) => void;
  onProfileClick: () => void;
  onMenuClick?: () => void;
}
export const RecommendationScreen: React.FC<RecommendationScreenProps> = ({
  userQuery = 'Where is the best place to study?', onViewDetails, onAskFollowUp, onProfileClick, onMenuClick,
}) => {
  const [followUp, setFollowUp] = useState<RecommendationResult | null>(null);
  const [input, setInput] = useState('');
  const result = followUp ?? getRecommendation(userQuery);
  const ask = (question: string) => {
    if (!question.trim()) return;
    setFollowUp(getRecommendation(question.trim(), {
      locationId: result.mode !== 'comparison' && !result.tiedLocations.length ? result.primaryLocation?.id : undefined,
    }));
    setInput('');
    onAskFollowUp?.(question.trim());
  };
  return <View style={styles.container}>
    <TopHeader type="feed" onMenu={onMenuClick} onProfileClick={onProfileClick} />
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Student Survey Insights</Text>
      <Text style={styles.query}>{result.query}</Text>
      <View style={styles.response}><Text style={styles.text}>{result.explanation}</Text></View>
      {result.limitations.map(message => <Text key={message} style={styles.note}>{message}</Text>)}
      {result.rankedLocations.map(({ location }, index) => <View key={location.id} style={styles.group}>
        <Text style={styles.label}>{result.mode === 'unsupported' ? 'Historical survey context' : result.mode === 'comparison' ? 'Comparison' : result.mode === 'location-info' ? 'Location information' : result.tiedLocations.some(s => s.id === location.id) ? 'Tied best match' : index === 0 ? 'Best survey match' : 'Alternative'}</Text>
        <SurveySpaceCard space={location} onViewDetails={onViewDetails} />
      </View>)}
      <Text style={styles.label}>Ask another question</Text>
      <TextInput value={input} onChangeText={setInput} placeholder="Ask about a place or survey rating…" style={styles.input} onSubmitEditing={() => ask(input)} returnKeyType="send" accessibilityLabel="Follow-up question" />
      <TouchableOpacity style={styles.button} onPress={() => ask(input)} accessibilityRole="button"><Text style={styles.buttonText}>Ask</Text></TouchableOpacity>
      {['Where is the quietest?', 'Where has the best outlets?', 'Where should I hang out with friends?'].map(question =>
        <TouchableOpacity key={question} style={styles.response} onPress={() => ask(question)} accessibilityRole="button"><Text style={styles.text}>{question}</Text></TouchableOpacity>)}
    </ScrollView>
  </View>;
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 120, gap: 14 },
  group: { gap: 8 },
  label: { color: colors.maroon, fontWeight: '700', fontSize: 13 },
  query: { padding: 16, borderRadius: 16, backgroundColor: colors.cream, color: colors.text, fontSize: 16 },
  response: { padding: 16, borderRadius: 16, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  text: { color: colors.text, lineHeight: 22, fontSize: 14 },
  note: { color: colors.subtext7, lineHeight: 18, fontSize: 12 },
  input: { padding: 14, backgroundColor: colors.white, borderRadius: 12, color: colors.text },
  button: { backgroundColor: colors.maroon, padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: colors.white, fontWeight: '700' },
});
