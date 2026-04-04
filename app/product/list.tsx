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
import { router, useLocalSearchParams } from 'expo-router';
import { fetchProductList } from '@/api/product';
import { RemoteResourceState } from '@/components/RemoteResourceState';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MallProductSummary } from '@/types/mall';

const defaultPageSize = 20;

export default function ProductListScreen() {
  const { sid } = useLocalSearchParams<{ sid?: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme] as typeof Colors.light;

  const [productList, setProductList] = useState<MallProductSummary[]>([]);
  const [isProductListLoading, setIsProductListLoading] = useState(true);
  const [productListLoadError, setProductListLoadError] = useState<Error | null>(null);

  const selectedCategoryId = useMemo(() => Number(sid ?? 0), [sid]);

  const loadProductList = useCallback(async () => {
    if (!selectedCategoryId) {
      setProductList([]);
      setIsProductListLoading(false);
      return;
    }

    setIsProductListLoading(true);
    setProductListLoadError(null);
    try {
      const response = await fetchProductList({
        pageNum: 1,
        pageSize: defaultPageSize,
        productCategoryId: selectedCategoryId,
      });
      setProductList(response.data);
    } catch (error) {
      setProductListLoadError(error as Error);
    } finally {
      setIsProductListLoading(false);
    }
  }, [selectedCategoryId]);

  useEffect(() => {
    loadProductList();
  }, [loadProductList]);

  if (isProductListLoading || productListLoadError) {
    return (
      <RemoteResourceState
        isLoading={isProductListLoading}
        hasError={Boolean(productListLoadError)}
        errorColor={colors.error}
        onRetry={loadProductList}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.grid} showsVerticalScrollIndicator={false}>
        {productList.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => router.push({ pathname: '/product/[id]', params: { id: product.id } })}>
            <Image source={{ uri: product.pic }} style={styles.productImage} />
            <Text style={[styles.productTitle, { color: colors.fontColorDark }]} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={[styles.productSubtitle, { color: colors.fontColorLight }]} numberOfLines={1}>
              {product.subTitle}
            </Text>
            <Text style={[styles.productPrice, { color: colors.primary }]}>￥{product.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  productSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  productPrice: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '700',
  },
});
