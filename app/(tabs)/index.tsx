import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { RemoteResourceState } from '@/components/RemoteResourceState';
import { fetchMallHomeContent } from '@/api/home';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
  MallBanner,
  MallBrand,
  MallFlashPromotion,
  MallHomeContent,
  MallProductSummary,
} from '@/types/mall';

const { width: windowWidth } = Dimensions.get('window');

const homeCategoryActions = [
  { translationKey: 'home.categories.topic', iconName: 'star.fill' },
  { translationKey: 'home.categories.talk', iconName: 'bubble.left.fill' },
  { translationKey: 'home.categories.selected', iconName: 'checkmark.seal.fill' },
  { translationKey: 'home.categories.discount', iconName: 'tag.fill' },
] as const;

export default function HomeScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme] as typeof Colors.light;

  const [homeContent, setHomeContent] = useState<MallHomeContent | null>(null);
  const [isHomeContentLoading, setIsHomeContentLoading] = useState(true);
  const [homeContentLoadError, setHomeContentLoadError] = useState<Error | null>(null);

  const loadHomeContent = useCallback(async () => {
    setIsHomeContentLoading(true);
    setHomeContentLoadError(null);
    try {
      const response = await fetchMallHomeContent();
      setHomeContent(response.data);
    } catch (error) {
      setHomeContentLoadError(error as Error);
    } finally {
      setIsHomeContentLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHomeContent();
  }, [loadHomeContent]);

  const navigateToProductDetail = useCallback((productId: number) => {
    router.push({ pathname: '/product/[id]', params: { id: productId } });
  }, []);

  if (isHomeContentLoading || homeContentLoadError) {
    return (
      <RemoteResourceState
        isLoading={isHomeContentLoading}
        hasError={Boolean(homeContentLoadError)}
        errorColor={colors.error}
        onRetry={loadHomeContent}
      />
    );
  }

  if (!homeContent) {
    return <View style={[styles.container, styles.center]} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView stickyHeaderIndices={[0]} showsVerticalScrollIndicator={false}>
        <HomeHeader />
        <BannerSection bannerList={homeContent.advertiseList} />
        <CategorySection colors={colors} />
        {homeContent.brandList.length > 0 && <BrandSection brandList={homeContent.brandList} colors={colors} />}
        {homeContent.homeFlashPromotion && (
          <FlashSection
            flashPromotion={homeContent.homeFlashPromotion}
            colors={colors}
            onProductPress={navigateToProductDetail}
          />
        )}
        <ProductGridSection
          title={t('home.sections.new_products')}
          subtitle={t('home.sections.new_products_subtitle')}
          productList={homeContent.newProductList}
          colors={colors}
          onProductPress={navigateToProductDetail}
        />
        <ProductGridSection
          title={t('home.sections.hot_recommend')}
          subtitle={t('home.sections.hot_recommend_subtitle')}
          productList={homeContent.hotProductList}
          colors={colors}
          onProductPress={navigateToProductDetail}
        />
        <View style={styles.footerSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

function HomeHeader() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme] as typeof Colors.light;

  return (
    <View style={[styles.header, { backgroundColor: colors.background }]}> 
      <TouchableOpacity style={styles.searchBox}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.fontColorLight} />
        <Text style={[styles.searchText, { color: colors.fontColorLight }]}>{t('common.search_placeholder')}</Text>
      </TouchableOpacity>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.headerIcon}>
          <IconSymbol name="qrcode.viewfinder" size={24} color={colors.fontColorDark} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIcon}>
          <IconSymbol name="bell" size={24} color={colors.fontColorDark} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function BannerSection({ bannerList }: { bannerList: MallBanner[] }) {
  return (
    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
      {bannerList.map((banner) => (
        <TouchableOpacity key={banner.id} activeOpacity={0.9}>
          <Image source={{ uri: banner.pic }} style={styles.bannerImage} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

function CategorySection({ colors }: { colors: typeof Colors.light }) {
  const { t } = useTranslation();

  return (
    <View style={styles.categorySection}>
      {homeCategoryActions.map((action) => (
        <TouchableOpacity key={action.translationKey} style={styles.categoryItem}>
          <View style={[styles.categoryIconBox, { backgroundColor: `${colors.primary}20` }]}>
            <IconSymbol name={action.iconName} size={32} color={colors.primary} />
          </View>
          <Text style={[styles.categoryName, { color: colors.fontColorDark }]}>{t(action.translationKey)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function BrandSection({ brandList, colors }: { brandList: MallBrand[]; colors: typeof Colors.light }) {
  const { t } = useTranslation();

  return (
    <>
      <SectionHeader title={t('home.sections.brand_direct')} subtitle={t('home.sections.brand_direct_subtitle')} />
      <View style={styles.brandGrid}>
        {brandList.slice(0, 4).map((brand) => (
          <TouchableOpacity key={brand.id} style={styles.brandItem}>
            <Image source={{ uri: brand.logo }} style={styles.brandLogo} resizeMode="contain" />
            <Text style={[styles.brandName, { color: colors.fontColorDark }]}>{brand.name}</Text>
            <Text style={[styles.brandCount, { color: colors.fontColorLight }]}>
              {t('home.product.item_count', { count: brand.productCount })}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

function FlashSection({
  flashPromotion,
  colors,
  onProductPress,
}: {
  flashPromotion: MallFlashPromotion;
  colors: typeof Colors.light;
  onProductPress: (id: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <>
      <SectionHeader title={t('home.sections.flash_sale')} subtitle={t('home.sections.flash_sale_subtitle')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flashScroll}>
        {flashPromotion.productList.map((product) => (
          <TouchableOpacity key={product.id} style={styles.flashItem} onPress={() => onProductPress(product.id)}>
            <Image source={{ uri: product.pic }} style={styles.flashImage} />
            <Text numberOfLines={1} style={[styles.productTitle, { color: colors.fontColorDark }]}>
              {product.name}
            </Text>
            <Text style={[styles.price, { color: colors.primary }]}>￥{product.price}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

function ProductGridSection({
  title,
  subtitle,
  productList,
  colors,
  onProductPress,
}: {
  title: string;
  subtitle: string;
  productList: MallProductSummary[];
  colors: typeof Colors.light;
  onProductPress: (id: number) => void;
}) {
  return (
    <>
      <SectionHeader title={title} subtitle={subtitle} />
      <View style={styles.productGrid}>
        {productList.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productItem} onPress={() => onProductPress(product.id)}>
            <Image source={{ uri: product.pic }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text numberOfLines={1} style={[styles.productTitle, { color: colors.fontColorDark }]}>
                {product.name}
              </Text>
              <Text numberOfLines={1} style={[styles.productSubtitle, { color: colors.fontColorLight }]}>
                {product.subTitle}
              </Text>
              <Text style={[styles.price, { color: colors.primary }]}>￥{product.price}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme] as typeof Colors.light;

  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleBox}>
        <Text style={[styles.sectionTitle, { color: colors.fontColorDark }]}>{title}</Text>
        <Text style={[styles.sectionSubtitle, { color: colors.fontColorLight }]}>{subtitle}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.fontColorLight} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 10,
  },
  searchBox: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchText: {
    marginLeft: 8,
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerIcon: {
    marginLeft: 15,
  },
  bannerContainer: {
    height: 180,
  },
  bannerImage: {
    width: windowWidth - 30,
    height: 160,
    marginHorizontal: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  categorySection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 13,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  sectionTitleBox: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  brandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  brandItem: {
    width: (windowWidth - 40) / 2,
    marginHorizontal: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  brandLogo: {
    width: 80,
    height: 40,
    marginBottom: 10,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '500',
  },
  brandCount: {
    fontSize: 11,
    marginTop: 2,
  },
  flashScroll: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingBottom: 20,
  },
  flashItem: {
    width: 140,
    marginHorizontal: 5,
  },
  flashImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  productItem: {
    width: (windowWidth - 30) / 2,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  productImage: {
    width: (windowWidth - 30) / 2,
    height: (windowWidth - 30) / 2,
    borderRadius: 8,
  },
  productInfo: {
    paddingVertical: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  productSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  footerSpacer: {
    height: 100,
  },
});
