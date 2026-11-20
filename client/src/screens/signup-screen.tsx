import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ActionButton } from '@/components/action-button';
import { Colors } from '@/constants/colors';
import { Typography } from '@/constants/typography';
import { ApiError } from '@/services/api-client';
import { createAccount } from '@/services/auth-api';
import { MIN_PASSWORD_LENGTH, validateSignUp, type SignUpErrors, type SignUpForm } from '@/utils/signup-validation';

const EMPTY_FORM: SignUpForm = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

/**
 * Create account screen, reached from "New here? Create an account" on Log In.
 *
 * Checks the form, then asks the server to create the account. With real
 * sign-up, Supabase emails a confirmation link and the screen says "Check your
 * email". While sign-up is mock-only, no email is sent and it says "Account
 * created" instead.
 */
export function SignUpScreen() {
  const router = useRouter();
  const [form, setForm] = useState<SignUpForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<SignUpErrors>({});
  // A problem that isn't about one field, e.g. the server being unreachable.
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  // Set once the account is created: its email, and whether a confirmation
  // email was actually sent (not while sign-up is mock-only).
  const [created, setCreated] = useState<{ email: string; emailSent: boolean } | null>(null);

  const setField = (field: keyof SignUpForm) => (value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    // Clear a field's error as soon as the student starts fixing it.
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const goToLogIn = () => router.replace('/login');

  const handleSubmit = async () => {
    setFormError('');
    const found = validateSignUp(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const result = await createAccount({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      setCreated({ email: result.email, emailSent: result.emailSent });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      const field = error instanceof ApiError ? (error.field as keyof SignUpForm | undefined) : undefined;
      if (field && field in EMPTY_FORM) setErrors({ [field]: message });
      else setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.sentCard}>
            <View style={styles.sentIcon}>
              <Ionicons
                name={created.emailSent ? 'mail-unread-outline' : 'checkmark-circle-outline'}
                size={32}
                color={Colors.maroon}
              />
            </View>
            {created.emailSent ? (
              <>
                <Text style={styles.title}>Check your email</Text>
                <Text style={styles.body}>We sent a confirmation link to</Text>
                <Text style={styles.email}>{created.email}</Text>
                <Text style={styles.body}>
                  Open it to activate your account, then come back and log in. It can take a few minutes, so check your
                  spam folder too.
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.title}>Account created</Text>
                <Text style={styles.email}>{created.email}</Text>
                <Text style={styles.body}>
                  No confirmation email was sent: sign-up is in test mode for now. You can log in with this email.
                </Text>
              </>
            )}
            <ActionButton label="Back to Log In" icon="log-in-outline" onPress={goToLogIn} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>Use your Calvin email. We&apos;ll send you a link to confirm it.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.nameRow}>
              <Field
                label="First name"
                testID="signup-first-name"
                value={form.firstName}
                onChangeText={setField('firstName')}
                error={errors.firstName}
                autoComplete="given-name"
                textContentType="givenName"
              />
              <Field
                label="Last name (optional)"
                testID="signup-last-name"
                value={form.lastName}
                onChangeText={setField('lastName')}
                error={errors.lastName}
                autoComplete="family-name"
                textContentType="familyName"
              />
            </View>
            <Field
              label="Calvin email"
              testID="signup-email"
              value={form.email}
              onChangeText={setField('email')}
              error={errors.email}
              placeholder="you@calvin.edu"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <Field
              label="Password"
              testID="signup-password"
              value={form.password}
              onChangeText={setField('password')}
              error={errors.password}
              placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
            />
            <Field
              label="Confirm password"
              testID="signup-confirm-password"
              value={form.confirmPassword}
              onChangeText={setField('confirmPassword')}
              error={errors.confirmPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              textContentType="newPassword"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
            />
            <Pressable
              onPress={() => setShowPassword((value) => !value)}
              accessibilityRole="button"
              style={styles.showPassword}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={16} color={Colors.textSecondary} />
              <Text style={styles.showPasswordText}>{showPassword ? 'Hide passwords' : 'Show passwords'}</Text>
            </Pressable>

            {formError ? <Text style={styles.formError}>{formError}</Text> : null}

            {submitting ? (
              <ActivityIndicator color={Colors.maroon} accessibilityLabel="Creating your account" />
            ) : (
              <ActionButton label="Create Account" icon="person-add-outline" onPress={handleSubmit} />
            )}

            <Pressable onPress={goToLogIn} accessibilityRole="link" style={styles.linkRow}>
              <Text style={styles.linkText}>Already have an account? Log in</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

interface FieldProps extends TextInputProps {
  label: string;
  error?: string;
}

// A labelled text input with its error message underneath.
function Field({ label, error, style, ...inputProps }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={Colors.textMuted}
        accessibilityLabel={label}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...inputProps}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
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
    gap: 24,
  },
  header: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontFamily: Typography.extraBold,
    fontSize: 26,
    color: Colors.maroon,
    textAlign: 'center',
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
    gap: 14,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    flex: 1,
    gap: 6,
  },
  label: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: Typography.medium,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.danger,
  },
  fieldError: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.danger,
  },
  showPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
  },
  showPasswordText: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  formError: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.danger,
    textAlign: 'center',
  },
  linkRow: {
    alignSelf: 'center',
    paddingVertical: 4,
  },
  linkText: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.maroon,
  },
  sentCard: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
  },
  sentIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  body: {
    fontFamily: Typography.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  email: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
});
