import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { fetchProductDetail } from '@/api/product';
import RenderHTML from 'react-native-render-html';

const { width: PAGE_WIDTH } = Dimensions.get('window');

interface MallProduct {
  id: number;
  name: string;
  subTitle: string;
  pic: string;
  albumPics: string;
  price: number;
  originalPrice: number;
  sale: number;
  stock: number;
  detailMobileHtml: string;
}

export default function ProductDetailScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { width: contentWidth } = useWindowDimensions();

  const [productDetails, setProductDetails] = useState<MallProduct | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const productImages = useMemo(() => {
    if (!productDetails) return [];
    const albumPics = productDetails.albumPics ? productDetails.albumPics.split(',') : [];
    return [productDetails.pic, ...albumPics].filter(url => url);
  }, [productDetails]);

  const loadProductInfo = useCallback(async (productId: number) => {
    try {
      const response = await fetchProductDetail(productId);
      setProductDetails(response.data.product);
    } catch {
      // Error handled by interceptor
    } finally {
      setIsPageLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      loadProductInfo(Number(id));
    }
  }, [id, loadProductInfo]);

  if (isPageLoading || !productDetails) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen options={{ title: t('home.product.detail_title'), headerTransparent: true, headerTitle: '' }} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.bannerContainer}
        >
          {productImages.map((uri, index) => (
            <Image key={index} source={{ uri }} style={styles.bannerImage} />
          ))}
        </ScrollView>

        <View style={styles.introSection}>
          <Text style={[styles.title, { color: colors.fontColorDark }]}>{productDetails.name}</Text>
          <Text style={[styles.subtitle, { color: colors.fontColorLight }]}>{productDetails.subTitle}</Text>
          <View style={styles.priceRow}>
            <Text style={[styles.priceTag, { color: colors.primary }]}>¥</Text>
            <Text style={[styles.priceValue, { color: colors.primary }]}>{productDetails.price}</Text>
            <Text style={[styles.originalPrice, { color: colors.fontColorLight }]}>¥{productDetails.originalPrice}</Text>
          </View>
          <View style={styles.statsBar}>
            <Text style={[styles.statsText, { color: colors.fontColorLight }]}>{t('home.product.sales')}: {productDetails.sale}</Text>
            <Text style={[styles.statsText, { color: colors.fontColorLight }]}>{t('home.product.stock')}: {productDetails.stock}</Text>
            <Text style={[styles.statsText, { color: colors.fontColorLight }]}>{t('home.product.comments')}: 86</Text>
          </View>
        </View>

        <View style={styles.cList}>
          <ProductInfoRow title={t('home.product.buy_type')} content={t('home.product.select_specs')} showArrow colors={colors} />
          <ProductInfoRow title={t('home.product.params')} content={t('home.product.view')} showArrow colors={colors} />
          <ProductInfoRow 
            title={t('home.product.coupons')} 
            content={t('home.product.get_coupons')} 
            showArrow 
            colors={colors} 
            contentStyle={{ color: colors.primary }} 
          />
          <ProductInfoRow title={t('home.product.service')} content={t('home.product.service_content')} colors={colors} />
        </View>

        <View style={styles.detailDesc}>
          <View style={styles.detailHeader}>
            <View style={styles.headerLine} />
            <Text style={[styles.headerText, { color: colors.fontColorDark }]}>{t('home.product.graph_detail')}</Text>
            <View style={styles.headerLine} />
          </View>
          <View style={styles.htmlWrapper}>
             <RenderHTML
              contentWidth={contentWidth - 20}
              source={{ html: productDetails.detailMobileHtml || `<p>${t('home.product.no_detail')}</p>` }}
              tagsStyles={{
                img: { width: '100%', height: 'auto' },
                p: { color: colors.fontColorDark },
              }}
            />
          </View>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      <ProductInteractionBar colors={colors} />
    </SafeAreaView>
  );
}

function ProductInfoRow({ title, content, showArrow, colors, contentStyle }: any) {
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

function ProductInteractionBar({ colors }: { colors: any }) {
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
  bannerContainer: {
    height: PAGE_WIDTH,
  },
  bannerImage: {
    width: PAGE_WIDTH,
    height: PAGE_WIDTH,
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
  cList: {
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
  detailDesc: {
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
