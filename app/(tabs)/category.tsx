import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fetchProductCategoryList } from '@/api/home';

interface ProductCategory {
  id: number;
  name: string;
  icon?: string;
  parentId: number;
}

const ROOT_CATEGORY_ID = 0;

export default function CategoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [primaryCategories, setPrimaryCategories] = useState<ProductCategory[]>([]);
  const [secondaryCategories, setSecondaryCategories] = useState<ProductCategory[]>([]);
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<number | null>(null);

  const fetchSecondaryCategories = useCallback(async (parentId: number) => {
    try {
      const response = await fetchProductCategoryList(parentId);
      setSecondaryCategories(response.data);
    } catch {
      // Error handled by interceptor
    }
  }, []);

  const initializeCategoryData = useCallback(async () => {
    try {
      const response = await fetchProductCategoryList(ROOT_CATEGORY_ID);
      const categories = response.data;
      setPrimaryCategories(categories);
      
      if (categories.length > 0) {
        const firstCategoryId = categories[0].id;
        setSelectedMainCategoryId(firstCategoryId);
        fetchSecondaryCategories(firstCategoryId);
      }
    } catch {
      // Error handled by interceptor
    }
  }, [fetchSecondaryCategories]);

  useEffect(() => {
    initializeCategoryData();
  }, [initializeCategoryData]);

  const onMainCategorySelect = (categoryId: number) => {
    setSelectedMainCategoryId(categoryId);
    fetchSecondaryCategories(categoryId);
  };

  const navigateToProductList = (subCategoryId: number) => {
    router.push({
      pathname: '/product/list',
      params: { fid: selectedMainCategoryId, sid: subCategoryId },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ScrollView style={styles.leftAside} showsVerticalScrollIndicator={false}>
          {primaryCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.fItem,
                selectedMainCategoryId === category.id && { backgroundColor: colors.background },
              ]}
              onPress={() => onMainCategorySelect(category.id)}
            >
              {selectedMainCategoryId === category.id && (
                <View style={[styles.activeLine, { backgroundColor: colors.primary }]} />
              )}
              <Text
                style={[
                  styles.fItemText,
                  { color: selectedMainCategoryId === category.id ? colors.primary : colors.fontColorBase },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.rightAside} showsVerticalScrollIndicator={false}>
          <View style={styles.sList}>
            {secondaryCategories.map((subCategory) => (
              <TouchableOpacity
                key={subCategory.id}
                style={styles.sItem}
                onPress={() => navigateToProductList(subCategory.id)}
              >
                <Image
                  source={{ uri: subCategory.icon || 'https://via.placeholder.com/140' }}
                  style={styles.sImage}
                />
                <Text style={[styles.sItemText, { color: colors.fontColorBase }]}>
                  {subCategory.name}
                </Text>
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
  leftAside: {
    width: 100,
    backgroundColor: '#fff',
  },
  fItem: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  activeLine: {
    position: 'absolute',
    left: 0,
    top: '30%',
    height: '40%',
    width: 4,
    borderRadius: 2,
  },
  fItemText: {
    fontSize: 14,
  },
  rightAside: {
    flex: 1,
    paddingLeft: 10,
  },
  sList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  sItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  sImage: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  sItemText: {
    fontSize: 12,
  },
});
