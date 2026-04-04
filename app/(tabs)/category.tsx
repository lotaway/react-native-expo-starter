import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { fetchProductCategoryList } from '@/api/home';
import { RemoteResourceState } from '@/components/RemoteResourceState';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MallProductCategory } from '@/types/mall';

const rootCategoryId = 0;

export default function CategoryScreen() {
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

  if (isCategoryLoading || categoryLoadError) {
    return (
      <RemoteResourceState
        isLoading={isCategoryLoading}
        hasError={Boolean(categoryLoadError)}
        errorColor={colors.error}
        onRetry={loadCategories}
      />
    );
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
