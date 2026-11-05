import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { useAppData } from '@/context/app-context';


/**
 * Login screen: the sign-in view shown to signed-out users. Contains input
 * fields for the Calvin email and password, a show/hide password toggle, and
 * a sign-in button. Only @calvin.edu accounts are accepted.
 */
export function LoginScreen() {
  const { logIn } = useAppData();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Whether the password is currently visible (toggled by the eye icon).
  const [showPassword, setShowPassword] = useState(false);
  // Validation/login error message to display, if any.
  const [error, setError] = useState('');

  // Attempts to log in and surfaces any error returned by the auth logic.
  const handleLogIn = () => {
    setError(logIn(email, password) ?? '');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.brand}>
            <Image
              source={require('@/assets/images/calvin_logo.webp')}
              style={styles.logo}
              contentFit="contain"
              accessibilityLabel="Calvin University shield logo"
            />
            <Text style={styles.title}>Calvin Ratings</Text>
            <Text style={styles.subtitle}>Find the right spot on campus, right now</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Username (Calvin email)</Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@calvin.edu"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="username"
                  autoComplete="email"
                  returnKeyType="next"
                  style={styles.input}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputRow}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                  autoComplete="password"
                  returnKeyType="go"
                  onSubmitEditing={handleLogIn}
                  style={styles.input}
                />
                <Pressable
                  onPress={() => setShowPassword((value) => !value)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.textMuted} />
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <ActionButton label="Log In" icon="log-in-outline" onPress={handleLogIn} />
            <Text style={styles.footnote}>Only @calvin.edu accounts can access Calvin Ratings.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 32,
  },
  brand: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  title: {
    fontFamily: Typography.extraBold,
    fontSize: 32,
    color: Colors.maroon,
  },
  subtitle: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: Typography.medium,
    fontSize: 15,
    color: Colors.textPrimary,
    padding: 0,
  },
  errorText: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.danger,
  },
  footnote: {
    fontFamily: Typography.medium,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
