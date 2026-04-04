import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type RemoteResourceStateProps = {
  isLoading: boolean;
  hasError: boolean;
  errorColor: string;
  onRetry: () => void;
};

export function RemoteResourceState({
  isLoading,
  hasError,
  errorColor,
  onRetry,
}: RemoteResourceStateProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!hasError) {
    return null;
  }

  return (
    <View style={[styles.container, styles.center]}>
      <Text style={{ color: errorColor }}>{t('common.load_failed')}</Text>
      <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
        <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#fa436a',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
