import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { fetchProductCategoryList } from '@/api/home';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MallProductCategory } from '@/types/mall';

const rootCategoryId = 0;

export default function CategoryScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme] as typeof Colors.light;

  const [parentCategoryList, setParentCategoryList] = useState<MallProductCategory[]>([]);
  const [childCategoryList, setChildCategoryList] = useState<MallProductCategory[]>([]);
  const [selectedParentCategoryId, setSelectedParentCategoryId] = useState<number | null>(null);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [categoryLoadError, setCategoryLoadError] = useState<Error | null>(null);

  const loadChildCategories = useCallback(async (parentCategoryId: number) => {
    const response = await fetchProductCategoryList(parentCategoryId);
    setChildCategoryList(response.data);
  }, []);

  const loadCategories = useCallback(async () => {
    setIsCategoryLoading(true);
    setCategoryLoadError(null);
    try {
      const response = await fetchProductCategoryList(rootCategoryId);
      setParentCategoryList(response.data);
      if (response.data.length === 0) {
        setSelectedParentCategoryId(null);
        setChildCategoryList([]);
        return;
      }
      const firstParentCategoryId = response.data[0].id;
      setSelectedParentCategoryId(firstParentCategoryId);
      await loadChildCategories(firstParentCategoryId);
    } catch (error) {
      setCategoryLoadError(error as Error);
    } finally {
      setIsCategoryLoading(false);
    }
  }, [loadChildCategories]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const selectParentCategory = useCallback(
    async (parentCategoryId: number) => {
      setSelectedParentCategoryId(parentCategoryId);
      await loadChildCategories(parentCategoryId);
    },
    [loadChildCategories],
  );

  const navigateToProductList = useCallback((childCategoryId: number) => {
    router.push({ pathname: '/product/[id]', params: { id: childCategoryId } });
  }, []);

  const categoryStateView = useMemo(() => {
    if (isCategoryLoading) {
      return <Text>{t('common.loading')}</Text>;
    }
    if (categoryLoadError) {
      return (
        <>
          <Text style={{ color: colors.error }}>{t('common.load_failed')}</Text>
          <TouchableOpacity onPress={loadCategories} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </>
      );
    }
    return null;
  }, [categoryLoadError, colors.error, isCategoryLoading, loadCategories, t]);

  if (categoryStateView) {
    return <View style={[styles.container, styles.center]}>{categoryStateView}</View>;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ScrollView style={styles.parentCategoryPanel} showsVerticalScrollIndicator={false}>
          {parentCategoryList.map((parentCategory) => {
            const isSelectedParentCategory = selectedParentCategoryId === parentCategory.id;
            return (
              <TouchableOpacity
                key={parentCategory.id}
                style={[
                  styles.parentCategoryRow,
                  isSelectedParentCategory && { backgroundColor: colors.background },
                ]}
                onPress={() => selectParentCategory(parentCategory.id)}>
                {isSelectedParentCategory && <View style={[styles.selectedLine, { backgroundColor: colors.primary }]} />}
                <Text
                  style={[
                    styles.parentCategoryText,
                    { color: isSelectedParentCategory ? colors.primary : colors.fontColorBase },
                  ]}>
                  {parentCategory.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView style={styles.childCategoryPanel} showsVerticalScrollIndicator={false}>
          <View style={styles.childCategoryGrid}>
            {childCategoryList.map((childCategory) => (
              <TouchableOpacity
                key={childCategory.id}
                style={styles.childCategoryCard}
                onPress={() => navigateToProductList(childCategory.id)}>
                <Image
                  source={{ uri: childCategory.icon || 'https://via.placeholder.com/140' }}
                  style={styles.childCategoryImage}
                />
                <Text style={[styles.childCategoryText, { color: colors.fontColorBase }]}>{childCategory.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
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
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  parentCategoryPanel: {
    width: 100,
    backgroundColor: '#fff',
  },
  parentCategoryRow: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  selectedLine: {
    position: 'absolute',
    left: 0,
    top: '30%',
    height: '40%',
    width: 4,
    borderRadius: 2,
  },
  parentCategoryText: {
    fontSize: 14,
  },
  childCategoryPanel: {
    flex: 1,
    paddingLeft: 10,
  },
  childCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  childCategoryCard: {
    width: '33.33%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  childCategoryImage: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  childCategoryText: {
    fontSize: 12,
  },
});
