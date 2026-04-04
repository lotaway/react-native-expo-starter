import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  useWindowDimensions,
  TextStyle,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import RenderHTML from 'react-native-render-html';
import { fetchProductDetail } from '@/api/product';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MallProduct } from '@/types/mall';

const { width: pageWidth } = Dimensions.get('window');
const reviewCount = 86;

type ProductInfoRowProps = {
  title: string;
  content: string;
  showArrow?: boolean;
  colors: typeof Colors.light;
  contentStyle?: TextStyle;
};

type ProductInteractionBarProps = {
  colors: typeof Colors.light;
};

export default function ProductDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme] as typeof Colors.light;
  const { width: contentWidth } = useWindowDimensions();

  const [productDetail, setProductDetail] = useState<MallProduct | null>(null);
  const [isProductDetailLoading, setIsProductDetailLoading] = useState(true);
  const [productDetailLoadError, setProductDetailLoadError] = useState<Error | null>(null);

  const productImageList = useMemo(() => {
    if (!productDetail) {
      return [];
    }
    const albumImageList = productDetail.albumPics ? productDetail.albumPics.split(',') : [];
    return [productDetail.pic, ...albumImageList].filter((imageUrl) => Boolean(imageUrl));
  }, [productDetail]);

  const loadProductDetail = useCallback(async (productId: number) => {
    setIsProductDetailLoading(true);
    setProductDetailLoadError(null);
    try {
      const response = await fetchProductDetail(productId);
      setProductDetail(response.data.product);
    } catch (error) {
      setProductDetailLoadError(error as Error);
    } finally {
      setIsProductDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    const productId = Number(id ?? 0);
    if (!productId) {
      setIsProductDetailLoading(false);
      return;
    }
    loadProductDetail(productId);
  }, [id, loadProductDetail]);

  if (isProductDetailLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  if (productDetailLoadError || !productDetail) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: colors.error }}>{t('common.load_failed')}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadProductDetail(Number(id ?? 0))}>
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <Stack.Screen options={{ title: t('home.product.detail_title'), headerTransparent: true, headerTitle: '' }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
          {productImageList.map((imageUrl) => (
            <Image key={imageUrl} source={{ uri: imageUrl }} style={styles.bannerImage} />
          ))}
        </ScrollView>

        <View style={styles.introSection}>
          <Text style={[styles.title, { color: colors.fontColorDark }]}>{productDetail.name}</Text>
          <Text style={[styles.subtitle, { color: colors.fontColorLight }]}>{productDetail.subTitle}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceTag, { color: colors.primary }]}>¥</Text>
            <Text style={[styles.priceValue, { color: colors.primary }]}>{productDetail.price}</Text>
            <Text style={[styles.originalPrice, { color: colors.fontColorLight }]}>¥{productDetail.originalPrice}</Text>
          </View>
          <View style={styles.statsBar}>
            <Text style={[styles.statsText, { color: colors.fontColorLight }]}>
              {t('home.product.sales')}: {productDetail.sale}
            </Text>
            <Text style={[styles.statsText, { color: colors.fontColorLight }]}>
              {t('home.product.stock')}: {productDetail.stock}
            </Text>
            <Text style={[styles.statsText, { color: colors.fontColorLight }]}>
              {t('home.product.comments')}: {reviewCount}
            </Text>
          </View>
        </View>

        <View style={styles.infoList}>
          <ProductInfoRow
            title={t('home.product.buy_type')}
            content={t('home.product.select_specs')}
            showArrow
            colors={colors}
          />
          <ProductInfoRow title={t('home.product.params')} content={t('home.product.view')} showArrow colors={colors} />
          <ProductInfoRow
            title={t('home.product.coupons')}
            content={t('home.product.get_coupons')}
            showArrow
            colors={colors}
            contentStyle={{ color: colors.primary }}
          />
          <ProductInfoRow
            title={t('home.product.service')}
            content={t('home.product.service_content')}
            colors={colors}
          />
        </View>

        <View style={styles.detailSection}>
          <View style={styles.detailHeader}>
            <View style={styles.headerLine} />
            <Text style={[styles.headerText, { color: colors.fontColorDark }]}>{t('home.product.graph_detail')}</Text>
            <View style={styles.headerLine} />
          </View>
          <View style={styles.htmlWrapper}>
            <RenderHTML
              contentWidth={contentWidth - 20}
              source={{ html: productDetail.detailMobileHtml || `<p>${t('home.product.no_detail')}</p>` }}
              tagsStyles={{ img: { width: '100%', height: 'auto' }, p: { color: colors.fontColorDark } }}
            />
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      <ProductInteractionBar colors={colors} />
    </SafeAreaView>
  );
}

function ProductInfoRow({ title, content, showArrow, colors, contentStyle }: ProductInfoRowProps) {
  return (
    <TouchableOpacity style={styles.infoRow}>
      <Text style={[styles.rowTitle, { color: colors.fontColorLight }]}>{title}</Text>
      <Text numberOfLines={1} style={[styles.rowContent, { color: colors.fontColorDark }, contentStyle]}>
        {content}
      </Text>
      {showArrow && <IconSymbol name="chevron.right" size={14} color={colors.fontColorLight} />}
    </TouchableOpacity>
  );
}

function ProductInteractionBar({ colors }: ProductInteractionBarProps) {
  const { t } = useTranslation();

  return (
    <View style={[styles.bottomBar, { backgroundColor: colors.background }]}> 
      <View style={styles.bottomLeft}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.bottomIconBtn}>
          <IconSymbol name="house" size={24} color={colors.fontColorBase} />
          <Text style={[styles.bottomIconText, { color: colors.fontColorBase }]}>{t('common.tabs.home')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/cart')} style={styles.bottomIconBtn}>
          <IconSymbol name="cart" size={24} color={colors.fontColorBase} />
          <Text style={[styles.bottomIconText, { color: colors.fontColorBase }]}>{t('common.tabs.cart')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomIconBtn}>
          <IconSymbol name="heart" size={24} color={colors.fontColorBase} />
          <Text style={[styles.bottomIconText, { color: colors.fontColorBase }]}>{t('profile.menu.favorite')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomRight}>
        <TouchableOpacity style={[styles.actionBtn, styles.cartBtn]}>
          <Text style={styles.actionBtnText}>{t('home.product.add_to_cart')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.buyBtn, { backgroundColor: colors.primary }]}>
          <Text style={styles.actionBtnText}>{t('home.product.buy_now')}</Text>
        </TouchableOpacity>
      </View>
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
  bannerContainer: {
    height: pageWidth,
  },
  bannerImage: {
    width: pageWidth,
    height: pageWidth,
    resizeMode: 'cover',
  },
  introSection: {
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceTag: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginLeft: 10,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statsText: {
    fontSize: 12,
  },
  infoList: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingHorizontal: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f9f9f9',
  },
  rowTitle: {
    width: 80,
    fontSize: 14,
  },
  rowContent: {
    flex: 1,
    fontSize: 14,
  },
  detailSection: {
    backgroundColor: '#fff',
    marginTop: 15,
    paddingBottom: 20,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  headerLine: {
    width: 50,
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 15,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  htmlWrapper: {
    paddingHorizontal: 10,
  },
  footerSpacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomLeft: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  bottomIconBtn: {
    alignItems: 'center',
  },
  bottomIconText: {
    fontSize: 10,
    marginTop: 4,
  },
  bottomRight: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBtn: {
    backgroundColor: '#ff9500',
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  buyBtn: {
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
